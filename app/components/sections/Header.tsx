"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { navigation } from "@/app/data/constants";

interface HeaderProps {
  isScrolled: boolean;
}

export function Header({ isScrolled }: HeaderProps) {
  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
        isScrolled
          ? "border-b border-white/10 bg-[rgba(5,6,15,0.8)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
      style={{ margin: '0 auto' }}
    >
      <nav className="mx-auto flex h-16 w-full max-w-[1480px] items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8" style={{ margin: '0 auto' }}>
        <Link href="/" className="flex items-center gap-2 sm:gap-4">
          <span className="relative hidden h-8 w-8 sm:h-12 sm:w-12 md:block">
            <Image src="/codelovers-logo.svg" alt="CodeLovers logo" fill priority sizes="48px" />
          </span>
          <div className="flex flex-col">
            <span className="text-base font-semibold tracking-tight text-white sm:text-xl">
              Code<span className="text-rose-400">Lovers</span>
            </span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-[0.5em] text-rose-300 sm:block">
              Innovating Excellence
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-6 md:flex lg:gap-8">
            {navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-slate-300 transition hover:text-rose-300"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <Button asChild size="sm" className="text-xs sm:text-sm">
            <Link href="#contact">Let&apos;s talk</Link>
          </Button>
        </div>
      </nav>
    </div>
  );
}
