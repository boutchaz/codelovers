import { test, expect } from 'bun:test';
import { checkBrevo } from './check-brevo.mjs';

const env = { BREVO_API_KEY: 'secret-key', BREVO_NEWSLETTER_LIST_EN: '5', BREVO_NEWSLETTER_LIST_FR: '6',
  BREVO_DOI_TEMPLATE_EN: '11', BREVO_DOI_TEMPLATE_FR: '12' };
const template = (overrides = {}) => ({ name: 'Confirm', isActive: true, doiTemplate: true, htmlContent: '<a href="{{ doubleoptin }}">Confirm</a>', ...overrides });
const account = (routes = {}) => {
  const table = {
    '/account': {}, '/contacts/lists/5': { name: 'Newsletter EN', uniqueSubscribers: 2 }, '/contacts/lists/6': { name: 'Newsletter FR' },
    '/smtp/templates/11': template(), '/smtp/templates/12': template(),
    '/contacts/attributes': { attributes: ['NEWSLETTER_LANGUAGE', 'NEWSLETTER_CONSENT_VERSION', 'NEWSLETTER_SIGNUP_AT'].map(name => ({ name })) },
    '/senders/domains/wearecodelovers.com': { authenticated: true },
    '/senders': { senders: [{ email: 'tech@wearecodelovers.com', active: true }] }, ...routes };
  const calls = [];
  const request = async (url, options) => {
    const path = url.replace('https://api.brevo.com/v3', '');
    calls.push({ path, options });
    const body = table[path];
    return body === undefined ? new Response('{}', { status: 404 }) : body === 401 ? new Response('{}', { status: 401 }) : Response.json(body);
  };
  return { calls, request };
};
const failing = results => results.filter(result => !result.ok).map(result => result.label);

test('a fully configured account passes every check', async () => {
  const { request } = account();
  expect(failing(await checkBrevo(env, request))).toEqual([]);
});
test('only reads: GET requests with the key in a header, never in the URL', async () => {
  const { calls, request } = account();
  await checkBrevo(env, request);
  for (const { path, options } of calls) {
    expect(options.method).toBeUndefined();
    expect(options.headers['api-key']).toBe('secret-key');
    expect(path).not.toContain('secret-key');
  }
});
test('reports a rejected key and stops without probing anything else', async () => {
  const { calls, request } = account({ '/account': 401 });
  const results = await checkBrevo(env, request);
  expect(failing(results)).toEqual(['API key is valid']);
  expect(results[0].detail).toContain('rejected');
  expect(calls).toHaveLength(1);
});
test('flags missing configuration without calling Brevo', async () => {
  const { calls, request } = account();
  expect(failing(await checkBrevo({}, request))).toEqual(['BREVO_API_KEY is set']);
  expect(calls).toHaveLength(0);
});
test('catches the usual setup mistakes', async () => {
  const { request } = account({
    '/contacts/lists/6': undefined,
    '/smtp/templates/11': template({ isActive: false }),
    '/smtp/templates/12': template({ doiTemplate: false, htmlContent: '<a href="https://wearecodelovers.com">Confirm</a>' }),
    '/contacts/attributes': { attributes: [{ name: 'NEWSLETTER_LANGUAGE' }] },
    '/senders/domains/wearecodelovers.com': { authenticated: false, verified: false },
    '/senders': { senders: [{ email: 'tech@wearecodelovers.com', active: false }] } });
  expect(failing(await checkBrevo(env, request))).toEqual([
    'FR list 6 exists', 'EN template 11 is active', 'FR template 12 is a double-opt-in template',
    'FR template 12 contains the confirmation link', 'contact attribute NEWSLETTER_CONSENT_VERSION exists',
    'contact attribute NEWSLETTER_SIGNUP_AT exists', 'sending domain wearecodelovers.com is authenticated',
    'an active sender on @wearecodelovers.com exists']);
});
test('the same list or a non-numeric id is rejected', async () => {
  const { request } = account({ '/contacts/lists/6': { name: 'Same' }, '/contacts/lists/5': { name: 'Same' } });
  expect(failing(await checkBrevo({ ...env, BREVO_NEWSLETTER_LIST_FR: '5' }, request))).toContain('EN and FR lists are different lists');
  expect(failing(await checkBrevo({ ...env, BREVO_DOI_TEMPLATE_EN: 'abc' }, request))).toContain('EN double-opt-in template ID is a number');
});
