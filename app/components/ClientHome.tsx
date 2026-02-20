"use client";

import { useEffect, useState } from "react";
import { Header } from "@/app/components/sections/Header";
import { HeroSection } from "@/app/components/sections/HeroSection";
import { PartnersSection } from "@/app/components/sections/PartnersSection";
import { SolutionsSection } from "@/app/components/sections/SolutionsSection";
import { ServicesSection } from "@/app/components/sections/ServicesSection";
import { CaseStudiesSection } from "@/app/components/sections/CaseStudiesSection";
import { TestimonialsSection } from "@/app/components/sections/TestimonialsSection";
import { DesignSection } from "@/app/components/sections/DesignSection";
import { AboutSection } from "@/app/components/sections/AboutSection";
import { CTASection } from "@/app/components/sections/CTASection";
import { Footer } from "@/app/components/sections/Footer";
import { ScrollObserver } from "@/app/components/ui/ScrollObserver";

export function ClientHome() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 16);
          ticking = false;
        });
        ticking = true;
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header isScrolled={isScrolled} />

      <main id="main-content" className="relative">
        <HeroSection />
        <PartnersSection />
        <SolutionsSection />
        <ServicesSection />
        <CaseStudiesSection />
        <TestimonialsSection />
        <DesignSection />
        <AboutSection />
        <CTASection />
      </main>

      <Footer />
      <ScrollObserver />
    </div>
  );
}
