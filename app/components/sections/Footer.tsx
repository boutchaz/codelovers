import Link from "next/link";
import { SectionBadge } from "@/app/components/ui/SectionBadge";
import { navigation, services, contactInfo, socialNetworks } from "@/app/data/constants";

export function Footer() {
  return (
    <footer
      id="contact"
      className="overflow-hidden border-t border-white/10 bg-slate-950/90 pt-[60px] pb-[60px] md:pt-[60px] md:pb-[40px] lg:pt-[80px] lg:pb-[80px] xl:pt-[140px] xl:pb-[80px]"
    >
      <div className="mx-auto w-full max-w-[1480px] px-6 lg:px-8">
        <div className="flex flex-col gap-16">
          <div className="flex flex-col gap-10 border-b border-white/10 pb-10 lg:flex-row lg:items-end lg:justify-between lg:gap-16 lg:pb-20">
            <div className="max-w-2xl space-y-6">
              <SectionBadge className="border-white/15 bg-white/10">Let&apos;s collaborate</SectionBadge>
              <h2 className="text-4xl font-semibold text-white sm:text-5xl lg:text-6xl">
                Ready to build the next award-winning experience?
              </h2>
              <p className="text-base leading-relaxed text-slate-300 lg:text-lg">
                Share your challenge and we&apos;ll assemble the strategy, design, engineering, and growth specialists to
                make it real.
              </p>
              <Link
                href="#contact"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-600 via-red-500 to-orange-400 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-rose-500/40 sm:w-auto"
              >
                Book a working session
                <span>↗</span>
              </Link>
            </div>

            <div className="grid gap-6 rounded-[32px] border border-white/10 bg-white/[0.04] p-8 sm:grid-cols-2 lg:max-w-xl">
              {contactInfo.map((item) => (
                <div key={item.label} className="space-y-2 border-b border-white/10 pb-4 last:border-b-0 last:pb-0">
                  <p className="text-xs uppercase tracking-[0.3em] text-rose-200">{item.label}</p>
                  <p className="text-base font-medium text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <Link href="/" className="text-2xl font-semibold">
                <span className="text-white">We Are</span>{" "}
                <span className="bg-gradient-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent">
                  Code Lovers
                </span>
              </Link>
              <p className="max-w-md text-sm text-slate-300">
                A global team of strategists, designers, engineers, and growth leaders crafting digital experiences that
                shape the future of ambitious brands.
              </p>
              <div className="grid gap-3 text-sm text-slate-300">
                <a className="transition hover:text-white" href="mailto:hello@wearecodelovers.com">
                  hello@wearecodelovers.com
                </a>
                <a className="transition hover:text-white" href="tel:+1234567890">
                  +1 (234) 567-890
                </a>
              </div>
              <div className="flex flex-wrap items-center gap-4 pt-6">
                {socialNetworks.map((network) => (
                  <a
                    key={network}
                    href="#"
                    aria-label={network}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.05] text-sm font-medium text-white transition hover:-translate-y-0.5 hover:border-rose-400/40 hover:text-rose-200"
                  >
                    {network.charAt(0)}
                  </a>
                ))}
              </div>
            </div>

            <div className="grid gap-12 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-200">Navigation</h3>
                <ul className="mt-5 space-y-3 text-sm text-slate-300">
                  {navigation.map((item) => (
                    <li key={item.label}>
                      <Link href={item.href} className="transition hover:text-white">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-200">Service Lines</h3>
                <ul className="mt-5 space-y-3 text-sm text-slate-300">
                  {services.slice(0, 5).map((service) => (
                    <li key={service.title}>
                      <Link href="#services" className="transition hover:text-white">
                        {service.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} We Are Code Lovers. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="#" className="transition hover:text-white">
              Privacy Policy
            </Link>
            <span className="hidden text-white/30 sm:inline-block">•</span>
            <Link href="#" className="transition hover:text-white">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
