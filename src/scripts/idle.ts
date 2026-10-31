/**
 * Run `callback` once the page has fully loaded and the main thread is idle,
 * so non-critical work (analytics, big media downloads) never competes with
 * first paint.
 */
export function afterLoadIdle(callback: () => void): void {
  const schedule = () => {
    if (typeof window.requestIdleCallback === "function") {
      window.requestIdleCallback(() => callback(), { timeout: 2000 });
    } else {
      // Safari has no requestIdleCallback.
      window.setTimeout(callback, 200);
    }
  };

  if (document.readyState === "complete") {
    schedule();
  } else {
    window.addEventListener("load", schedule, { once: true });
  }
}
