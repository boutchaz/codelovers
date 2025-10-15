import Link from "next/link";
import { SectionBadge } from "@/app/components/ui/SectionBadge";
import { capabilities } from "@/app/data/constants";
import { RevealText } from "@/components/ui/reveal-text";

export function SolutionsSection() {
  return (
    <section id="solutions" className="reveal-on-scroll py-28">
      <div className="mx-auto grid w-full max-w-[1200px] items-center gap-16 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="space-y-6">
          <SectionBadge>Outcomes first</SectionBadge>
          <RevealText
            as="h2"
            className="block"
            innerClassName="text-4xl font-bold text-white sm:text-5xl"
          >
            Solutions that align brand, experience, and engineering around measurable impact
          </RevealText>
          <RevealText
            as="p"
            className="block"
            innerClassName="text-lg text-slate-300"
            delay={140}
          >
            We help founders and enterprises translate ambition into validated roadmaps, orchestrated experiences, and
            high-velocity product delivery.
          </RevealText>
          <ul className="grid gap-4 text-sm text-slate-300">
            <li className="rounded-2xl border border-white/5 bg-white/5 p-6 sm:p-8 lg:p-10 backdrop-blur">
              <span className="text-rose-200">01.</span> Venture co-creation and market entry acceleration
            </li>
            <li className="rounded-2xl border border-white/5 bg-white/5 p-6 sm:p-8 lg:p-10 backdrop-blur">
              <span className="text-rose-200">02.</span> Composable platform builds for omni-channel experiences
            </li>
            <li className="rounded-2xl border border-white/5 bg-white/5 p-6 sm:p-8 lg:p-10 backdrop-blur">
              <span className="text-rose-200">03.</span> Continuous optimisation squads plugged to your KPIs
            </li>
          </ul>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="#services"
              className="inline-flex items-center gap-2 rounded-full border border-rose-400/40 px-6 py-3 sm:px-8 sm:py-3.5 text-sm font-semibold text-rose-200 transition hover:border-rose-400 hover:text-white"
            >
              Explore services
              <span>→</span>
            </Link>
            <Link
              href="#works"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 sm:px-8 sm:py-3.5 text-sm font-semibold text-white transition hover:border-rose-400/40 hover:text-rose-200"
            >
              Case studies
              <span>↗</span>
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="solutions-panel rounded-[36px] border border-white/10 bg-white/[0.04] p-10 sm:p-12 lg:p-14">
            <div className="solutions-grid grid gap-6">
              {capabilities.map((capability) => (
                <div
                  key={capability.title}
                  className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/6 to-transparent p-6 sm:p-8 lg:p-10 backdrop-blur"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-200">{capability.title}</p>
                  <h3 className="mt-4 text-lg font-semibold text-white">{capability.description}</h3>
                  <ul className="mt-4 space-y-2 text-sm text-slate-300">
                    {capability.points.map((point) => (
                      <li key={point} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-rose-300" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
