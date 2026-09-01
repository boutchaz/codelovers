import { gsap, ScrollTrigger } from "@/scripts/gsap";

export function initDesign(): void {
  const section = document.querySelector<HTMLElement>("[data-design-section]");
  const content = document.querySelector<HTMLElement>("[data-design-content]");
  const letters = Array.from(document.querySelectorAll<HTMLElement>("[data-design-letter]"));

  if (!section || !content || letters.length === 0) return;

  ScrollTrigger.getById("design-scroll")?.kill(true);

  gsap.set(letters, { opacity: 0, scale: 0.85, y: 24 });
  gsap.set(content, { opacity: 0, y: 32 });

  const width = window.innerWidth;
  const scrub = width < 768 ? 1.4 : 1;
  const stagger = width < 768 ? 0.06 : 0.08;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub,
      id: "design-scroll",
      invalidateOnRefresh: true,
    },
  });

  tl.to(letters, {
    opacity: 1,
    scale: 1,
    y: 0,
    duration: 0.5,
    stagger,
    ease: "none",
  }).to(content, { opacity: 1, y: 0, duration: 0.35, ease: "none" }, "-=0.12");
}

initDesign();
