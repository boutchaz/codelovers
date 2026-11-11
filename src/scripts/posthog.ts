import { afterLoadIdle } from '@/scripts/idle';
import { posthogConfig } from '@/scripts/posthog-config';
import { classifyClick, pageContext, shareKind } from '@/scripts/track';
import { currentCampaign, isInternalTraffic } from '@/scripts/attribution';

// Capture attribution on every landing, even without an analytics key.
const preview = document.body.hasAttribute("data-preview");
if (!preview) currentCampaign();
const key=import.meta.env.PUBLIC_POSTHOG_KEY;
if(key && !preview){
  const pending:Array<[string,Record<string,unknown>]> = [];
  let send=(name:string,properties:Record<string,unknown>)=>{if(pending.length<100)pending.push([name,properties]);};
  const context=()=>{
    const page=document.querySelector<HTMLElement>('[data-article]');
    return {...pageContext(location.pathname,{article:page?.dataset.article,product:page?.dataset.product}),...currentCampaign(),internal_traffic:import.meta.env.DEV||isInternalTraffic(),$current_url:location.origin+location.pathname};
  };
  // Listen before idle SDK loading so a fast form submission is not lost.
  document.addEventListener('codelovers:inquiry-recorded',event=>{
    const detail=(event as CustomEvent<{language:string;product:string}>).detail;
    send('website_inquiry_recorded',{...context(),language:detail.language,product:detail.product});
  });
  document.addEventListener('codelovers:newsletter-requested',event=>{
    send('newsletter_signup_requested',{...context(),language:(event as CustomEvent<{language:string}>).detail.language});
  });
  document.addEventListener('click',event=>{
    const target=event.target as Element|null;
    const share=target?.closest?.('[data-share]');
    if(share){const kind=shareKind(share.getAttribute('data-share'));if(kind)send('share_click',{...context(),kind});return;}
    const link=target?.closest?.('a[href]');
    const click=link&&classifyClick(link.getAttribute('href')??'',location.origin);
    if(click)send('cta_click',{...context(),kind:click.kind,host:click.host});
  },{capture:true});
  send('$pageview',context());
  afterLoadIdle(()=>{
    void import('posthog-js').then(({default:posthog})=>{
      posthog.init(key,posthogConfig(import.meta.env.DEV));
      posthog.register({internal_traffic:import.meta.env.DEV||isInternalTraffic()});
      send=(name,properties)=>{posthog.capture(name,properties);};
      for(const [name,properties] of pending)send(name,properties);
      pending.length=0;
    }).catch(()=>{/* Analytics must never prevent a successful enquiry. */});
  });
}
