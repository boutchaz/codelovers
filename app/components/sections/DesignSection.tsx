"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function DesignSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const content = contentRef.current;
      const letters = lettersRef.current.filter(Boolean);

      if (!section || !content || letters.length === 0) return;

      ScrollTrigger.getById("design-scroll")?.kill(true);

      gsap.set(letters, { opacity: 0, scale: 0.85, y: 24 });
      gsap.set(content, { opacity: 0, y: 32 });

      const width = window.innerWidth;
      const scrub = width < 768 ? 1.4 : 1;
      const stagger = width < 768 ? 0.06 : 0.08;

      // CSS sticky holds the panel; ScrollTrigger only scrubs the reveal.
      // Avoids GSAP pin/transform ghosts under the fixed header.
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
      }).to(
        content,
        { opacity: 1, y: 0, duration: 0.35, ease: "none" },
        "-=0.12"
      );

      return () => {
        ScrollTrigger.getById("design-scroll")?.kill(true);
      };
    },
    { scope: sectionRef, dependencies: [], revertOnUpdate: true }
  );

  const word = "DESIGN";

  return (
    <section ref={sectionRef} className="relative h-[200vh] bg-slate-950">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden pt-16 sm:pt-20">
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-6 py-10 text-center">
          <h2
            className="mb-6 flex flex-wrap justify-center gap-1 sm:mb-8 sm:gap-2"
            aria-label="Design"
          >
            {word.split("").map((letter, index) => (
              <span
                key={`${letter}-${index}`}
                ref={(el) => {
                  lettersRef.current[index] = el;
                }}
                className="inline-block bg-gradient-to-r from-rose-400 via-red-400 to-orange-300 bg-clip-text text-[clamp(2.75rem,9vw,7rem)] font-bold leading-none text-transparent"
                style={{ opacity: 0 }}
                aria-hidden="true"
              >
                {letter}
              </span>
            ))}
          </h2>

          <div
            ref={contentRef}
            className="max-w-2xl space-y-6"
            style={{ opacity: 0 }}
          >
            <p className="text-base leading-relaxed text-slate-300 sm:text-lg">
              We craft digital experiences that blend creativity, technology, and human-centered
              design to create meaningful connections between brands and their audiences.
            </p>

            <Button asChild size="lg">
              <Link href="/#contact" style={{ padding: "0.75rem 2rem" }}>
                Get in Touch
              </Link>
            </Button>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-rose-500/20 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl" />
        </div>
      </div>
    </section>
  );
}
