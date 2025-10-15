"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { heroMetrics, heroCards } from "@/app/data/constants";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const frameCount = 192; // Total frames extracted from video

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const canvas = canvasRef.current;

    if (!section || !content || !canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    // Set canvas dimensions with device pixel ratio for crisp rendering
    const setCanvasSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2x for performance
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      context.scale(dpr, dpr);
    };

    setCanvasSize();

    // Initial content animation - fade in and scale up
    gsap.fromTo(
      content,
      {
        opacity: 0,
        scale: 0.95,
        y: 30,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.2,
        delay: 0.3,
        ease: "power3.out",
      }
    );

    // Handle window resize with debounce
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setCanvasSize();
        if (images[currentFrameIndex.frame]) {
          const rect = canvas.getBoundingClientRect();
          context.clearRect(0, 0, rect.width, rect.height);
          context.drawImage(images[currentFrameIndex.frame], 0, 0, rect.width, rect.height);
        }
        ScrollTrigger.refresh();
      }, 150);
    };

    window.addEventListener("resize", handleResize);

    // Detect device type for optimized frame loading
    const getDeviceType = () => {
      const width = window.innerWidth;
      if (width < 768) return 'mobile';
      if (width < 1024) return 'tablet';
      return 'desktop';
    };

    const deviceType = getDeviceType();
    const isMobile = deviceType === 'mobile';
    const frameFolder = isMobile ? "/frames-mobile" : "/frames";

    // Generate image URLs from extracted frames
    const currentFrame = (index: number) =>
      `${frameFolder}/frame-${(index + 1).toString().padStart(3, "0")}.jpg`;

    const images: HTMLImageElement[] = [];
    const currentFrameIndex = {
      frame: 0,
    };

    let loadedImages = 0;

    // Preload all frames
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      images.push(img);

      img.onload = () => {
        loadedImages++;

        // When all images are loaded, set up the animation
        if (loadedImages === frameCount) {
          // Draw the last frame (since we're playing in reverse)
          const rect = canvas.getBoundingClientRect();
          context.drawImage(images[frameCount - 1], 0, 0, rect.width, rect.height);

          // Calculate responsive scroll distance
          const getScrollDistance = () => {
            const width = window.innerWidth;
            if (width < 768) return "+=150%"; // Mobile: shorter scroll
            if (width < 1024) return "+=175%"; // Tablet: medium scroll
            return "+=200%"; // Desktop: full scroll
          };

          // Create ScrollTrigger animation - plays frames in REVERSE
          gsap.to(currentFrameIndex, {
            frame: frameCount - 1,
            snap: "frame",
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: getScrollDistance(),
              scrub: 0.5,
              pin: true,
              pinSpacing: true,
              id: "hero-scroll",
              invalidateOnRefresh: true,
              anticipatePin: 1,
            },
            onUpdate: function () {
              // Render frames in REVERSE: counter goes 0→191, display goes 191→0
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

    // Animate floating cards with random movement (responsive)
    cardsRef.current.forEach((card, index) => {
      if (card) {
        const isMobile = window.innerWidth < 640;
        const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;

        const randomX = isMobile
          ? gsap.utils.random(-10, 10)
          : isTablet
          ? gsap.utils.random(-20, 20)
          : gsap.utils.random(-30, 30);

        const randomY = isMobile
          ? gsap.utils.random(-8, 8)
          : isTablet
          ? gsap.utils.random(-15, 15)
          : gsap.utils.random(-20, 20);

        const randomRotation = isMobile
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

    // Mouse move handler for 3D parallax effect on content (desktop only)
    const handleMouseMove = (e: MouseEvent) => {
      // Disable 3D effects on mobile/tablet for better performance
      if (window.innerWidth < 1024) return;

      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      // Calculate mouse position as percentage (-1 to 1)
      const xPercent = (clientX / innerWidth - 0.5) * 2;
      const yPercent = (clientY / innerHeight - 0.5) * 2;

      // Apply subtle 3D transforms to content overlay
      gsap.to(content, {
        rotationY: xPercent * 2,
        rotationX: -yPercent * 2,
        transformPerspective: 1000,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    // Reset on mouse leave
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
      section.removeEventListener("mousemove", handleMouseMove);
      section.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.id === "hero-scroll") {
          trigger.kill();
        }
      });
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
        className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1400px] flex-col items-center justify-center gap-10"
        style={{
          paddingLeft: "clamp(1rem, 5vw, 3rem)",
          paddingRight: "clamp(1rem, 5vw, 3rem)",
          paddingTop: "clamp(2rem, 6vh, 4rem)",
          paddingBottom: "clamp(1.5rem, 4vh, 3rem)",
        }}
      >
        {/* Centered Content */}
        <div
          ref={contentRef}
          className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center text-center"
          style={{ 
            transformStyle: "preserve-3d",
            gap: "clamp(1.25rem, 3vw, 2rem)"
          }}
        >
            {/* Badge with enhanced styling */}
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-400/30 bg-gradient-to-r from-white/10 to-white/5 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-200 shadow-lg shadow-rose-500/20 backdrop-blur-md transition-all hover:scale-105 hover:border-rose-400/50 hover:shadow-rose-500/30 sm:gap-3 sm:px-5 sm:py-2.5 sm:text-xs sm:tracking-[0.3em]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-300"></span>
            </span>
            Global Product Engineering Studio
            <span className="h-1 w-1 rounded-full bg-rose-300/50" />
            Since 2018
          </div>

          <div 
            className="flex w-full flex-col items-center justify-center"
            style={{ gap: "clamp(1rem, 3vw, 1.5rem)" }}
          >
            <h1 
              className="text-balance font-bold leading-[1.1] tracking-tight text-white"
              style={{ 
                fontSize: "clamp(1.875rem, 6vw, 5rem)",
                maxWidth: "95%"
              }}
            >
              Building{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-rose-400 via-red-400 to-orange-300 bg-clip-text text-transparent">
                  full-stack, SaaS, IoT, and commerce products
                </span>
                <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-gradient-to-r from-rose-400 via-red-400 to-orange-300 opacity-30 blur-sm sm:-bottom-2 sm:h-1" />
              </span>{" "}
              that move businesses forward
            </h1>
            <p 
              className="mx-auto leading-relaxed text-slate-300/90"
              style={{ 
                fontSize: "clamp(0.9375rem, 2vw, 1.25rem)",
                maxWidth: "min(90%, 42rem)",
                lineHeight: "1.7"
              }}
            >
              We partner with founders and enterprises to launch full-stack platforms, engineer SaaS ecosystems, connect IoT fleets, craft modern storefronts, and operate DevOps pipelines that outperform the market.
            </p>
          </div>

          <div 
            className="flex w-full flex-col items-center justify-center sm:flex-row"
            style={{ 
              gap: "clamp(0.75rem, 2vw, 1rem)",
              marginTop: "clamp(0.75rem, 2vw, 1.25rem)"
            }}
          >
            <Button asChild size="lg" className="group relative overflow-hidden w-full sm:w-auto">
              <Link 
                href="#contact" 
                style={{ 
                  padding: "clamp(0.625rem, 2vw, 0.875rem) clamp(1.5rem, 4vw, 2.5rem)",
                  fontSize: "clamp(0.875rem, 1.5vw, 1rem)"
                }}
              >
                <span className="relative z-10">Start a project</span>
                <span className="relative z-10 ml-2 transition-transform group-hover:translate-x-1">→</span>
                <span className="absolute inset-0 -z-0 bg-gradient-to-r from-rose-500 via-red-400 to-orange-300 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="group w-full sm:w-auto border-white/20 hover:border-white/40">
              <Link 
                href="https://blog.wearecodelovers.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ 
                  padding: "clamp(0.625rem, 2vw, 0.875rem) clamp(1.5rem, 4vw, 2.5rem)",
                  fontSize: "clamp(0.875rem, 1.5vw, 1rem)"
                }}
              >
                <span>Read our blog</span>
                <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </Button>
          </div>

        </div>

        <div 
          className="hero-metrics mx-auto grid w-full max-w-5xl sm:grid-cols-3"
          style={{ 
            gap: "clamp(0.75rem, 2vw, 1.5rem)",
            marginTop: "clamp(1rem, 3vw, 1.5rem)"
          }}
        >
          {heroMetrics.map((metric, index) => (
            <div
              key={metric.label}
              className="group flex flex-col items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 shadow-[0_0_35px_rgba(225,29,72,0.18)] backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-rose-400/30 hover:shadow-[0_0_45px_rgba(225,29,72,0.25)] sm:rounded-2xl"
              style={{
                transform: "translateZ(50px)",
                animationDelay: `${index * 100}ms`,
                padding: "clamp(1rem, 3vw, 1.5rem)"
              }}
            >
              <p 
                className="bg-gradient-to-br from-white via-rose-100 to-rose-200 bg-clip-text font-semibold text-transparent transition-all group-hover:scale-110"
                style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)" }}
              >
                {metric.value}
              </p>
              <p 
                className="text-slate-400 transition-colors group-hover:text-slate-300"
                style={{ 
                  fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)",
                  marginTop: "clamp(0.5rem, 1.5vw, 0.75rem)"
                }}
              >
                {metric.label}
              </p>
            </div>
          ))}
        </div>

        {/* Floating Cards with 3D Parallax */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          {heroCards.map((card, index) => (
            <div
              key={card.title}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className={card.className}
              style={{
                willChange: "transform",
              }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 sm:px-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-200 backdrop-blur-sm">
                {card.badge}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-white">{card.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
