import type { Metadata } from "next";
import Link from "next/link";
import { services, capabilities } from "@/app/data/constants";
import { SectionBadge } from "@/app/components/ui/SectionBadge";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Full-stack development, SaaS engineering, IoT systems, E-Commerce solutions, DevOps infrastructure, and enterprise software delivered by CodeLovers from Morocco.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services | CodeLovers Product Engineering",
    description:
      "End-to-end service lines: Full-stack dev, SaaS, IoT, E-Commerce, DevOps, and enterprise systems.",
    url: "https://wearecodelovers.com/services",
  },
};

const processSteps = [
  {
    step: "01",
    title: "Discover & Define",
    description:
      "We start with deep problem framing through user research, market validation, and technical feasibility analysis to ensure we build the right thing.",
    deliverables: ["User research insights", "Lean validation report", "Technical roadmap"],
  },
  {
    step: "02",
    title: "Design & Build",
    description:
      "Interface and interaction design supported by robust engineering delivery. We prototype rapidly and iterate based on real feedback.",
    deliverables: ["Interactive prototypes", "Frontend & Backend development", "Cloud infrastructure"],
  },
  {
    step: "03",
    title: "Launch & Scale",
    description:
      "Continuous iteration, data analytics, and product-led growth experiments. We stay engaged post-launch to optimize outcomes.",
    deliverables: ["CI/CD pipelines", "Analytics instrumentation", "Growth optimization"],
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="relative">
        {/* Hero */}
        <section className="pb-20 pt-32 sm:pt-40">
          <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
            <SectionBadge>Capabilities</SectionBadge>
            <h1 className="mt-6 text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
              End-to-end service lines that shape{" "}
              <span className="bg-gradient-to-r from-rose-400 via-red-400 to-orange-300 bg-clip-text text-transparent">
                digital leaders
              </span>
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-300">
              We assemble cross-functional squads across strategy, design, technology, and
              engineering &mdash; tailored to the mission at hand.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="border-t border-white/5 bg-slate-950/70 py-24">
          <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {services.map((service) => (
                <div
                  key={service.title}
                  className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-8 transition-all hover:-translate-y-1 hover:border-rose-500/40 hover:bg-white/[0.06] lg:p-10"
                >
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 via-red-400/15 to-orange-400/20 blur-3xl" />
                  </div>
                  <div className="relative space-y-6">
                    <h3 className="text-2xl font-semibold text-white">{service.title}</h3>
                    <p className="text-sm leading-relaxed text-slate-300">{service.description}</p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {service.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-rose-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-24">
          <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
            <SectionBadge>Our process</SectionBadge>
            <h2 className="mt-6 text-3xl font-bold text-white sm:text-4xl">
              From idea to impact in three phases
            </h2>
            <div className="mt-16 grid gap-8 lg:grid-cols-3">
              {processSteps.map((step) => (
                <div
                  key={step.step}
                  className="relative rounded-[32px] border border-white/10 bg-white/[0.04] p-8 lg:p-10"
                >
                  <span className="text-5xl font-bold text-rose-500/20">{step.step}</span>
                  <h3 className="mt-4 text-xl font-semibold text-white">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">
                    {step.description}
                  </p>
                  <ul className="mt-6 space-y-2">
                    {step.deliverables.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-slate-400">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Capabilities */}
        <section className="border-t border-white/5 bg-slate-950/70 py-24">
          <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
            <SectionBadge>Outcomes first</SectionBadge>
            <h2 className="mt-6 text-3xl font-bold text-white sm:text-4xl">
              Solutions that align brand, experience, and engineering
            </h2>
            <div className="mt-12 grid gap-8 lg:grid-cols-3">
              {capabilities.map((cap) => (
                <div
                  key={cap.title}
                  className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-8 backdrop-blur lg:p-10"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-200">
                    {cap.title}
                  </p>
                  <h3 className="mt-4 text-lg font-semibold text-white">{cap.description}</h3>
                  <ul className="mt-4 space-y-2 text-sm text-slate-300">
                    {cap.points.map((point) => (
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
        </section>

        {/* CTA */}
        <section className="py-24">
          <div className="mx-auto max-w-[1200px] px-6 text-center lg:px-8">
            <div className="rounded-[40px] border border-white/10 bg-gradient-to-r from-rose-600/35 via-red-500/25 to-orange-400/30 p-12 backdrop-blur lg:p-16">
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                Have a project in mind?
              </h2>
              <p className="mt-4 text-lg text-slate-200">
                Tell us about your challenge and we&apos;ll assemble the right squad.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="https://cal.com/codelovers/30min?user=codelovers&overlayCalendar=true&layout=month_view"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-rose-100"
                >
                  Book a working session <span>↗</span>
                </Link>
                <Link
                  href="/case-studies"
                  className="inline-flex items-center gap-2 rounded-full border border-white/40 px-8 py-3 text-sm font-semibold text-white transition hover:border-white hover:text-rose-200"
                >
                  View our work <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
