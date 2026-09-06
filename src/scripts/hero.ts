import { gsap, ScrollTrigger } from "@/scripts/gsap";

const HERO_FRAMES = 192;
/** Max concurrent frame downloads — keeps bandwidth free for critical resources. */
const LOAD_CONCURRENCY = 6;
/** Start ScrollTrigger once this many frames are available (covers early scrub). */
const MIN_FRAMES_BEFORE_SCRUB = 24;

export function initHero(): void {
  const section = document.querySelector<HTMLElement>("[data-hero-section]");
  const content = document.querySelector<HTMLElement>("[data-hero-content]");
  const canvas = document.querySelector<HTMLCanvasElement>("[data-hero-canvas]");

  if (!section || !content || !canvas) return;

  const context = canvas.getContext("2d");
  if (!context) return;

  const setCanvasSize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  setCanvasSize();

  gsap.fromTo(
    content,
    { opacity: 0, scale: 0.95, y: 30 },
    { opacity: 1, scale: 1, y: 0, duration: 1.2, delay: 0.3, ease: "power3.out" },
  );

  const isMobile = window.innerWidth < 768;
  const frameFolder = isMobile ? "/frames-mobile" : "/frames";

  const frameUrl = (index: number) =>
    `${frameFolder}/frame-${(index + 1).toString().padStart(3, "0")}.jpg`;

  const images: (HTMLImageElement | null)[] = Array.from({ length: HERO_FRAMES }, () => null);
  const loaded = new Set<number>();
  const currentFrameIndex = { frame: 0 };
  let scrubStarted = false;

  const drawFrame = (index: number) => {
    const img = images[index];
    if (!img?.complete || !img.naturalWidth) return;
    const rect = canvas.getBoundingClientRect();
    context.clearRect(0, 0, rect.width, rect.height);
    context.drawImage(img, 0, 0, rect.width, rect.height);
  };

  /** Prefer exact frame; otherwise nearest loaded neighbor (keeps scrub smooth while loading). */
  const nearestLoaded = (target: number): number | null => {
    if (loaded.has(target)) return target;
    for (let d = 1; d < HERO_FRAMES; d++) {
      if (loaded.has(target - d)) return target - d;
      if (loaded.has(target + d)) return target + d;
    }
    return null;
  };

  const paintScrubFrame = () => {
    const reverseFrame = HERO_FRAMES - 1 - Math.round(currentFrameIndex.frame);
    const idx = nearestLoaded(reverseFrame);
    if (idx !== null) drawFrame(idx);
  };

  const startScrub = () => {
    if (scrubStarted) return;
    scrubStarted = true;

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

    gsap.to(currentFrameIndex, {
      frame: HERO_FRAMES - 1,
      snap: "frame",
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
      onUpdate: paintScrubFrame,
    });
  };

  const loadFrame = (index: number): Promise<void> => {
    if (images[index]) return Promise.resolve();

    return new Promise((resolve) => {
      const img = new Image();
      images[index] = img;

      const finish = () => {
        loaded.add(index);
        resolve();
      };

      img.onload = finish;
      img.onerror = () => {
        console.error(`Failed to load frame: ${frameUrl(index)}`);
        finish();
      };
      img.src = frameUrl(index);
    });
  };

  /** Load indices with limited concurrency. Prefer high indices first (initial canvas = last frame). */
  const loadQueue = async (indices: number[]) => {
    let cursor = 0;

    const worker = async () => {
      while (cursor < indices.length) {
        const i = indices[cursor++];
        await loadFrame(i);
        if (!scrubStarted && loaded.size >= MIN_FRAMES_BEFORE_SCRUB) {
          startScrub();
        }
      }
    };

    const workers = Array.from({ length: Math.min(LOAD_CONCURRENCY, indices.length) }, () =>
      worker(),
    );
    await Promise.all(workers);
  };

  // Initial paint uses the last frame (scroll progress 0 → reverse index HERO_FRAMES - 1)
  const initialIndex = HERO_FRAMES - 1;

  void (async () => {
    await loadFrame(initialIndex);
    drawFrame(initialIndex);

    // Remaining frames: last→first so early scrub stays smooth as user starts scrolling
    const rest = Array.from({ length: HERO_FRAMES - 1 }, (_, i) => HERO_FRAMES - 2 - i);

    const scheduleRest = () => {
      void loadQueue(rest).then(() => {
        if (!scrubStarted) startScrub();
      });
    };

    if ("requestIdleCallback" in window) {
      requestIdleCallback(scheduleRest, { timeout: 1200 });
    } else {
      setTimeout(scheduleRest, 200);
    }
  })();

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

  let resizeTimeout: ReturnType<typeof setTimeout>;
  const handleResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      setCanvasSize();
      paintScrubFrame();
      ScrollTrigger.refresh();
    }, 150);
  };
  window.addEventListener("resize", handleResize);

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
