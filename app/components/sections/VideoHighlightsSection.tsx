"use client";

import { useRef, useState } from "react";
import { SectionBadge } from "@/app/components/ui/SectionBadge";
import { videoHighlights } from "@/app/data/constants";

export function VideoHighlightsSection() {
  const [activeVideo, setActiveVideo] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: "next" | "prev") => {
    const container = carouselRef.current;
    if (!container) return;
    const card = container.querySelector<HTMLElement>("[data-video-card]");
    const cardWidth = card ? card.offsetWidth : container.clientWidth;
    const gap = parseInt(getComputedStyle(container).columnGap || "0", 10) || 24;
    const offset = cardWidth + gap;
    container.scrollBy({
      left: direction === "next" ? offset : -offset,
      behavior: "smooth",
    });
  };

  return (
    <section className="reveal-on-scroll bg-slate-950/70 py-28">
      <div className="mx-auto w-full max-w-[1280px] space-y-12 px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <SectionBadge>Inside Code Lovers</SectionBadge>
            <h2 className="text-4xl font-bold text-white sm:text-5xl">
              Experience how our teams design, build, and accelerate digital growth
            </h2>
            <p className="text-lg text-slate-300">
              A curated stream of moments from the studio—strategy labs, design sprints, engineering rituals, and growth
              experiments captured in motion.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-auto">
            <button
              type="button"
              onClick={() => scrollCarousel("prev")}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/10 text-lg text-white transition duration-300 hover:-translate-y-0.5 hover:border-rose-400/50 hover:bg-rose-500/20"
              aria-label="Scroll videos backward"
            >
              <span>←</span>
            </button>
            <button
              type="button"
              onClick={() => scrollCarousel("next")}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/10 text-lg text-white transition duration-300 hover:-translate-y-0.5 hover:border-rose-400/50 hover:bg-rose-500/20"
              aria-label="Scroll videos forward"
            >
              <span>→</span>
            </button>
          </div>
        </div>

        <div className="relative">
          <div
            ref={carouselRef}
            className="grid auto-cols-[minmax(85vw,1fr)] grid-flow-col gap-6 overflow-x-auto pb-4 [scroll-snap-type:x_mandatory] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:auto-cols-[minmax(300px,360px)] lg:auto-cols-[minmax(320px,380px)]"
            role="region"
            aria-label="Studio highlight videos"
          >
            {videoHighlights.map((video, index) => (
              <article
                key={video.title}
                data-video-card
                className={`group relative flex flex-col overflow-hidden rounded-[32px] border border-white/10 bg-slate-900/70 transition duration-500 ease-out [scroll-snap-align:start] hover:-translate-y-2 hover:border-rose-400/45 hover:shadow-[0_25px_80px_rgba(244,63,94,0.18)] focus-within:-translate-y-2 focus-within:border-rose-400/45 focus-within:shadow-[0_25px_80px_rgba(244,63,94,0.18)] ${
                  index === activeVideo ? "border-rose-400/60 shadow-[0_30px_90px_rgba(244,63,94,0.25)]" : ""
                }`}
              >
                <div className="relative mx-6 mt-6 overflow-hidden rounded-[28px] bg-slate-900/80">
                  <video
                    src={video.src}
                    poster={video.poster}
                    muted
                    loop
                    controls
                    playsInline
                    preload="metadata"
                    onPlay={() => setActiveVideo(index)}
                    onMouseEnter={(event) => {
                      event.currentTarget.play().catch(() => {});
                      setActiveVideo(index);
                    }}
                    onFocus={() => setActiveVideo(index)}
                    onMouseLeave={(event) => event.currentTarget.pause()}
                    className="h-full w-full rounded-[inherit] object-cover"
                  >
                    <track kind="captions" label={video.title} />
                  </video>
                  <span className="absolute bottom-4 right-4 rounded-full border border-white/20 bg-slate-900/75 px-4 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-50">
                    {video.duration}
                  </span>
                </div>
                <div className="flex flex-col gap-3 px-8 pb-10 pt-7">
                  <h3 className="text-lg font-semibold text-white">{video.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-300">{video.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
