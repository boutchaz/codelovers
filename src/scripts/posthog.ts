import posthog from "posthog-js";

const key = import.meta.env.PUBLIC_POSTHOG_KEY;

// Only initialize when a key is configured (see .env.example).
if (key) {
  posthog.init(key, {
    api_host: "/ingest",
    ui_host: "https://eu.posthog.com",
    defaults: "2025-05-24",
    capture_exceptions: true,
    debug: import.meta.env.DEV,
  });
}
