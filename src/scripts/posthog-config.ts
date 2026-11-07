// The privacy posture of the site's analytics, in one place so a test can pin it. A PostHog project can switch
// more features on from its own settings (surveys, dead clicks, heatmaps, the support widget), so each of those
// is also switched off here: the site only sends the page views and events chosen in posthog.ts.
export function posthogConfig(debug: boolean) {
  return {
    api_host: "/ingest",
    ui_host: "https://eu.posthog.com",
    defaults: "2025-05-24",
    capture_exceptions: true,
    autocapture: false,
    disable_session_recording: true,
    capture_pageview: false,
    capture_pageleave: false,
    disable_surveys: true,
    capture_dead_clicks: false,
    capture_heatmaps: false,
    disable_conversations: true,
    debug,
  } as const;
}
