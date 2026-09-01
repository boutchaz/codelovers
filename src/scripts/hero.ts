import { gsap, ScrollTrigger } from "@/scripts/gsap";

const HERO_FRAMES = 192;

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
    context.scale(dpr, dpr);
  };

  setCanvasSize();

  gsap.fromTo(
    content,
    { opacity: 0, scale: 0.95, y: 30 },
    { opacity: 1, scale: 1, y: 0, duration: 1.2, delay: 0.3, ease: "power3.out" },
  );

  const getDeviceType = () => {
    const width = window.innerWidth;
    if (width < 768) return "mobile";
    if (width < 1024) return "tablet";
    return "desktop";
  };

  const deviceType = getDeviceType();
  const isMobile = deviceType === "mobile";
  const frameFolder = isMobile ? "/frames-mobile" : "/frames";

  const currentFrame = (index: number) =>
    `${frameFolder}/frame-${(index + 1).toString().padStart(3, "0")}.jpg`;

  const images: HTMLImageElement[] = [];
  const currentFrameIndex = { frame: 0 };
  let loadedImages = 0;

  for (let i = 0; i < HERO_FRAMES; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    images.push(img);

    img.onload = () => {
      loadedImages++;

      if (loadedImages === HERO_FRAMES) {
        const rect = canvas.getBoundingClientRect();
        context.drawImage(images[HERO_FRAMES - 1], 0, 0, rect.width, rect.height);

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
          onUpdate: () => {
            const reverseFrame = HERO_FRAMES - 1 - Math.round(currentFrameIndex.frame);
            const rect = canvas.getBoundingClientRect();
            context.clearRect(0, 0, rect.width, rect.height);
            context.drawImage(images[reverseFrame], 0, 0, rect.width, rect.height);
          },
        });
      }
    };

    img.onerror = () => {
      console.error(`Failed to load frame: ${currentFrame(i)}`);
    };
  }

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

  // Resize handling
  let resizeTimeout: ReturnType<typeof setTimeout>;
  const handleResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      context.scale(dpr, dpr);
      ScrollTrigger.refresh();
    }, 150);
  };
  window.addEventListener("resize", handleResize);

  // Mouse tilt effect
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
