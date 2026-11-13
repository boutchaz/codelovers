import {test,expect} from 'bun:test';
import {mkdtemp,readFile,readdir,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {publicFeedback} from '../src/data/public-feedback.mjs';
const input={request_id:'a'.repeat(32),choice:'field-work',role:'farm-team',comment:'QA isolated fixture',consent:'yes'};
const request=(fields=input,origin='https://wearecodelovers.com')=>new Request('https://wearecodelovers.com/api/article-feedback/',{method:'POST',headers:{origin,'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams(fields)});
test('public feedback rejects foreign origins and oversized bodies without saving',async()=>{
 let saves=0;const options={save:async()=>{saves++;}};
 expect((await publicFeedback(request(input,'https://elsewhere.test'),options)).status).toBe(403);
 expect((await publicFeedback(request({...input,comment:'x'.repeat(9000)}),options)).status).toBe(413);
 expect(saves).toBe(0);
});
test('consented public response is private, retry-safe and analytics omit free text',async()=>{
 const directory=await mkdtemp(join(tmpdir(),'article-feedback-'));const events=[];
 try{
  const opts={directory,track:(...args)=>events.push(args)};
  expect((await publicFeedback(request(),opts)).status).toBe(200);
  expect((await publicFeedback(request(),opts)).status).toBe(200);
  const files=await readdir(directory);expect(files).toHaveLength(1);
  expect(JSON.parse(await readFile(join(directory,files[0]),'utf8')).comment).toBe(input.comment);
  expect(events).toHaveLength(1);expect(events[0][2].audience).toBe('public');expect(JSON.stringify(events)).not.toContain(input.comment);
  expect((await publicFeedback(request({...input,request_id:'b'.repeat(32),consent:'no'}),opts)).status).toBe(400);
 }finally{await rm(directory,{recursive:true});}
});
