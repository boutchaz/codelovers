import test from 'node:test';
import assert from 'node:assert/strict';
import {scryptSync} from 'node:crypto';
import {reviewRequest,reviewHeaders} from '../src/data/stakeholder-review.mjs';
const id='a'.repeat(32),code='ABCDEFGHIJKLMNOPQRST'.replace(/[0189]/g,'A');
const salt='b'.repeat(32),body='Private article body';
const record={salt,codeHash:scryptSync(code,Buffer.from(salt,'hex'),32).toString('hex'),expiresAt:'2026-11-19T17:00:00Z',article:{title:'Private title',body,tags:[]}};
const options={directory:'/private/reviews',now:Date.parse('2026-11-12T14:00:00Z'),load:async()=>JSON.stringify(record)};
const request=(value=code,origin='https://wearecodelovers.com')=>new Request('https://wearecodelovers.com/review/'+id+'/',{method:'POST',headers:{origin,'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({code:value})});
test('GET exposes neither article nor code hash',async()=>{
 assert.deepEqual(await reviewRequest(new Request('https://example.com'),id,options),{status:200,locked:true,error:null,article:null,expiresAt:null});
});
test('correct code opens snapshot; wrong code and missing code do not',async()=>{
 assert.equal((await reviewRequest(request(),id,options)).article.body,body);
 for(const value of ['','Z'.repeat(20),'code in URL'])assert.equal((await reviewRequest(request(value),id,options)).status,401);
});
test('expired, missing, malformed and traversal records fail closed',async()=>{
 for(const value of ['../secret','',id+'/other'])assert.equal((await reviewRequest(request(),value,options)).status,404);
 assert.equal((await reviewRequest(request(),id,{...options,now:Date.parse(record.expiresAt)})).status,404);
 assert.equal((await reviewRequest(request(),id,{...options,load:async()=>{throw new Error('ENOENT');}})).status,404);
 assert.equal((await reviewRequest(request(),id,{...options,load:async()=>'{}'})).status,404);
 assert.equal((await reviewRequest(request(),id,{...options,directory:undefined})).status,404);
});
test('rejects foreign origin, unsupported type, oversized body and methods',async()=>{
 for (const origin of ['https://other.example','null']) assert.equal((await reviewRequest(request(code,origin),id,options)).status,403);
 const wrongType=new Request('https://example.com',{method:'POST',headers:{origin:'https://wearecodelovers.com'},body:'{}'});
 assert.equal((await reviewRequest(wrongType,id,options)).status,415);
 assert.equal((await reviewRequest(request('A'.repeat(9000)),id,options)).status,413);
 assert.equal((await reviewRequest(new Request('https://example.com',{method:'DELETE'}),id,options)).status,405);
});
test('private headers prevent caching, indexing, framing and analytics',()=>{
 assert.equal(reviewHeaders['Referrer-Policy'],'same-origin','Keep same-site form Origin while withholding cross-site referrers');
 assert.match(reviewHeaders['Cache-Control'],/no-store/);
 assert.match(reviewHeaders['X-Robots-Tag'],/noindex/);
 assert.match(reviewHeaders['Content-Security-Policy'],/frame-ancestors 'none'/);
 assert.match(reviewHeaders['Content-Security-Policy'],/script-src 'none'/);
});
test('private analytics exclude credentials and booking redirect requires a valid session',async()=>{
 const events=[];const opts={...options,track:(...args)=>events.push(args)};
 const locked=await reviewRequest(new Request('https://wearecodelovers.com/review/'+id+'/?action=book'),id,opts);
 assert.equal(locked.locked,true);assert.equal(events.length,0);
 const auth=await reviewRequest(request(),id,opts);
 const headers={cookie:auth.accessCookie.split(';')[0]};
 const opened=await reviewRequest(new Request('https://wearecodelovers.com/review/'+id+'/',{headers}),id,opts);
 assert.equal(opened.status,200);assert.equal(events[0][0],'article_review_opened');
 const redirected=await reviewRequest(new Request('https://wearecodelovers.com/review/'+id+'/?action=book',{headers}),id,opts);
 assert.equal(redirected.bookingRedirect,true);assert.equal(events[1][0],'article_booking_clicked');
 assert.ok(!JSON.stringify(events).includes(code));assert.ok(!JSON.stringify(events).includes(record.codeHash));assert.ok(!JSON.stringify(events).includes(body));assert.ok(!JSON.stringify(events).includes(id));
});
