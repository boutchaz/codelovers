"use client";

import { useEffect, useState } from "react";
import { Header } from "@/app/components/sections/Header";
import { HeroSection } from "@/app/components/sections/HeroSection";
import { DesignSection } from "@/app/components/sections/DesignSection";
import { Footer } from "@/app/components/sections/Footer";
import { ScrollObserver } from "@/app/components/ui/ScrollObserver";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 scroll-smooth">
      <Header isScrolled={isScrolled} />

      <main className="relative">
        <HeroSection />
        <DesignSection />
      </main>

      <Footer />
      <ScrollObserver />
    </div>
  );
}
