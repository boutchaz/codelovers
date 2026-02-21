"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function DesignSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const letters = lettersRef.current.filter(Boolean);
      const content = contentRef.current;

      if (letters.length === 0 || !content) return;

      // Set initial hidden state immediately so content is never
      // visible before the scroll animation begins
      gsap.set(letters, { opacity: 0, scale: 0.8, y: 20 });
      gsap.set(content, { opacity: 0, y: 40 });

      const width = window.innerWidth;
      const config =
        width < 768
          ? { end: "+=100%", stagger: 0.08, scrub: 1.8 }
          : width < 1024
            ? { end: "+=125%", stagger: 0.09, scrub: 1.5 }
            : { end: "+=150%", stagger: 0.1, scrub: 1.2 };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: config.end,
          scrub: config.scrub,
          pin: true,
          pinSpacing: true,
          id: "design-scroll",
          invalidateOnRefresh: true,
          anticipatePin: 1,
          fastScrollEnd: true,
        },
      });

      letters.forEach((letter, index) => {
        tl.to(
          letter,
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out",
          },
          index * config.stagger
        );
      });

      tl.to(
        content,
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        "+=0.2"
      );
    },
    { scope: sectionRef }
  );

  const word = "DESIGN";

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950"
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
              style={{ opacity: 0 }}
            >
              {letter}
            </span>
          ))}
        </h2>

        <div ref={contentRef} className="max-w-2xl space-y-8 overflow-hidden" style={{ opacity: 0 }}>
          <p className="text-lg leading-relaxed text-slate-300 sm:text-xl">
            We craft digital experiences that blend creativity, technology, and human-centered design to create
            meaningful connections between brands and their audiences.
          </p>

          <Button asChild size="lg">
            <Link href="#contact" style={{ padding: "0.75rem 2rem" }}>Get in Touch</Link>
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
