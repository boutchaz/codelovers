import Link from "next/link";
import { RevealText } from "@/components/ui/reveal-text";

export function CTASection() {
  return (
    <section className="reveal-on-scroll py-28">
      <div className="mx-auto w-full max-w-[1320px] px-6 text-center lg:px-8">
        <div className="rounded-[40px] border border-white/10 bg-gradient-to-r from-rose-600/35 via-red-500/25 to-orange-400/30 p-16 backdrop-blur">
          <RevealText
            as="h2"
            className="block"
            innerClassName="text-4xl font-semibold text-white sm:text-5xl"
          >
            Ready to create the next market-defining experience?
          </RevealText>
          <RevealText
            as="p"
            className="mt-6 block"
            innerClassName="text-lg text-slate-100"
            delay={160}
          >
            Let&apos;s align on your ambition, detail the roadmap, and assemble a squad to make it real.
          </RevealText>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-rose-100"
            >
              Book a working session
              <span>↗</span>
            </Link>
            <Link
              href="#services"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-8 py-3 text-sm font-semibold text-white transition hover:border-white hover:text-rose-200"
            >
              Explore capabilities
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
