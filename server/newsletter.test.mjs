import {test,expect} from 'bun:test';
import {makeHandler} from './inquiry.mjs';
const env={NEWSLETTER_ENABLED:'true',BREVO_API_KEY:'server-secret',BREVO_NEWSLETTER_LIST_EN:'10',BREVO_NEWSLETTER_LIST_FR:'11',BREVO_DOI_TEMPLATE_EN:'20',BREVO_DOI_TEMPLATE_FR:'21'};
const input={email:' reader@example.com ',language:'en',consent:true};
const request=(body=input,origin='https://wearecodelovers.com')=>new Request('https://wearecodelovers.com/api/newsletter',{method:'POST',headers:{origin,'content-type':'application/json'},body:JSON.stringify(body)});
test('newsletter uses DOI only, fixed destination and isolated language lists',async()=>{
  const calls=[];const handler=makeHandler(env,async(url,options)=>{calls.push({url,...options});return new Response(null,{status:201});});
  for(const language of ['en','fr']) expect((await handler(request({...input,language,includeListIds:[999],redirectionUrl:'https://evil.example',confirmed:true}))).status).toBe(200);
  expect(calls.length).toBe(2);
  const first=JSON.parse(calls[0].body), second=JSON.parse(calls[1].body);
  expect(calls[0].url).toBe('https://api.brevo.com/v3/contacts/doubleOptinConfirmation');
  expect(calls[0].headers['api-key']).toBe('server-secret');expect(calls[0].redirect).toBe('error');
  expect(first.email).toBe('reader@example.com');expect(first.includeListIds).toEqual([10]);expect(first.excludeListIds).toEqual([11]);
  expect(second.includeListIds).toEqual([11]);expect(second.templateId).toBe(21);
  expect(first.redirectionUrl).toBe('https://wearecodelovers.com/newsletter/confirmed/?language=en');
  expect(first.contactPixelTrackingConsent).toBe(false);expect(first.attributes.NEWSLETTER_CONSENT_VERSION).toBe('codelovers-newsletter-v1');
});
test('newsletter blocks invalid consent, email, language and cross-site requests',async()=>{
  const handler=makeHandler(env,()=>{throw Error('No delivery allowed');});
  for(const patch of [{consent:false},{consent:'true'},{language:'de'},{email:'x@example.com\nBcc:a@example.com'},{email:'bad'}, {email:'x'.repeat(255)+'@example.com'}]) expect((await handler(request({...input,...patch}))).status).toBe(400);
  expect((await handler(request(input,'https://evil.example'))).status).toBe(403);
});
test('missing or disabled configuration never sends or reports success',async()=>{
  for(const patch of [{NEWSLETTER_ENABLED:'false'},{BREVO_API_KEY:''},{BREVO_NEWSLETTER_LIST_EN:'0'},{BREVO_NEWSLETTER_LIST_EN:'11'},{BREVO_DOI_TEMPLATE_EN:'NaN'}]) {
    const result=await makeHandler({...env,...patch},()=>{throw Error('No delivery');})(request());expect(result.status).toBe(503);
  }
});
test('provider failures stay private and allow retry; success has a cooldown',async()=>{
  let attempts=0;
  const handler=makeHandler(env,async()=>{attempts++;return new Response('private provider details',{status:attempts===1?500:201});});
  const failure=await handler(request());expect(failure.status).toBe(503);expect(await failure.text()).not.toContain('private provider details');
  expect(await (await handler(request())).json()).toEqual({accepted:true});
  expect(await (await handler(request())).json()).toEqual({accepted:true});expect(attempts).toBe(2);
});
test('honeypot and oversized input never contact the newsletter service',async()=>{
  const handler=makeHandler(env,()=>{throw Error('No delivery');});
  expect(await (await handler(request({...input,website:'spam'}))).json()).toEqual({accepted:true});
  expect((await handler(request({...input,extra:'a'.repeat(25000)}))).status).toBe(413);
});

test('concurrent requests share provider failure instead of premature success',async()=>{
  let finish,called=0;
  const waiting=new Promise(resolve=>{finish=resolve;});
  const handler=makeHandler(env,async()=>{called++;await waiting;return new Response(null,{status:500});});
  const a=handler(request()), b=handler(request());
  await new Promise(resolve=>setTimeout(resolve,5));finish();
  expect((await a).status).toBe(503);expect((await b).status).toBe(503);expect(called).toBe(1);
});
