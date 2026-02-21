"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { navigation } from "@/app/data/constants";

const sectionLinks = [
  { label: "Services", href: "/#services" },
  { label: "Work", href: "/#works" },
  { label: "About", href: "/#about" },
];

const allNavLinks = [...sectionLinks, ...navigation];

interface HeaderProps {
  isScrolled: boolean;
}

export function Header({ isScrolled }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
        isScrolled
          ? "border-b border-white/10 bg-[rgba(5,6,15,0.8)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
      style={{ margin: "0 auto" }}
    >
      <nav
        className="mx-auto flex h-16 w-full max-w-[1480px] items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8"
        style={{ margin: "0 auto" }}
      >
        <Link href="/" className="flex items-center gap-2 sm:gap-3">
          <span className="relative h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12">
            <Image
              src="/logo.png"
              alt="CodeLovers logo"
              fill
              priority
              sizes="(max-width: 640px) 32px, (max-width: 1024px) 40px, 48px"
              className="object-contain"
            />
          </span>
          <div className="flex flex-col">
            <span className="text-base font-semibold tracking-tight text-white sm:text-lg lg:text-xl">
              Code<span className="text-rose-400">Lovers</span>
            </span>
            <span className="hidden text-[9px] font-semibold uppercase tracking-[0.4em] text-rose-300 sm:block sm:text-[10px]">
              Innovating Excellence
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-6 md:flex lg:gap-8">
            {allNavLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-slate-300 transition hover:text-rose-300"
                {...(item.href.startsWith("http") && {
                  target: "_blank",
                  rel: "noopener noreferrer",
                })}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <Button asChild size="sm" className="text-xs sm:text-sm">
            <Link href="#contact" style={{ padding: "0.5rem 1rem" }}>
              Let&apos;s talk
            </Link>
          </Button>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-white transition hover:bg-white/10 md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-slate-950/95 backdrop-blur-xl sm:top-20 md:hidden">
          <div className="flex flex-col gap-2 px-6 py-8">
            {allNavLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeMenu}
                className="rounded-xl px-4 py-3 text-lg font-medium text-slate-200 transition hover:bg-white/5 hover:text-rose-300"
                {...(item.href.startsWith("http") && {
                  target: "_blank",
                  rel: "noopener noreferrer",
                })}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-4 border-t border-white/10 pt-6">
              <Button asChild size="lg" className="w-full">
                <Link href="#contact" onClick={closeMenu} style={{ padding: "0.75rem 2rem" }}>
                  Let&apos;s talk
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
