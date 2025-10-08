"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export function DesignSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const letters = lettersRef.current.filter(Boolean);
    const content = contentRef.current;

    if (!section || letters.length === 0 || !content) return;

    // Wait for HeroSection to fully initialize and complete its setup
    const initTimeout = setTimeout(() => {
      // Refresh to ensure all previous triggers are accounted for
      ScrollTrigger.refresh();

      // Create timeline for the scroll animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=150%",
          scrub: 1,
          pin: true,
          pinSpacing: true,
          id: "design-scroll",
          invalidateOnRefresh: true,
        },
      });

      // Animate each letter from blurry/transparent to clear
      letters.forEach((letter, index) => {
        tl.fromTo(
          letter,
          {
            opacity: 0,
            filter: "blur(20px)",
            scale: 0.8,
          },
          {
            opacity: 1,
            filter: "blur(0px)",
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
          },
          index * 0.1 // Stagger timing
        );
      });

      // Fade in paragraph and button after all letters are revealed
      tl.fromTo(
        content,
        {
          opacity: 0,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        "+=0.2"
      );
    }, 500); // Increased delay to ensure HeroSection is fully initialized

    return () => {
      clearTimeout(initTimeout);
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.id === "design-scroll") {
          trigger.kill();
        }
      });
    };
  }, []);

  const word = "DESIGN";

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950"
      style={{ overflow: "hidden" }}
    >
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center justify-center overflow-hidden px-6 py-32 text-center">
        <h2 className="mb-12 flex flex-wrap justify-center gap-2 overflow-hidden">
          {word.split("").map((letter, index) => (
            <span
              key={index}
              ref={(el) => {
                lettersRef.current[index] = el;
              }}
              className="inline-block bg-gradient-to-r from-rose-400 via-red-400 to-orange-300 bg-clip-text text-[clamp(4rem,15vw,12rem)] font-bold leading-none text-transparent"
              style={{ willChange: "transform, opacity, filter" }}
            >
              {letter}
            </span>
          ))}
        </h2>

        <div ref={contentRef} className="max-w-2xl space-y-8 overflow-hidden" style={{ willChange: "transform, opacity" }}>
          <p className="text-lg leading-relaxed text-slate-300 sm:text-xl">
            We craft digital experiences that blend creativity, technology, and human-centered design to create
            meaningful connections between brands and their audiences.
          </p>

          <Button asChild size="lg">
            <Link href="#services">Learn More</Link>
          </Button>
        </div>
      </div>

      {/* Background gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-rose-500/20 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl" />
      </div>
    </section>
  );
}
