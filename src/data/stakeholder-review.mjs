import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {scrypt, timingSafeEqual} from 'node:crypto';
import {promisify} from 'node:util';
import {participationTicket,verifyParticipationTicket,recordParticipation} from './review-participation.mjs';

const derive = promisify(scrypt);
const ID = /^[a-f0-9]{32}$/;
export const reviewHeaders = {
  'Cache-Control': 'private, no-store',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
  'Referrer-Policy': 'same-origin',
  'X-Content-Type-Options': 'nosniff',
  'Content-Security-Policy': "frame-ancestors 'none'; script-src 'none'; connect-src 'none'; form-action 'self'; object-src 'none'; base-uri 'none'",
};

export async function reviewRequest(request, id, {directory=process.env.STAKEHOLDER_REVIEW_DIR,responseDirectory=process.env.STAKEHOLDER_RESPONSE_DIR, now=Date.now(), load=readFile}={}) {
  const denied = (status=404) => ({status, error:'This review is unavailable, expired, or the access code is incorrect.',locked:false,article:null,expiresAt:null});
  if (!directory || !ID.test(id || '')) return denied();
  if (!['GET','POST'].includes(request.method)) return denied(405);
  let record;
  try {
    record = JSON.parse(await load(resolve(directory, id+'.json'),'utf8'));
    if (!Number.isFinite(Date.parse(record.expiresAt)) || Date.parse(record.expiresAt)<=now ||
        !/^[a-f0-9]{32}$/.test(record.salt) || !/^[a-f0-9]{64}$/.test(record.codeHash)) return denied();
  } catch { return denied(); }
  if (request.method==='GET') return {status:200, locked:true,error:null,article:null,expiresAt:null};
  if (!['https://wearecodelovers.com','https://www.wearecodelovers.com'].includes(request.headers.get('origin'))) return denied(403);
  if (request.headers.get('content-type')?.split(';')[0]!=='application/x-www-form-urlencoded') return denied(415);
  const reader=request.body?.getReader();
  if (!reader) return denied(400);
  const chunks=[];let size=0;
  try {
    while (true) {
      const {done,value}=await reader.read();if(done)break;
      size+=value.byteLength;
      if(size>8192){await reader.cancel();return denied(413);}
      chunks.push(value);
    }
    const raw=Buffer.concat(chunks).toString('utf8');
    const params=new URLSearchParams(raw);
    let survey=null;
    if(params.get('action')==='participate'){
      const ticket=verifyParticipationTicket(params.get('ticket')||'',id,record,now);
      if(!ticket)return denied(401);
      try{survey={saved:true,message:await recordParticipation(params,ticket,{directory:responseDirectory,now})};}
      catch(error){survey={saved:false,message:error.message};}
    }else{
      const code=(params.get('code')||'').replace(/[\s-]/g,'').toUpperCase();
      if (!/^[A-Z2-7]{20}$/.test(code)) return denied(401);
      const actual=await derive(code,Buffer.from(record.salt,'hex'),32);
      if (!timingSafeEqual(actual,Buffer.from(record.codeHash,'hex'))) return denied(401);
    }
    const p=record.article;
    if (!p || typeof p.body!=='string' || p.body.length>60000 || typeof p.title!=='string' || !Array.isArray(p.tags)) return denied();
    return {status:200, article:p, expiresAt:record.expiresAt,locked:false,error:null,survey,ticket:responseDirectory&&!survey?.saved?participationTicket(id,record,now):null};
  } catch {return denied(400);}
}
