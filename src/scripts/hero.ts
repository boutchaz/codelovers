import { gsap } from "@/scripts/gsap";

/**
 * Load the hero video fully into memory: scrubbing seeks constantly, and seeking a
 * streamed file stalls on network ranges (Safari won't seek reliably at all).
 */
async function loadVideoBlob(video: HTMLVideoElement): Promise<void> {
  const source = Array.from(video.querySelectorAll("source")).find(
    (s) => video.canPlayType(s.type) !== "",
  );
  if (!source) return;

  try {
    const response = await fetch(source.src);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    video.src = URL.createObjectURL(await response.blob());
  } catch {
    // Fall back to streaming the <source> elements.
    video.preload = "auto";
    video.load();
  }
}

/** Pin the hero and map scroll progress onto the video timeline. */
function scrubHeroVideo(section: HTMLElement): void {
  const video = section.querySelector<HTMLVideoElement>("[data-hero-video]");
  if (!video) return;

  const scroll = { progress: 0 };
  let ready = false;
  let seeking = false;
  let pendingTime: number | null = null;

  // One seek at a time; fast scrolls jump to the latest target instead of queueing.
  const seek = (time: number) => {
    if (!ready) return;
    if (seeking) {
      pendingTime = time;
      return;
    }
    seeking = true;
    video.currentTime = time;
  };

  video.addEventListener("seeked", () => {
    seeking = false;
    if (pendingTime !== null) {
      const next = pendingTime;
      pendingTime = null;
      seek(next);
    }
  });

  const getScrollDistance = () => {
    const width = window.innerWidth;
    if (width < 768) return "+=150%";
    if (width < 1024) return "+=175%";
    return "+=200%";
  };

  const getScrubValue = () => {
    const width = window.innerWidth;
    if (width < 768) return 1.5;
    if (width < 1024) return 1.2;
    return 0.8;
  };

  // Stop just short of the end so the last frame is still painted.
  const timeFor = (progress: number) => progress * Math.max(video.duration - 0.05, 0);

  // Pin right away so the layout doesn't jump once the video arrives.
  gsap.to(scroll, {
    progress: 1,
    ease: "none",
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: getScrollDistance(),
      scrub: getScrubValue(),
      pin: true,
      pinSpacing: true,
      pinType: "fixed",
      id: "hero-scroll",
      invalidateOnRefresh: true,
      anticipatePin: 1,
      fastScrollEnd: true,
    },
    onUpdate: () => seek(timeFor(scroll.progress)),
  });

  video.addEventListener(
    "loadedmetadata",
    () => {
      // iOS only paints seeked frames once the element has played at least once.
      void video
        .play()
        .then(() => video.pause())
        .catch(() => {})
        .finally(() => {
          ready = true;
          seek(timeFor(scroll.progress));
        });
    },
    { once: true },
  );

  void loadVideoBlob(video);
}

export function initHero(): void {
  const section = document.querySelector<HTMLElement>("[data-hero-section]");
  const content = document.querySelector<HTMLElement>("[data-hero-content]");

  if (!section || !content) return;

  scrubHeroVideo(section);

  gsap.fromTo(
    content,
    { opacity: 0, scale: 0.95, y: 30 },
    { opacity: 1, scale: 1, y: 0, duration: 1.2, delay: 0.3, ease: "power3.out" },
  );

  document.querySelectorAll<HTMLElement>("[data-hero-card]").forEach((card, index) => {
    const cardIsMobile = window.innerWidth < 640;
    const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;

    const randomX = cardIsMobile
      ? gsap.utils.random(-10, 10)
      : isTablet
        ? gsap.utils.random(-20, 20)
        : gsap.utils.random(-30, 30);

    const randomY = cardIsMobile
      ? gsap.utils.random(-8, 8)
      : isTablet
        ? gsap.utils.random(-15, 15)
        : gsap.utils.random(-20, 20);

    const randomRotation = cardIsMobile ? gsap.utils.random(-2, 2) : gsap.utils.random(-5, 5);

    const randomDuration = gsap.utils.random(3, 5);

    gsap.to(card, {
      x: randomX,
      y: randomY,
      rotation: randomRotation,
      duration: randomDuration,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: index * 0.5,
    });
  });

  const handleMouseMove = (e: MouseEvent) => {
    if (window.innerWidth < 1024) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const xPercent = (clientX / innerWidth - 0.5) * 2;
    const yPercent = (clientY / innerHeight - 0.5) * 2;
    gsap.to(content, {
      rotationY: xPercent * 2,
      rotationX: -yPercent * 2,
      transformPerspective: 1000,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    if (window.innerWidth < 1024) return;
    gsap.to(content, {
      rotationY: 0,
      rotationX: 0,
      duration: 0.8,
      ease: "elastic.out(1, 0.3)",
    });
  };

  section.addEventListener("mousemove", handleMouseMove);
  section.addEventListener("mouseleave", handleMouseLeave);
}

initHero();
