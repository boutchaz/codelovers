import { SectionBadge } from "@/app/components/ui/SectionBadge";
import { aboutStats, aboutFeatures } from "@/app/data/constants";

export function AboutSection() {
  return (
    <section id="about" className="reveal-on-scroll bg-slate-950/70 py-28">
      <div className="mx-auto grid w-full max-w-[1200px] gap-16 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.04] p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(239,68,68,0.28),transparent_60%)]" />
          <div className="absolute inset-0 bg-grid-fade" />
          <div className="relative space-y-6">
            <SectionBadge>Why we exist</SectionBadge>
            <h2 className="text-3xl font-semibold text-white">
              Crafting meaningful brand and product stories through design, narrative, and technology.
            </h2>
            <p className="text-sm leading-relaxed text-slate-300">
              We partner with marketing leaders, product owners, and founders to orchestrate journeys that span
              acquisition, adoption, and advocacy. Our squads embed deep within your teams to share the same ambition and
              metrics.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {aboutStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-3xl font-semibold text-white">{stat.value}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.3em] text-rose-200">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8 self-center">
          <blockquote className="rounded-[32px] border border-white/10 bg-white/[0.05] p-10 text-lg text-slate-200">
            "Every engagement is built on shared ownership. We move quickly, stay accountable, and deliver craft that
            makes the complex feel effortless."
          </blockquote>
          <div className="grid gap-6 sm:grid-cols-2">
            {aboutFeatures.map((feature) => (
              <div key={feature.title} className="rounded-[28px] border border-white/10 bg-white/[0.05] p-8">
                <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                <p className="mt-3 text-sm text-slate-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
