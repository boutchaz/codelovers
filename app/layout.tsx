import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://wearecodelovers.com"),
  title: {
    default: "CodeLovers | Full-Stack Software & SaaS Engineering Studio",
    template: "%s | CodeLovers Product Engineering",
  },
  description:
    "CodeLovers is a Morocco-based product studio delivering full-stack development, SaaS engineering, IoT systems, E-Commerce solutions, and DevOps infrastructure for ambitious teams across MENA and Europe.",
  keywords: [
    "full-stack development Morocco",
    "SaaS engineering Morocco",
    "IoT development Morocco",
    "E-Commerce solutions Morocco",
    "DevOps and infrastructure Morocco",
    "CodeLovers",
    "software agency Morocco",
    "product engineering studio",
    "React development agency Morocco",
    "Next.js development Casablanca",
    "SaaS development North Africa",
    "IoT platform developer MENA",
    "Shopify Hydrogen development",
    "TypeScript development agency",
    "web agency Casablanca",
    "software studio Rabat",
    "enterprise software Morocco",
    "custom ERP development",
    "headless e-commerce Morocco",
    "cloud infrastructure Morocco",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://wearecodelovers.com/",
    title: "CodeLovers | Full-Stack Software & SaaS Engineering Studio",
    description:
      "Partner with CodeLovers for full-stack development, SaaS platforms, IoT systems, E-Commerce solutions, and DevOps infrastructure engineered in Morocco for global impact.",
    siteName: "CodeLovers",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "CodeLovers digital search agency Morocco",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeLovers | Full-Stack Development & SaaS Engineering Studio",
    description:
      "Full-stack development, SaaS engineering, IoT systems, E-Commerce builds, and DevOps infrastructure delivered by CodeLovers.",
    images: ["/logo.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-[100] -translate-y-full rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition-transform focus:translate-y-0"
        >
          Skip to main content
        </a>
        {children}
        <Script
          id="structured-data-organization"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "CodeLovers",
              url: "https://wearecodelovers.com/",
              image: "https://wearecodelovers.com/logo.png",
              logo: "https://wearecodelovers.com/logo.png",
              description:
                "CodeLovers is a Morocco software studio delivering full-stack development, SaaS engineering, IoT systems, E-Commerce solutions, and DevOps infrastructure for ambitious brands.",
              address: {
                "@type": "PostalAddress",
                addressCountry: "MA",
                addressLocality: "Casablanca",
              },
               areaServed: ["MA", "FR", "ES", "United Kingdom", "United States"],
               telephone: "+212691870293",
               foundingDate: "2018",
               priceRange: "$$",
               knowsLanguage: ["en", "fr", "ar"],
               contactPoint: [
                 {
                   "@type": "ContactPoint",
                   contactType: "sales",
                   telephone: "+212691870293",
                   email: "tech@wearecodelovers.com",
                 },
               ],
              sameAs: [
                "https://www.linkedin.com/company/wearecodelovers",
                "https://github.com/code-lovers",
              ],
              serviceType: [
                "Full-stack web and mobile development",
                "SaaS platform engineering",
                "IoT and real-time systems",
                "E-Commerce solution design",
                "DevOps and cloud infrastructure",
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
