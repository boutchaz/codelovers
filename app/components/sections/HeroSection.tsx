"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { heroCards } from "@/app/data/constants";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const frameCount = 192;

  useGSAP(
    () => {
      const section = sectionRef.current;
      const content = contentRef.current;
      const canvas = canvasRef.current;

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
        { opacity: 1, scale: 1, y: 0, duration: 1.2, delay: 0.3, ease: "power3.out" }
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

      for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        images.push(img);

        img.onload = () => {
          loadedImages++;

          if (loadedImages === frameCount) {
            const rect = canvas.getBoundingClientRect();
            context.drawImage(images[frameCount - 1], 0, 0, rect.width, rect.height);

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
              frame: frameCount - 1,
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
              onUpdate: function () {
                const reverseFrame = frameCount - 1 - Math.round(currentFrameIndex.frame);
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

      cardsRef.current.forEach((card, index) => {
        if (card) {
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

          const randomRotation = cardIsMobile
            ? gsap.utils.random(-2, 2)
            : gsap.utils.random(-5, 5);

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
        }
      });
    },
    { scope: sectionRef }
  );

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const canvas = canvasRef.current;

    if (!section || !content || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        ctx.scale(dpr, dpr);
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

    return () => {
      window.removeEventListener("resize", handleResize);
      section.removeEventListener("mousemove", handleMouseMove);
      section.removeEventListener("mouseleave", handleMouseLeave);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="hero-section relative flex min-h-screen items-center justify-center overflow-x-hidden overflow-y-visible"
      style={{ perspective: "1500px" }}
    >
      {/* Canvas for frame sequence animation */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 h-full w-full object-cover"
        aria-hidden="true"
      />

      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-slate-950/70 via-slate-950/50 to-slate-950/90" />

      {/* Animated background effects */}
      <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
        <div className="absolute -left-1/4 top-0 h-[500px] w-[500px] animate-pulse rounded-full bg-rose-500/10 blur-3xl" />
        <div className="absolute -right-1/4 bottom-0 h-[500px] w-[500px] animate-pulse rounded-full bg-orange-500/10 blur-3xl" style={{ animationDelay: "1s" }} />
      </div>

      {/* Hero Content */}
      <div
        className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1400px] flex-col items-center justify-center"
        style={{
          paddingLeft: "clamp(1rem, 5vw, 3rem)",
          paddingRight: "clamp(1rem, 5vw, 3rem)",
          paddingTop: "clamp(2rem, 6vh, 4rem)",
          paddingBottom: "clamp(1.5rem, 4vh, 3rem)",
        }}
      >
        <div
          ref={contentRef}
          className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center text-center"
          style={{
            transformStyle: "preserve-3d",
            gap: "clamp(1rem, 2.5vw, 1.75rem)",
          }}
        >
          <p
            className="font-semibold tracking-tight text-white"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
            aria-hidden="true"
          >
            Code<span className="bg-gradient-to-r from-rose-400 via-red-400 to-orange-300 bg-clip-text text-transparent">Lovers</span>
          </p>

          <div className="inline-flex items-center gap-2 rounded-full border border-rose-400/30 bg-gradient-to-r from-white/10 to-white/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-200 backdrop-blur-md sm:gap-3 sm:px-5 sm:py-2 sm:text-xs sm:tracking-[0.3em]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-300" />
            </span>
            Global Product Engineering Studio
            <span className="h-1 w-1 rounded-full bg-rose-300/50" />
            Since 2018
          </div>

          <div
            className="flex w-full flex-col items-center justify-center"
            style={{ gap: "clamp(0.75rem, 2vw, 1.25rem)" }}
          >
            <h1
              className="text-balance font-bold leading-[1.15] tracking-tight text-white"
              style={{
                fontSize: "clamp(1.5rem, 4.5vw, 3.25rem)",
                maxWidth: "42rem",
              }}
            >
              Building{" "}
              <span className="bg-gradient-to-r from-rose-400 via-red-400 to-orange-300 bg-clip-text text-transparent">
                full-stack, SaaS, IoT &amp; commerce
              </span>{" "}
              products that move businesses forward
            </h1>
            <p
              className="mx-auto leading-relaxed text-slate-300/90"
              style={{
                fontSize: "clamp(0.9375rem, 1.8vw, 1.125rem)",
                maxWidth: "min(90%, 36rem)",
                lineHeight: "1.65",
              }}
            >
              We partner with founders and enterprises to launch platforms, engineer SaaS ecosystems, connect IoT fleets, and operate DevOps pipelines that outperform the market.
            </p>
          </div>

          <div
            className="flex w-full flex-col items-center justify-center sm:flex-row"
            style={{ gap: "clamp(0.75rem, 2vw, 1rem)" }}
          >
            <Button asChild size="lg" className="group relative w-full overflow-hidden sm:w-auto">
              <Link
                href="/#contact"
                style={{
                  padding: "clamp(0.625rem, 2vw, 0.875rem) clamp(1.5rem, 4vw, 2.5rem)",
                  fontSize: "clamp(0.875rem, 1.5vw, 1rem)",
                }}
              >
                <span className="relative z-10">Start a project</span>
                <span className="relative z-10 ml-2 transition-transform group-hover:translate-x-1">→</span>
                <span className="absolute inset-0 -z-0 bg-gradient-to-r from-rose-500 via-red-400 to-orange-300 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="group w-full border-white/20 hover:border-white/40 sm:w-auto">
              <Link
                href="/blog"
                style={{
                  padding: "clamp(0.625rem, 2vw, 0.875rem) clamp(1.5rem, 4vw, 2.5rem)",
                  fontSize: "clamp(0.875rem, 1.5vw, 1rem)",
                }}
              >
                <span>Read our blog</span>
                <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Floating project hints — desktop only, low visual weight */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          {heroCards.map((card, index) => (
            <div
              key={card.title}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className={card.className}
              style={{ willChange: "transform" }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-200 backdrop-blur-sm sm:px-3">
                {card.badge}
              </span>
              <p className="mt-4 text-lg font-semibold text-white">{card.title}</p>
              <p className="mt-2 text-sm text-slate-300">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
