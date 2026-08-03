"use client";

import { SiteShell } from "@/app/components/SiteShell";
import { HeroSection } from "@/app/components/sections/HeroSection";
import { PartnersSection } from "@/app/components/sections/PartnersSection";
import { SolutionsSection } from "@/app/components/sections/SolutionsSection";
import { ServicesSection } from "@/app/components/sections/ServicesSection";
import { CaseStudiesSection } from "@/app/components/sections/CaseStudiesSection";
import { DesignSection } from "@/app/components/sections/DesignSection";
import { AboutSection } from "@/app/components/sections/AboutSection";
import { CTASection } from "@/app/components/sections/CTASection";

export function ClientHome() {
  return (
    <SiteShell>
      <HeroSection />
      <PartnersSection />
      <SolutionsSection />
      <ServicesSection />
      <CaseStudiesSection />
      {/* TestimonialsSection hidden until real partner voices are ready */}
      <DesignSection />
      <AboutSection />
      <CTASection />
    </SiteShell>
  );
}
