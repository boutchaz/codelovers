import {publicFeedback} from '@/data/public-feedback.mjs';
export const prerender=false;
export const POST=({request}: {request:Request})=>publicFeedback(request);
export const ALL=()=>new Response('Method not allowed',{status:405});
