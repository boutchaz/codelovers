import {createHash} from 'node:crypto';
const json = (value,status=200) => Response.json(value,{status,headers:{'Cache-Control':'no-store'}});
const positiveId = value => /^\d+$/.test(value || '') && Number.isSafeInteger(Number(value)) && Number(value)>0;
export function makeNewsletterSignup(env=process.env, requestFetch=fetch, now=Date.now) {
  // Small per-process cooldown supplements nginx's global request limit; resets on restart.
  const recent = new Map();
  return async input => {
    const email = typeof input.email==='string' ? input.email.trim().toLowerCase() : '';
    const lang = input.language;
    if (input.consent!==true || !['en','fr'].includes(lang) || email.length>254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({error:'Choose a language, enter an email and consent to the newsletter.'},400);
    const suffix=lang.toUpperCase();
    const list=env[`BREVO_NEWSLETTER_LIST_${suffix}`], template=env[`BREVO_DOI_TEMPLATE_${suffix}`];
    const otherList=env[`BREVO_NEWSLETTER_LIST_${lang==='en'?'FR':'EN'}`];
    if(env.NEWSLETTER_ENABLED!=='true' || !env.BREVO_API_KEY || !positiveId(list) || !positiveId(otherList) || Number(list)===Number(otherList) || !positiveId(template)) return json({error:'Newsletter signup is not available yet.'},503);
    const key=createHash('sha256').update(email+'\0'+lang).digest('hex');
    const cached=recent.get(key);
    if(cached && cached.until>now()) return (await cached.result).clone();
    if(recent.size>=2048) recent.delete(recent.keys().next().value);
    const result=(async()=>{
    try {
      const response=await requestFetch('https://api.brevo.com/v3/contacts/doubleOptinConfirmation',{
        method:'POST',redirect:'error',signal:AbortSignal.timeout(15000),
        headers:{'api-key':env.BREVO_API_KEY,'Content-Type':'application/json'},
        body:JSON.stringify({email,includeListIds:[Number(list)],excludeListIds:[Number(otherList)],templateId:Number(template),
          redirectionUrl:`https://wearecodelovers.com/newsletter/confirmed/?language=${lang}`,
          contactPixelTrackingConsent:false,
          attributes:{NEWSLETTER_LANGUAGE:lang,NEWSLETTER_CONSENT_VERSION:'codelovers-newsletter-v1',
            NEWSLETTER_SIGNUP_AT:new Date(now()).toISOString()}})});
      if(!response.ok) throw Error('Provider did not accept');
      return json({accepted:true});
    } catch {
      return json({error:'We could not request confirmation. Please try again later.'},503);
    }
    })();
    recent.set(key,{until:now()+15*60*1000,result});
    const response=await result;
    if(!response.ok && recent.get(key)?.result===result) recent.delete(key);
    return response.clone();
  };
}
