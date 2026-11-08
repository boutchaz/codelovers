import { afterLoadIdle } from "@/scripts/idle";
import { posthogConfig } from "@/scripts/posthog-config";
import { classifyClick, pageContext } from "@/scripts/track";

const key = import.meta.env.PUBLIC_POSTHOG_KEY;

// Only load PostHog when a key is configured (see .env.example). The dynamic
// import keeps posthog-js out of the bundle entirely when there is no key, and
// otherwise defers it until after load so it never delays first paint.
if (key) {
  afterLoadIdle(() => {
    void import("posthog-js").then(({ default: posthog }) => {
      posthog.init(key, posthogConfig(import.meta.env.DEV));
      // The product and article slug of the page being read: case studies name it in the path, blog posts in data attributes.
      const context = () => {
        const page = document.querySelector<HTMLElement>('[data-article]');
        return pageContext(location.pathname, {article:page?.dataset.article, product:page?.dataset.product});
      };
      posthog.capture('$pageview', {$current_url: location.origin + location.pathname, ...context()});
      document.addEventListener('codelovers:inquiry-recorded', event => {
        const detail = (event as CustomEvent<{language:string;product:string}>).detail;
        posthog.capture('website_inquiry_recorded', {language:detail.language, product:detail.product, $current_url:location.origin + location.pathname});
      });
      document.addEventListener('codelovers:newsletter-requested', event => {
        const detail = (event as CustomEvent<{language:string}>).detail;
        posthog.capture('newsletter_signup_requested', {language:detail.language, $current_url:location.origin + location.pathname});
      });
      // Autocapture stays off so form contents are never recorded. Only the clicks that mean "this visitor
      // is trying to reach us" are sent, and only as a kind, a host and the product and article they were on.
      document.addEventListener('click', event => {
        const link = (event.target as Element | null)?.closest?.('a[href]');
        const click = link && classifyClick(link.getAttribute('href') ?? '', location.origin);
        if (click) posthog.capture('cta_click', {kind:click.kind, host:click.host, ...context(), $current_url:location.origin + location.pathname});
      }, {capture:true});
    });
  });
}
