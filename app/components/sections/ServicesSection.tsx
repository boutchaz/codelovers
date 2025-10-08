import { SectionBadge } from "@/app/components/ui/SectionBadge";
import { services } from "@/app/data/constants";

export function ServicesSection() {
  return (
    <section id="services" className="reveal-on-scroll bg-slate-950/70 py-28">
      <div className="mx-auto w-full max-w-[1280px] px-6 lg:px-8">
        <div className="mb-16 space-y-4">
          <SectionBadge>Capabilities</SectionBadge>
          <h2 className="text-4xl font-bold text-white sm:text-5xl">
            End-to-end service lines that shape tomorrow&apos;s digital leaders
          </h2>
          <p className="max-w-3xl text-lg text-slate-300">
            We assemble cross-functional squads across strategy, design, technology, and marketing—tailored to the
            mission at hand.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-8 transition-all hover:-translate-y-1 hover:border-rose-500/40 hover:bg-white/[0.06]"
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
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-wide text-rose-200"
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
  );
}
