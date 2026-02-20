import type { Metadata } from "next";
import Link from "next/link";
import { caseStudies } from "@/app/data/constants";
import { SectionBadge } from "@/app/components/ui/SectionBadge";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Real-world transformations: IoT cold chain monitoring, AgriTech satellite analytics, SaaS automation, Shopify Hydrogen e-commerce, and enterprise ERP solutions by CodeLovers.",
  alternates: { canonical: "/case-studies" },
  openGraph: {
    title: "Case Studies | CodeLovers Product Engineering",
    description:
      "Explore how we build SaaS platforms, IoT systems, e-commerce storefronts, and enterprise software.",
    url: "https://wearecodelovers.com/case-studies",
  },
};

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="relative">
        {/* Hero */}
        <section className="pb-20 pt-32 sm:pt-40">
          <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
            <SectionBadge>Case studies</SectionBadge>
            <h1 className="mt-6 text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
              Real-world transformations that redefine{" "}
              <span className="bg-gradient-to-r from-rose-400 via-red-400 to-orange-300 bg-clip-text text-transparent">
                customer experience
              </span>
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-300">
              Every engagement is anchored in measurable change &mdash; shifting behaviours,
              expanding revenue, and building loyalty through craft.
            </p>
          </div>
        </section>

        {/* Case Studies Grid */}
        <section className="border-t border-white/5 py-24">
          <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-2">
              {caseStudies.map((study) => (
                <div
                  key={study.title}
                  className="group relative overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.04] p-10 transition-all hover:-translate-y-2 hover:border-rose-500/40 hover:bg-white/[0.06] sm:p-12 lg:p-14"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${study.gradient} opacity-0 transition-opacity group-hover:opacity-30`}
                  />
                  <div className="relative flex h-full flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-rose-200">
                        {study.category}
                      </span>
                      <h2 className="text-2xl font-semibold text-white">{study.title}</h2>
                      <p className="text-sm leading-relaxed text-slate-300">{study.summary}</p>
                    </div>
                    <div className="border-t border-white/10 pt-6">
                      <p className="text-4xl font-semibold text-white">{study.result}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.3em] text-rose-200">
                        {study.metric}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24">
          <div className="mx-auto max-w-[1200px] px-6 text-center lg:px-8">
            <div className="rounded-[40px] border border-white/10 bg-gradient-to-r from-rose-600/35 via-red-500/25 to-orange-400/30 p-12 backdrop-blur lg:p-16">
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                Ready to be our next success story?
              </h2>
              <p className="mt-4 text-lg text-slate-200">
                Share your challenge and we&apos;ll assemble the right team.
              </p>
              <Link
                href="https://cal.com/codelovers/30min?user=codelovers&overlayCalendar=true&layout=month_view"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-rose-100"
              >
                Book a working session <span>↗</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
