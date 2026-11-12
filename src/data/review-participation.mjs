import {createHmac,createHash,randomBytes,timingSafeEqual} from 'node:crypto';
import {writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';

export const choices=['field-work','teams','stock','costs','reliable-data'];
export const roles=['farm-team','agronomy','research','technology','other'];
export const articleRevision=article=>createHash('sha256').update(JSON.stringify(article)).digest('hex');
const signature=(data,key)=>createHmac('sha256',Buffer.from(key,'hex')).update(data).digest();
export function participationTicket(id,record,now=Date.now()) {
 const payload={purpose:'participation',id,nonce:randomBytes(16).toString('hex'),until:Math.min(now+20*60*1000,Date.parse(record.expiresAt)),revision:articleRevision(record.article)};
 const data=Buffer.from(JSON.stringify(payload)).toString('base64url');
 return data+'.'+signature(data,record.codeHash).toString('hex');
}
export function verifyParticipationTicket(token,id,record,now=Date.now()) {
 try {
  const [data,mac,...extra]=token.split('.');
  if(extra.length || !data || data.length>700 || !/^[a-f0-9]{64}$/.test(mac))return null;
  if(!timingSafeEqual(signature(data,record.codeHash),Buffer.from(mac,'hex')))return null;
  const p=JSON.parse(Buffer.from(data,'base64url').toString());
  return p.purpose==='participation' && p.id===id && /^[a-f0-9]{32}$/.test(p.nonce) && Number.isFinite(p.until) && p.until>now && p.until<=now+20*60*1000 && p.until<=Date.parse(record.expiresAt) && p.revision===articleRevision(record.article) ? p:null;
 }catch{return null;}
}
export async function recordParticipation(params,ticket,{directory,now=Date.now(),write=writeFile}={}) {
 if(!ticket || !/^[a-f0-9]{32}$/.test(ticket.id) || !/^[a-f0-9]{32}$/.test(ticket.nonce) || !/^[a-f0-9]{64}$/.test(ticket.revision))throw new Error('Invalid form session. Reopen the article with its access code.');
 const choice=params.get('choice'),role=params.get('role'),comment=(params.get('comment')||'').trim();
 if(!directory)throw new Error('Participation is not enabled for this preview.');
 if(!choices.includes(choice)||!roles.includes(role)||comment.length>500||params.get('consent')!=='yes')throw new Error('Choose one challenge and your role, and agree to share the response. Keep the comment under 500 characters.');
 const response={reviewId:ticket.id,articleRevision:ticket.revision,surveyVersion:1,choice,role,comment,createdAt:new Date(now).toISOString()};
 try {await write(resolve(directory,ticket.id+'-'+ticket.nonce+'.json'),JSON.stringify(response)+'\n',{flag:'wx',mode:0o600});}
 catch(error){if(error.code==='EEXIST')return 'Your response was already received. Thank you.';throw new Error('We could not save your response. Please retry; nothing has been marked as received.');}
 return 'Your response has been recorded privately. Thank you for helping shape AgroGina.';
}
