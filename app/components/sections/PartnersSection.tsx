import { partners } from "@/app/data/constants";

export function PartnersSection() {
  return (
    <section className="reveal-on-scroll border-y border-white/5 bg-slate-950/60 py-14">
      <div className="mx-auto flex w-full max-w-[1280px] flex-wrap items-center justify-center gap-8 px-6 text-sm uppercase tracking-[0.3em] text-slate-400 lg:px-8">
        <span className="text-xs font-semibold text-rose-200">Trusted by teams that lead their markets</span>
        <div className="h-3 w-px bg-white/10" />
        {partners.map((partner) => (
          <span key={partner} className="text-xs font-medium text-slate-300">
            {partner}
          </span>
        ))}
      </div>
    </section>
  );
}
