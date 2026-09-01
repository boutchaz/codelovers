// IntersectionObserver-driven scroll reveals.
// - .reveal-on-scroll elements get `is-visible` when 20% in view.
// - [data-reveal] (RevealText) gets `is-visible` when 30% in view (unobserved after).

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function observeAll() {
  if (prefersReducedMotion) {
    // CSS already forces final state; just mark everything visible.
    document
      .querySelectorAll<HTMLElement>(".reveal-on-scroll, [data-reveal]")
      .forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const bulkObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.2 },
  );

  document.querySelectorAll<HTMLElement>(".reveal-on-scroll").forEach((element) => {
    bulkObserver.observe(element);
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3, rootMargin: "0px 0px -10% 0px" },
  );

  document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => {
    revealObserver.observe(element);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", observeAll);
} else {
  observeAll();
}
