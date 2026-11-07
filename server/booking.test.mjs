import {test,expect} from 'bun:test';
import {createHmac} from 'node:crypto';
import {makeHandler} from './inquiry.mjs';
import {bookingPayload,bookingRequestId,validSignature} from './booking.mjs';

const secret='cal-test-secret';
const env={CAL_WEBHOOK_SECRET:secret,ERP_INTAKE_API_KEY:'test-key',ERP_INTAKE_API_SECRET:'test-secret'};
const sign=(body,key=secret)=>createHmac('sha256',key).update(body).digest('hex');
const event=(overrides={},triggerEvent='BOOKING_CREATED')=>({triggerEvent,createdAt:'2026-11-07T10:00:00Z',payload:{
  uid:'booking-uid-1',title:'30 min between Codelovers and Amina',type:'30min',startTime:'2026-11-10T09:00:00Z',
  attendees:[{name:'Amina Benali',email:'Amina@Example.com',timeZone:'Africa/Casablanca',language:{locale:'fr'}}],
  additionalNotes:'We need an offline-first mobile app',responses:{company:{value:'Atlas Agro'}},...overrides}});
const webhook=(body,{signature=sign(body),headers={}}={})=>new Request('https://wearecodelovers.com/api/cal-webhook',
  {method:'POST',headers:{'content-type':'application/json',...(signature?{'x-cal-signature-256':signature}:{}),...headers},body});
const erp=(reply=()=>Response.json({message:{accepted:true}}))=>{const calls=[];return {calls,fetch:async(url,options)=>{calls.push({url,...options});return reply();}};};

test('rejects unsigned, wrongly signed and malformed-signature deliveries without contacting ERP',async()=>{
  const {calls,fetch}=erp();const handle=makeHandler(env,fetch);const body=JSON.stringify(event());
  for(const signature of [null,sign(body,'someone else'),'not-hex','a'.repeat(63),sign(body).toUpperCase().slice(0,60)]){
    expect((await handle(webhook(body,{signature}))).status).toBe(401);
  }
  // Signing a different body must not authorise this one.
  expect((await handle(webhook(body,{signature:sign(body+' '),}))).status).toBe(401);
  expect(calls).toHaveLength(0);
});
test('fails closed when no webhook secret is configured, even for a signature made with an empty key',async()=>{
  const {calls,fetch}=erp();const body=JSON.stringify(event());
  const response=await makeHandler({...env,CAL_WEBHOOK_SECRET:''},fetch)(webhook(body,{signature:sign(body,'')}));
  expect(response.status).toBe(503);expect(calls).toHaveLength(0);
});
test('accepts only POST on the webhook path and needs no browser origin',async()=>{
  const handle=makeHandler(env,erp().fetch);
  expect((await handle(new Request('https://wearecodelovers.com/api/cal-webhook',{method:'GET'}))).status).toBe(405);
  expect((await handle(webhook(JSON.stringify(event())))).status).toBe(200);
});
test('records a signed booking in ERP with the intake credential and a stable receipt',async()=>{
  const {calls,fetch}=erp();const handle=makeHandler(env,fetch);const body=JSON.stringify(event());
  const response=await handle(webhook(body));
  expect(await response.json()).toEqual({accepted:true});
  expect(calls).toHaveLength(1);expect(calls[0].url).toBe('https://erp.boutchaz.dev/api/method/codelovers.inquiries.record_booking');
  expect(calls[0].headers.Authorization).toBe('token test-key:test-secret');expect(calls[0].redirect).toBe('error');
  const {payload}=JSON.parse(calls[0].body);
  expect(payload).toMatchObject({full_name:'Amina Benali',email:'amina@example.com',organization:'Atlas Agro',language:'fr',
    page_path:'/cal-booking',utm_source:'cal.com',utm_medium:'booking',utm_campaign:'30min',consent:true,booked_for:'2026-11-10T09:00:00.000Z'});
  expect(payload.message).toContain('offline-first mobile app');
  expect(payload.request_id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  // The same delivery retried must hit the same ERP receipt; a different booking must not.
  await handle(webhook(body));
  expect(JSON.parse(calls[1].body).payload.request_id).toBe(payload.request_id);
  expect(bookingRequestId('booking-uid-2')).not.toBe(bookingRequestId('booking-uid-1'));
});
test('acknowledges events it does not act on, including the Cal.com ping, without touching ERP',async()=>{
  const {calls,fetch}=erp();const handle=makeHandler(env,fetch);
  for(const name of ['PING','BOOKING_CANCELLED','BOOKING_RESCHEDULED','MEETING_ENDED']){
    const response=await handle(webhook(JSON.stringify(event({},name))));
    expect(response.status).toBe(200);expect(await response.json()).toEqual({ignored:true});
  }
  expect(calls).toHaveLength(0);
});
test('rejects signed events without a usable attendee, uid or start time',async()=>{
  const {calls,fetch}=erp();const handle=makeHandler(env,fetch);
  for(const broken of [{attendees:[]},{uid:''},{startTime:'soon'},{attendees:[{name:'No email'}]}]){
    expect((await handle(webhook(JSON.stringify(event(broken))))).status).toBe(400);
  }
  const garbage='{not json';expect((await handle(webhook(garbage))).status).toBe(400);
  expect(calls).toHaveLength(0);
});
test('bounds oversized deliveries and trims long fields to what ERP accepts',async()=>{
  const {calls,fetch}=erp();const handle=makeHandler(env,fetch);
  expect((await handle(webhook(JSON.stringify(event({additionalNotes:'x'.repeat(70000)}))))).status).toBe(413);
  const long=event({additionalNotes:'n'.repeat(5000),title:'t'.repeat(500),attendees:[{name:'N'.repeat(400),email:'a@example.com'}]});
  expect((await handle(webhook(JSON.stringify(long)))).status).toBe(200);
  const {payload}=JSON.parse(calls[0].body);
  expect(payload.full_name.length).toBe(120);expect(payload.message.length).toBeLessThanOrEqual(4000);expect(payload.language).toBe('en');
});
test('does not claim success or leak details when ERP is down, rejects or is unconfigured',async()=>{
  const body=JSON.stringify(event());
  for(const reply of [()=>new Response('private traceback',{status:500}),()=>Response.json({message:{accepted:false}}),()=>{throw Error('network down');}]){
    const response=await makeHandler(env,erp(reply).fetch)(webhook(body));
    expect(response.status).toBe(503);expect(await response.text()).not.toContain('traceback');
  }
  expect((await makeHandler({CAL_WEBHOOK_SECRET:secret},erp().fetch)(webhook(body))).status).toBe(503);
  expect((await makeHandler({...env,ERP_URL:'http://insecure.example'},erp().fetch)(webhook(body))).status).toBe(503);
});
test('signature check is exact and tolerant of header case',()=>{
  const body=Buffer.from('{"a":1}');
  expect(validSignature(secret,body,sign(body))).toBe(true);
  expect(validSignature(secret,body,sign(body).toUpperCase())).toBe(true);
  expect(validSignature(secret,body,sign(Buffer.from('{"a":2}')))).toBe(false);
  expect(validSignature('',body,sign(body,''))).toBe(false);
  expect(bookingPayload({payload:null})).toBeNull();
});
