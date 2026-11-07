import {createHash,createHmac,timingSafeEqual} from 'node:crypto';
// Cal.com booking webhooks -> ERP. A booking is a visitor asking for a call, so it becomes the same lead,
// inquiry receipt and follow-up task as a form submission. Nothing is sent to the booker.
export const BOOKING_LIMIT=65536;
const json=(value,status=200)=>Response.json(value,{status,headers:{'Cache-Control':'no-store'}});
const text=(value,limit)=>typeof value==='string'?value.replace(/\0/g,'').trim().slice(0,limit):'';

// Retried deliveries of one booking must hit the same ERP receipt, so derive a stable v4-shaped id from Cal's uid.
export function bookingRequestId(uid){
  const bytes=createHash('sha256').update('cal.com\0'+uid).digest().subarray(0,16);
  bytes[6]=(bytes[6]&0x0f)|0x40;bytes[8]=(bytes[8]&0x3f)|0x80;
  const hex=bytes.toString('hex');
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
}

export function validSignature(secret,body,header){
  if(!secret||!/^[0-9a-f]{64}$/i.test(header||''))return false;
  return timingSafeEqual(Buffer.from(header,'hex'),createHmac('sha256',secret).update(body).digest());
}

// Returns the ERP payload for a Cal.com BOOKING_CREATED event, or null when it lacks what a follow-up needs.
export function bookingPayload(event){
  const booking=event?.payload;
  if(!booking||typeof booking!=='object')return null;
  const attendee=Array.isArray(booking.attendees)?booking.attendees[0]:null;
  const email=text(attendee?.email??booking.responses?.email?.value,254).toLowerCase();
  const uid=text(booking.uid,200),start=text(booking.startTime,40);
  if(!uid||!email||Number.isNaN(Date.parse(start)))return null;
  const name=text(attendee?.name??booking.responses?.name?.value,120)||email.split('@')[0];
  const organization=text(booking.responses?.company?.value??booking.responses?.organization?.value,140);
  const notes=text(booking.additionalNotes??booking.responses?.notes?.value,2000);
  const title=text(booking.title,200)||'Call';
  const zone=text(attendee?.timeZone,60);
  return {
    request_id:bookingRequestId(uid),full_name:name,email,organization,product:'',
    language:text(attendee?.language?.locale,10).toLowerCase().startsWith('fr')?'fr':'en',
    message:`Booked a call: ${title}\nWhen: ${start}${zone?` (${zone})`:''}${notes?`\nNotes: ${notes}`:''}`.slice(0,4000),
    page_path:'/cal-booking',utm_source:'cal.com',utm_medium:'booking',utm_campaign:text(booking.type,100),
    consent:true,booked_for:new Date(start).toISOString(),
  };
}

async function readBody(request){
  const reader=request.body?.getReader();if(!reader)return null;
  const chunks=[];let size=0;
  while(true){
    const {value,done}=await reader.read();if(done)break;
    size+=value.length;if(size>BOOKING_LIMIT){await reader.cancel();return false;}
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}

export function makeBookingHandler(env=process.env,requestFetch=fetch){
  return async request=>{
    // Fail closed: without a shared secret there is no way to tell Cal.com from anyone else.
    if(!env.CAL_WEBHOOK_SECRET)return json({error:'Booking sync unavailable'},503);
    const body=await readBody(request);
    if(body===false)return json({error:'Too large'},413);
    if(!body||!validSignature(env.CAL_WEBHOOK_SECRET,body,request.headers.get('x-cal-signature-256')))return json({error:'Invalid signature'},401);
    let event;
    try{event=JSON.parse(body.toString('utf8'));}catch{return json({error:'Invalid booking'},400);}
    // Cal.com expects a 2xx for events it sends but we do not act on (including its PING test).
    if(event?.triggerEvent!=='BOOKING_CREATED')return json({ignored:true});
    const payload=bookingPayload(event);
    if(!payload)return json({error:'Booking has no usable attendee or time'},400);
    if(!env.ERP_INTAKE_API_KEY||!env.ERP_INTAKE_API_SECRET)return json({error:'Booking sync unavailable'},503);
    let base;
    try{base=new URL(env.ERP_URL||'https://erp.boutchaz.dev');}catch{return json({error:'Booking sync unavailable'},503);}
    if(base.protocol!=='https:'||base.username||base.password||base.pathname!=='/')return json({error:'Booking sync unavailable'},503);
    try{
      const response=await requestFetch(`${base.origin}/api/method/codelovers.inquiries.record_booking`,{
        method:'POST',redirect:'error',signal:AbortSignal.timeout(20000),
        headers:{Authorization:`token ${env.ERP_INTAKE_API_KEY}:${env.ERP_INTAKE_API_SECRET}`,'Content-Type':'application/json'},
        body:JSON.stringify({payload})});
      if(!response.ok)return json({error:'Booking was not recorded'},503);
      return (await response.json()).message?.accepted===true?json({accepted:true}):json({error:'Booking was not confirmed'},503);
    }catch{return json({error:'Booking was not recorded'},503);}
  };
}
