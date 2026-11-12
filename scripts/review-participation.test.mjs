import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,readdir,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {scryptSync} from 'node:crypto';
import {participationTicket,verifyParticipationTicket,recordParticipation} from '../src/data/review-participation.mjs';
import {reviewRequest} from '../src/data/stakeholder-review.mjs';
const id='a'.repeat(32),now=Date.parse('2026-11-12T14:00:00Z'),code='ABCDEFGHIJKLMNOPQRST',salt='b'.repeat(32);
const record={salt,codeHash:scryptSync(code,Buffer.from(salt,'hex'),32).toString('hex'),expiresAt:'2026-11-19T17:00:00Z',article:{title:'Draft',body:'Private context',tags:[],visuals:{}}};
const payload=()=>new URLSearchParams({choice:'stock',role:'technology',comment:'Keep records connected.',consent:'yes'});
test('tickets expire, bind the exact snapshot and reject forgery',()=>{
 const token=participationTicket(id,record,now);
 assert(verifyParticipationTicket(token,id,record,now));
 assert.equal(verifyParticipationTicket(token+'a',id,record,now),null);
 assert.equal(verifyParticipationTicket(token,'c'.repeat(32),record,now),null);
 assert.equal(verifyParticipationTicket(token,id,record,now+20*60*1000),null);
 assert.equal(verifyParticipationTicket(token,id,{...record,article:{...record.article,body:'Changed'}},now),null);
});
test('responses persist privately and replay cannot overwrite them',async()=>{
 const directory=await mkdtemp(join(tmpdir(),'review-response-'));
 try{
  const ticket=verifyParticipationTicket(participationTicket(id,record,now),id,record,now);
  await recordParticipation(payload(),ticket,{directory,now});
  const files=await readdir(directory);assert.equal(files.length,1);
  const saved=JSON.parse(await readFile(join(directory,files[0]),'utf8'));
  assert.equal(saved.choice,'stock');assert.equal(saved.role,'technology');assert(!('email' in saved));assert(!('ip' in saved));assert(!('code' in saved));
  const other=payload();other.set('choice','costs');assert.match(await recordParticipation(other,ticket,{directory,now}),/already received/);
  assert.equal(JSON.parse(await readFile(join(directory,files[0]),'utf8')).choice,'stock');
 }finally{await rm(directory,{recursive:true,force:true});}
});
test('consent and valid choices are required; storage failure never claims success',async()=>{
 const ticket=verifyParticipationTicket(participationTicket(id,record,now),id,record,now);
 for(const [key,value] of [['consent',''],['choice','unknown'],['role','unknown'],['comment','x'.repeat(501)]]){
  const p=payload();p.set(key,value);await assert.rejects(recordParticipation(p,ticket,{directory:'/unused'}));
 }
 await assert.rejects(recordParticipation(payload(),ticket,{directory:'/unused',write:async()=>{throw new Error('read only');}}),/could not save/);
});
test('authenticated survey POST records data; unauthenticated POST cannot',async()=>{
 const directory=await mkdtemp(join(tmpdir(),'review-flow-'));
 const options={directory:'/private/reviews',responseDirectory:directory,now,load:async()=>JSON.stringify(record)};
 const req=p=>new Request('https://wearecodelovers.com/review/'+id+'/',{method:'POST',headers:{origin:'https://wearecodelovers.com','content-type':'application/x-www-form-urlencoded'},body:p});
 try{
  const opened=await reviewRequest(req(new URLSearchParams({code})),id,options);assert(opened.ticket);
  const p=payload();p.set('action','participate');p.set('ticket','invalid');assert.equal((await reviewRequest(req(p),id,options)).status,401);assert.equal((await readdir(directory)).length,0);
  p.set('ticket',opened.ticket);const submitted=await reviewRequest(req(p),id,options);assert.equal(submitted.survey.saved,true);assert.equal(submitted.ticket,null);assert.equal((await readdir(directory)).length,1);
 }finally{await rm(directory,{recursive:true,force:true});}
});
