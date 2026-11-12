import {createHmac,randomBytes,timingSafeEqual} from 'node:crypto';
import {articleRevision} from './review-participation.mjs';
const name='cl_review';
const mac=(value,record)=>createHmac('sha256',Buffer.from(record.codeHash,'hex')).update(value).digest();
export function reviewSessionCookie(id,record,feedback=null,now=Date.now()) {
  const until=Math.min(now+20*60*1000,Date.parse(record.expiresAt));
  const payload={purpose:'read-review',id,revision:articleRevision(record.article),until,nonce:randomBytes(16).toString('hex'),feedback};
  const data=Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${name}=${data}.${mac(data,record).toString('hex')}; Path=/review/${id}/; Max-Age=${Math.max(0,Math.floor((until-now)/1000))}; HttpOnly; Secure; SameSite=Strict`;
}
export function readReviewSession(header,id,record,now=Date.now()) {
  try {
    const token=(header||'').split(';').map(s=>s.trim()).find(s=>s.startsWith(name+'='))?.slice(name.length+1);
    if(!token||token.length>1500)return null;
    const [data,signature,...extra]=token.split('.');
    if(extra.length||!data||!/^[a-f0-9]{64}$/.test(signature)||!timingSafeEqual(mac(data,record),Buffer.from(signature,'hex')))return null;
    const p=JSON.parse(Buffer.from(data,'base64url').toString());
    if(p.purpose!=='read-review'||p.id!==id||p.revision!==articleRevision(record.article)||!Number.isFinite(p.until)||p.until<=now||p.until>now+20*60*1000||p.until>Date.parse(record.expiresAt))return null;
    return p;
  }catch{return null;}
}
