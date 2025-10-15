import { SectionBadge } from "@/app/components/ui/SectionBadge";
import { testimonials } from "@/app/data/constants";

export function TestimonialsSection() {
  return (
    <section className="reveal-on-scroll py-28">
      <div className="mx-auto w-full max-w-[1280px] px-6 lg:px-8">
        <div className="mb-16 flex flex-col gap-4 text-center">
          <div className="mx-auto">
            <SectionBadge>Voices from partners</SectionBadge>
          </div>
          <h2 className="text-4xl font-bold text-white sm:text-5xl">Stories of ambition realised</h2>
          <p className="mx-auto max-w-3xl text-lg text-slate-300">
            We design for outcomes, but it&apos;s the relationships and trust we build that keep the work remarkable.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.author}
              className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.05] p-6 sm:p-8 lg:p-10 transition-all hover:-translate-y-2 hover:border-rose-500/30 hover:bg-white/[0.07]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/12 via-red-500/6 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative space-y-6">
                <div className="flex gap-1 text-rose-300">
                  {[...Array(5)].map((_, index) => (
                    <span key={index}>★</span>
                  ))}
                </div>
                <p className="text-base leading-relaxed text-slate-200">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="pt-4 text-sm">
                  <p className="font-semibold text-white">{testimonial.author}</p>
                  <p className="mt-1 text-slate-400">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
