import test from 'node:test';
import assert from 'node:assert/strict';
import {reviewSessionCookie,readReviewSession} from '../src/data/review-session.mjs';
import {participationTicket,verifyParticipationTicket} from '../src/data/review-participation.mjs';
import {reviewRequest} from '../src/data/stakeholder-review.mjs';
import {scryptSync} from 'node:crypto';
const id='a'.repeat(32),now=Date.parse('2026-11-12T14:00:00Z'),code='ABCDEFGHIJKLMNOPQRST',salt='b'.repeat(32);
const record={salt,codeHash:scryptSync(code,Buffer.from(salt,'hex'),32).toString('hex'),expiresAt:'2026-11-19T17:00:00Z',article:{title:'Draft',body:'Private context',tags:[]}};
test('read session is secure, short-lived, snapshot-scoped and rejects tampering',()=>{
 const cookie=reviewSessionCookie(id,record,null,now);
 assert.match(cookie,/HttpOnly; Secure; SameSite=Strict/);assert.match(cookie,/Max-Age=1200/);assert.match(cookie,new RegExp('Path=/review/'+id+'/'));
 assert(!cookie.includes(code));assert(readReviewSession(cookie,id,record,now));
 assert.equal(readReviewSession(cookie,'b'.repeat(32),record,now),null);
 assert.equal(readReviewSession(cookie,id,record,now+1200000),null);
 assert.equal(readReviewSession(cookie,id,{...record,article:{...record.article,body:'Edited'}},now),null);
 const broken=cookie.replace('cl_review=','cl_review=x');assert.equal(readReviewSession(broken,id,record,now),null);
});
test('sessions never exceed the article expiry and cannot be confused with submission tickets',()=>{
 const short={...record,expiresAt:new Date(now+60000).toISOString()};assert.match(reviewSessionCookie(id,short,null,now),/Max-Age=60/);
 const cookie=reviewSessionCookie(id,record,null,now);assert.equal(verifyParticipationTicket(cookie.split(';')[0].split('=')[1],id,record,now),null);
 assert.equal(readReviewSession('cl_review='+participationTicket(id,record,now),id,record,now),null);
});
test('valid code requests a redirect; subsequent GET and refresh can read without a POST',async()=>{
 const options={directory:'/private/reviews',now,load:async()=>JSON.stringify(record)};
 const url='https://wearecodelovers.com/review/'+id+'/';
 const posted=await reviewRequest(new Request(url,{method:'POST',headers:{origin:'https://wearecodelovers.com','content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({code})}),id,options);
 assert.equal(posted.redirect,true);
 for(let i=0;i<2;i++){
  const r=await reviewRequest(new Request(url,{headers:{cookie:posted.accessCookie}}),id,options);assert.equal(r.article.body,'Private context');assert(!r.locked);
 }
 assert.equal((await reviewRequest(new Request(url),id,options)).locked,true);
});
