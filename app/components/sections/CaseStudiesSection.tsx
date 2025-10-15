import Link from "next/link";
import { SectionBadge } from "@/app/components/ui/SectionBadge";
import { caseStudies } from "@/app/data/constants";

export function CaseStudiesSection() {
  return (
    <section id="works" className="reveal-on-scroll py-28">
      <div className="mx-auto w-full max-w-[1280px] px-6 lg:px-8">
        <div className="mb-16 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <SectionBadge>Case studies</SectionBadge>
            <h2 className="text-4xl font-bold text-white sm:text-5xl">
              Real-world transformations that redefine customer experience
            </h2>
            <p className="max-w-3xl text-lg text-slate-300">
              Every engagement is anchored in measurable change—shifting behaviours, expanding revenue, and building
              loyalty through craft.
            </p>
          </div>

          <Link
            href="#contact"
            className="self-start rounded-full border border-white/15 px-6 py-3 sm:px-8 sm:py-3.5 text-sm font-semibold text-white transition hover:border-rose-400/40 hover:text-rose-200"
          >
            Share your challenge →
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {caseStudies.map((study) => (
            <div
              key={study.title}
              className="group relative overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.04] p-10 sm:p-12 lg:p-14 transition-all hover:-translate-y-2 hover:border-rose-500/40 hover:bg-white/[0.06]"
            >
              <div className={`case-study-glow ${study.gradient}`} />
              <div className="relative flex h-full flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 sm:px-4 text-xs font-semibold uppercase tracking-[0.3em] text-rose-200">
                    {study.category}
                  </span>
                  <h3 className="text-2xl font-semibold text-white">{study.title}</h3>
                  <p className="text-sm text-slate-300">{study.summary}</p>
                </div>
                <div>
                  <p className="text-4xl font-semibold text-white">{study.result}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.3em] text-rose-200">{study.metric}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
