import { test, expect } from 'bun:test';
import { posthogConfig } from '../src/scripts/posthog-config.ts';

test('analytics never records sessions, forms or clicks beyond the chosen events', () => {
  const config = posthogConfig(false);
  expect(config.autocapture).toBe(false);
  expect(config.disable_session_recording).toBe(true);
  expect(config.capture_pageview).toBe(false);
  expect(config.capture_pageleave).toBe(false);
});
test('features a PostHog project can turn on remotely stay off on the site', () => {
  const config = posthogConfig(false);
  expect(config.disable_surveys).toBe(true);
  expect(config.capture_dead_clicks).toBe(false);
  expect(config.capture_heatmaps).toBe(false);
  expect(config.disable_conversations).toBe(true);
});
test('events go through the site proxy to the EU region', () => {
  const config = posthogConfig(true);
  expect(config.api_host).toBe('/ingest');
  expect(config.ui_host).toBe('https://eu.posthog.com');
  expect(config.debug).toBe(true);
});
