import {test,expect} from 'bun:test';
import {makeHandler} from './inquiry.mjs';
const env={ERP_INTAKE_API_KEY:'test-key',ERP_INTAKE_API_SECRET:'test-secret'};
const request=(payload={},headers={})=>new Request('https://wearecodelovers.com/api/inquiry',{method:'POST',headers:{origin:'https://wearecodelovers.com','content-type':'application/json',...headers},body:JSON.stringify(payload)});
test('blocks cross-site submissions and unsupported content types',async()=>{
  const fetcher=()=>{throw Error('Must not contact ERP');};const handle=makeHandler(env,fetcher);
  expect((await handle(request({}, {origin:'https://evil.example'}))).status).toBe(403);
  expect((await handle(request({}, {'content-type':'text/plain'}))).status).toBe(415);
});
test('blocks large streaming bodies and quietly discards honeypot spam',async()=>{
  const handle=makeHandler(env,()=>{throw Error('Must not call ERP');});
  expect((await handle(request({message:'x'.repeat(30000)}))).status).toBe(413);
  expect(await (await handle(request({website:'spam'}))).json()).toEqual({accepted:true,recorded:false});
});
test('keeps credentials server-side and forwards only permitted fields',async()=>{
  let sent;const handle=makeHandler(env,async(url,options)=>{sent={url,...options};return Response.json({message:{accepted:true}});});
  const response=await handle(request({full_name:'QA',consent:true,status:'Converted',ignore_permissions:true}));
  expect(await response.json()).toEqual({accepted:true,recorded:true});
  expect(sent.headers.Authorization).toBe('token test-key:test-secret');expect(sent.redirect).toBe('error');
  expect(JSON.parse(sent.body).payload.status).toBeUndefined();
});
test('does not claim success when ERP rejects or fails to confirm',async()=>{
  for(const reply of [new Response('private traceback',{status:500}),Response.json({message:{accepted:false}})]){
    const response=await makeHandler(env,async()=>reply)(request());expect(response.status).toBe(503);
    expect(await response.text()).not.toContain('private traceback');
  }
  expect((await makeHandler({},fetch)(request())).status).toBe(503);
});
