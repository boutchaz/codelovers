import { afterLoadIdle } from "@/scripts/idle";
import { classifyClick, productFromPath } from "@/scripts/track";

const key = import.meta.env.PUBLIC_POSTHOG_KEY;

// Only load PostHog when a key is configured (see .env.example). The dynamic
// import keeps posthog-js out of the bundle entirely when there is no key, and
// otherwise defers it until after load so it never delays first paint.
if (key) {
  afterLoadIdle(() => {
    void import("posthog-js").then(({ default: posthog }) => {
      posthog.init(key, {
        api_host: "/ingest",
        ui_host: "https://eu.posthog.com",
        defaults: "2025-05-24",
        capture_exceptions: true,
        autocapture: false,
        disable_session_recording: true,
        capture_pageview: false,
        capture_pageleave: false,
        debug: import.meta.env.DEV,
      });
      posthog.capture('$pageview', {$current_url: location.origin + location.pathname});
      document.addEventListener('codelovers:inquiry-recorded', event => {
        const detail = (event as CustomEvent<{language:string;product:string}>).detail;
        posthog.capture('website_inquiry_recorded', {language:detail.language, product:detail.product, $current_url:location.origin + location.pathname});
      });
      document.addEventListener('codelovers:newsletter-requested', event => {
        const detail = (event as CustomEvent<{language:string}>).detail;
        posthog.capture('newsletter_signup_requested', {language:detail.language, $current_url:location.origin + location.pathname});
      });
      // Autocapture stays off so form contents are never recorded. Only the clicks that mean "this visitor
      // is trying to reach us" are sent, and only as a kind, a host and the product page they were on.
      document.addEventListener('click', event => {
        const link = (event.target as Element | null)?.closest?.('a[href]');
        const click = link && classifyClick(link.getAttribute('href') ?? '', location.origin);
        if (click) posthog.capture('cta_click', {kind:click.kind, host:click.host, product:productFromPath(location.pathname), $current_url:location.origin + location.pathname});
      }, {capture:true});
    });
  });
}
