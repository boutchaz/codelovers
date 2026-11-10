export type Campaign = {utm_source:string;utm_medium:string;utm_campaign:string;utm_content:string};
const empty = ():Campaign => ({utm_source:'',utm_medium:'',utm_campaign:'',utm_content:''});
const key='codelovers_campaign_v1';
// Last tagged landing in this tab, for at most 24 hours. Never store arbitrary query parameters.
export function campaignAttribution(search:string, storage:Pick<Storage,'getItem'|'setItem'>|undefined, now=Date.now()):Campaign {
  const query=new URLSearchParams(search), tags=empty();
  for(const name of Object.keys(tags) as (keyof Campaign)[]){
    const value=query.get(name)||'';
    if(/^[a-zA-Z0-9._~-]{1,100}$/.test(value))tags[name]=value;
  }
  if(tags.utm_source && tags.utm_campaign){
    try{storage?.setItem(key,JSON.stringify({tags,at:now}));}catch{/* Storage may be blocked. */}
    return tags;
  }
  try{
    const saved=JSON.parse(storage?.getItem(key)||'null');
    if(saved && typeof saved.at==='number' && now>=saved.at && now-saved.at<86400000){
      const values=saved.tags;
      if(values && Object.keys(tags).every(name=>typeof values[name]==='string' && /^[a-zA-Z0-9._~-]{0,100}$/.test(values[name])))return {...tags,...values};
    }
  }catch{/* A damaged or unavailable store must not break forms. */}
  return tags;
}
export function currentCampaign():Campaign {
  let storage:Storage|undefined;
  try{storage=sessionStorage;}catch{/* Private browsing can block storage access. */}
  return campaignAttribution(location.search,storage);
}
export function internalTraffic(search:string,storage:Pick<Storage,'getItem'|'setItem'>|undefined,automated=false):boolean {
  const mode=new URLSearchParams(search).get('analytics_mode');
  try{
    if(mode==='internal' || mode==='public')storage?.setItem('codelovers_internal_traffic',String(mode==='internal'));
    return automated || mode==='internal' || (mode!=='public' && storage?.getItem('codelovers_internal_traffic')==='true');
  }catch{return automated || mode==='internal';}
}
export function isInternalTraffic():boolean {
  let storage:Storage|undefined;try{storage=localStorage;}catch{/* Still honor the current URL flag. */}
  return internalTraffic(location.search,storage,navigator.webdriver);
}
