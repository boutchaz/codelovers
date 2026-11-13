import {randomBytes} from 'node:crypto';
import {recordParticipation,articleRevision} from './review-participation.mjs';
import {captureServer} from '../../server/analytics.mjs';
const slug='why-we-are-building-agrogina';
const origins=['https://wearecodelovers.com','https://www.wearecodelovers.com'];
export async function publicFeedback(request,{directory=process.env.STAKEHOLDER_RESPONSE_DIR,save=recordParticipation,track=captureServer}={}){
 const reply=(message,status=200)=>new Response(JSON.stringify({message}),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
 if(request.method!=='POST')return reply('Method not allowed',405);
 if(!origins.includes(request.headers.get('origin')))return reply('Invalid origin',403);
 if(request.headers.get('content-type')?.split(';')[0]!=='application/x-www-form-urlencoded')return reply('Form data required',415);
 const reader=request.body?.getReader();if(!reader)return reply('Missing response',400);
 let size=0;const chunks=[];
 while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>8192){await reader.cancel();return reply('Response too large',413);}chunks.push(value);}
 const params=new URLSearchParams(Buffer.concat(chunks).toString('utf8'));
 const id=params.get('request_id')||randomBytes(16).toString('hex');
 if(!/^[a-f0-9]{32}$/.test(id))return reply('Invalid request identifier',400);
 try{
  const message=await save(params,{id:articleRevision({slug}).slice(0,32),nonce:id,revision:articleRevision({slug,surveyVersion:1})},{directory,track:(event,identity,properties)=>track(event,identity,{...properties,audience:'public'})});
  const html='<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Thank you · CodeLovers</title><body style="background:#05060f;color:#ededed;font:18px system-ui;padding:40px;max-width:600px;margin:auto"><h1>Thank you for sharing your perspective</h1><p>'+message+'</p><a style="color:#fda4af" href="/blog/'+slug+'/#participate">Return to the article →</a></body></html>';
  return new Response(html,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','X-Robots-Tag':'noindex','Content-Security-Policy':"default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'"}});
 }catch{return reply('Choose a challenge and role, consent to sharing, and keep your example under 500 characters. If it still fails, please retry later.',400);}
}
