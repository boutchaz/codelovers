// Hash-less anchor scrolling.
// Keeps `href="#section"` markup (works without JS, deep-linkable), but:
// 1. Same-page anchor clicks scroll smoothly and replace the URL WITHOUT the
//    `#hash`, so the address bar stays clean (`/#contact` → `/`).
// 2. Arriving with a hash (cross-page nav, back/forward) scrolls to the target
//    and cleans the hash from the URL.

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function cleanUrl() {
  history.replaceState(null, "", window.location.pathname + window.location.search);
}

function scrollToTarget(target: HTMLElement) {
  target.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
    block: "start", // offset handled by scroll-margin-top in global.css
  });
  // Keep keyboard focus with the section for a11y parity with native anchors.
  if (!target.matches(":focus-visible")) {
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  }
}

// 1. Delegated click handling for same-page anchors.
document.addEventListener("click", (event) => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return;
  }

  const link = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href*="#"]');
  if (!link) return;

  const url = new URL(link.href, window.location.href);
  if (url.origin !== window.location.origin || !url.hash) return;

  const samePage =
    url.pathname === window.location.pathname && url.search === window.location.search;
  if (!samePage) return; // Cross-page: navigate natively, cleaned below on arrival.

  const target = document.getElementById(url.hash.slice(1));
  if (!target) return; // Unknown target: let the browser handle it.

  event.preventDefault();
  scrollToTarget(target);
  cleanUrl();
});

// 2. Clean the hash when a page loads with one (native jump already happened).
if (window.location.hash) {
  const target = document.getElementById(window.location.hash.slice(1));
  if (target) {
    // Correct the native jump for the fixed header height.
    window.scrollTo({ top: 0 });
    scrollToTarget(target);
  }
  cleanUrl();
}

// 3. Fragment-only navigations (address bar, back/forward) are same-document:
// no reload, so the load-time branch above never runs. Handle hashchange too.
window.addEventListener("hashchange", () => {
  const hash = window.location.hash;
  if (!hash) return; // Back/forward to a hashless entry: keep browser behavior.
  const target = document.getElementById(hash.slice(1));
  if (!target) return;
  scrollToTarget(target);
  cleanUrl();
});
