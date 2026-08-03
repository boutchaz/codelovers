import { partners, heroMetrics } from "@/app/data/constants";

export function PartnersSection() {
  return (
    <section className="reveal-on-scroll border-y border-white/5 bg-slate-950/60 py-12 sm:py-14">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-10 px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {heroMetrics.map((metric) => (
            <div key={metric.label} className="flex flex-col items-center text-center sm:items-start sm:text-left">
              <p className="bg-gradient-to-br from-white via-rose-100 to-rose-200 bg-clip-text text-2xl font-semibold text-transparent sm:text-3xl">
                {metric.value}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">{metric.label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 text-sm uppercase tracking-[0.3em] text-slate-400">
          <span className="text-xs font-semibold text-rose-200">
            Trusted by teams that lead their markets
          </span>
          <div className="hidden h-3 w-px bg-white/10 sm:block" />
          {partners.map((partner) => (
            <span key={partner} className="text-xs font-medium text-slate-300">
              {partner}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
