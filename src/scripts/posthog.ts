import { afterLoadIdle } from "@/scripts/idle";

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
        debug: import.meta.env.DEV,
      });
    });
  });
}
