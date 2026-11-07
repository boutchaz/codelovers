import { pathToFileURL } from 'node:url';

// Read-only preflight for the newsletter: confirms the Brevo account matches the Dokploy settings before
// NEWSLETTER_ENABLED is switched on. It never sends mail, creates contacts or changes anything, and never
// prints the API key. Run with the same variables as the inquiry service:  bun scripts/check-brevo.mjs
const API = 'https://api.brevo.com/v3';
const ATTRIBUTES = ['NEWSLETTER_LANGUAGE', 'NEWSLETTER_CONSENT_VERSION', 'NEWSLETTER_SIGNUP_AT'];
const DOMAIN = 'wearecodelovers.com';
const positive = value => /^\d+$/.test(value || '') && Number(value) > 0;

export async function checkBrevo(env = process.env, request = fetch) {
  const results = [];
  const note = (ok, label, detail = '') => results.push({ ok, label, detail });
  if (!env.BREVO_API_KEY) { note(false, 'BREVO_API_KEY is set'); return results; }
  const get = async path => {
    try {
      const response = await request(`${API}${path}`, { redirect: 'error', signal: AbortSignal.timeout(15000), headers: { 'api-key': env.BREVO_API_KEY, accept: 'application/json' } });
      return response.ok ? { body: await response.json() } : { status: response.status };
    } catch { return { status: 0 }; }
  };
  const failure = reply => reply.status === 401 ? 'Brevo rejected the API key' : reply.status === 404 ? 'not found in this account' : `request failed (${reply.status})`;

  const account = await get('/account');
  note(!!account.body, 'API key is valid', account.body ? '' : failure(account));
  if (!account.body) return results;

  const ids = { EN: env.BREVO_NEWSLETTER_LIST_EN, FR: env.BREVO_NEWSLETTER_LIST_FR };
  for (const [language, id] of Object.entries(ids)) {
    if (!positive(id)) { note(false, `${language} list ID is a number`, 'BREVO_NEWSLETTER_LIST_' + language); continue; }
    const list = await get(`/contacts/lists/${id}`);
    note(!!list.body, `${language} list ${id} exists`, list.body ? `"${list.body.name}", ${list.body.uniqueSubscribers ?? 0} confirmed contacts` : failure(list));
  }
  note(positive(ids.EN) && positive(ids.FR) && Number(ids.EN) !== Number(ids.FR), 'EN and FR lists are different lists');

  for (const language of ['EN', 'FR']) {
    const id = env['BREVO_DOI_TEMPLATE_' + language];
    if (!positive(id)) { note(false, `${language} double-opt-in template ID is a number`, 'BREVO_DOI_TEMPLATE_' + language); continue; }
    const template = await get(`/smtp/templates/${id}`);
    if (!template.body) { note(false, `${language} template ${id} exists`, failure(template)); continue; }
    const t = template.body;
    note(t.isActive === true, `${language} template ${id} is active`, `"${t.name}"`);
    note(t.doiTemplate === true, `${language} template ${id} is a double-opt-in template`, 'create it as an API double-opt-in template, not a plain transactional one');
    note(/\{\{\s*doubleoptin\s*\}\}/i.test(t.htmlContent || ''), `${language} template ${id} contains the confirmation link`, 'add the {{ doubleoptin }} link');
  }

  const attributes = await get('/contacts/attributes');
  if (attributes.body) {
    const names = new Set((attributes.body.attributes || []).map(attribute => attribute.name));
    for (const name of ATTRIBUTES) note(names.has(name), `contact attribute ${name} exists`, 'create it as a Text attribute');
  } else note(false, 'contact attributes can be read', failure(attributes));

  const domain = await get(`/senders/domains/${DOMAIN}`);
  if (domain.body) {
    const authenticated = domain.body.authenticated === true || domain.body.verified === true;
    note(authenticated, `sending domain ${DOMAIN} is authenticated`, authenticated ? '' : 'finish the DKIM/DMARC records in Brevo');
  } else note(false, `sending domain ${DOMAIN} can be checked`, failure(domain));
  const senders = await get('/senders');
  if (senders.body) {
    const active = (senders.body.senders || []).some(sender => sender.active && sender.email.endsWith('@' + DOMAIN));
    note(active, `an active sender on @${DOMAIN} exists`, 'add and verify a sender such as tech@' + DOMAIN);
  } else note(false, 'senders can be read', failure(senders));

  return results;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const results = await checkBrevo();
  for (const { ok, label, detail } of results) console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? ` (${detail})` : ''}`);
  const failed = results.filter(result => !result.ok);
  console.log(failed.length ? `\n${failed.length} check(s) need attention before enabling the newsletter.` : '\nAll checks passed: set NEWSLETTER_ENABLED=true and PUBLIC_NEWSLETTER_ENABLED=true, then redeploy.');
  process.exitCode = failed.length ? 1 : 0;
}
