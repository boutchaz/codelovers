import {makeNewsletterSignup} from './newsletter.mjs';
import {makeBookingHandler,BOOKING_LIMIT} from './booking.mjs';
import { pathToFileURL } from 'node:url';
const ORIGINS = new Set(['https://wearecodelovers.com', 'https://www.wearecodelovers.com']);
const json = (value, status=200) => new Response(JSON.stringify(value), {status, headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
export function makeHandler(env=process.env, requestFetch=fetch) {
  const signup=makeNewsletterSignup(env,requestFetch);
  const booking=makeBookingHandler(env,requestFetch);
  return async function handle(request) {
    const path=new URL(request.url).pathname;
    if (!['/api/inquiry','/api/newsletter','/api/cal-webhook'].includes(path)) return json({error:'Not found'},404);
    if (request.method !== 'POST') return json({error:'Method not allowed'},405);
    // Server-to-server from Cal.com: no browser Origin, authenticated by HMAC signature instead.
    if (path==='/api/cal-webhook') return booking(request);
    if (!ORIGINS.has(request.headers.get('origin'))) return json({error:'Invalid origin'},403);
    if (!request.headers.get('content-type')?.startsWith('application/json')) return json({error:'JSON required'},415);
    let input;
    try {
      // Limit streamed bodies too; Content-Length alone is not trustworthy.
      const reader=request.body?.getReader(); if(!reader)return json({error:'Invalid inquiry'},400);
      const chunks=[]; let size=0;
      while(true){const {value,done}=await reader.read();if(done)break;size+=value.length;if(size>24576){await reader.cancel();return json({error:'Inquiry too large'},413);}chunks.push(value);}
      const body=new Uint8Array(size);let offset=0;for(const chunk of chunks){body.set(chunk,offset);offset+=chunk.length;}
      input=JSON.parse(new TextDecoder().decode(body));
    } catch { return json({error:'Invalid inquiry'},400); }
    if (!input || typeof input !== 'object' || Array.isArray(input)) return json({error:'Invalid inquiry'},400);
    if (input.website) return json({accepted:true,recorded:false}); // Quietly discard honeypot submissions.
    if(path==='/api/newsletter') return signup(input);
    if (!env.ERP_INTAKE_API_KEY || !env.ERP_INTAKE_API_SECRET) return json({error:'Contact form unavailable; please email us.'},503);
    let base;
    try { base=new URL(env.ERP_URL || 'https://erp.boutchaz.dev'); } catch { return json({error:'Contact form unavailable'},503); }
    if(base.protocol!=='https:' || base.username || base.password || base.pathname!=='/') return json({error:'Contact form unavailable'},503);
    const allowed=['request_id','full_name','email','organization','product','language','message','page_path','utm_source','utm_medium','utm_campaign','utm_content','consent'];
    const payload=Object.fromEntries(allowed.map(key=>[key,input[key]]));
    try {
      const response=await requestFetch(`${base.origin}/api/method/codelovers.inquiries.create`,{
        method:'POST',redirect:'error',signal:AbortSignal.timeout(20000),
        headers:{Authorization:`token ${env.ERP_INTAKE_API_KEY}:${env.ERP_INTAKE_API_SECRET}`,'Content-Type':'application/json'},
        body:JSON.stringify({payload})});
      // Never expose ERP exceptions, identifiers or authentication details to a visitor.
      if(!response.ok) return json({error:'We could not record your inquiry. Please retry or email us.'},503);
      const result=await response.json();
      if(result.message?.accepted!==true)return json({error:'Inquiry was not confirmed. Please retry.'},503);
      return json({accepted:true,recorded:true});
    } catch { return json({error:'We could not confirm delivery. Retry with this form or email us.'},503); }
  };
}
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) {
  // Each route enforces its own smaller limit; the server cap only has to admit the largest (booking webhooks).
  Bun.serve({port:8080,maxRequestBodySize:BOOKING_LIMIT,fetch:makeHandler()});
}
