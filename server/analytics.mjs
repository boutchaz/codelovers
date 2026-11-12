import {PostHog} from 'posthog-node';
import {createHash} from 'node:crypto';
const clients=new Map();
export const analyticsId=value=>createHash('sha256').update('codelovers-analytics-v1\0'+value).digest('hex');
// An explicit allowlist prevents request URLs, codes, email and feedback text entering analytics.
export function captureServer(event,identity,properties={},env=process.env){
  if(!env.POSTHOG_KEY||!env.POSTHOG_HOST)return;
  if(!['article_review_opened','article_response_saved','working_session_booked','article_booking_clicked'].includes(event))return;
  try{
    const key=env.POSTHOG_KEY;let client=clients.get(key);
    if(!client){client=new PostHog(key,{host:env.POSTHOG_HOST,disableGeoip:true,flushAt:1,flushInterval:1000,requestTimeout:1500});client.on('error',()=>{});clients.set(key,client);}
    const allowed=['article','product','audience','visual_revision','choice','role'];
    const safe=Object.fromEntries(allowed.filter(k=>typeof properties[k]==='string'||typeof properties[k]==='number').map(k=>[k,properties[k]]));
    const hex=analyticsId(event+'\0'+identity);
    const uuid=`${hex.slice(0,8)}-${hex.slice(8,12)}-4${hex.slice(13,16)}-a${hex.slice(17,20)}-${hex.slice(20,32)}`;
    client.capture({...(event==='working_session_booked'?{uuid}:{}),distinctId:analyticsId(identity),event,properties:{...safe,$process_person_profile:false,$geoip_disable:true}});
  }catch{/* Measurement must never prevent reading, feedback or booking. */}
}
