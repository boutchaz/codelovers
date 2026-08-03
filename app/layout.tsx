import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://wearecodelovers.com";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#05060f" },
    { media: "(prefers-color-scheme: light)", color: "#05060f" },
  ],
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "CodeLovers | Full-Stack Software & SaaS Engineering Studio",
    template: "%s | CodeLovers Product Engineering",
  },
  description:
    "CodeLovers is a Rabat-based product studio delivering full-stack development, SaaS engineering, IoT systems, E-Commerce solutions, and DevOps infrastructure for ambitious teams across MENA and Europe.",
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
    "TanStack development Morocco",
    "Next.js development Rabat",
    "SaaS development North Africa",
    "IoT platform developer MENA",
    "Shopify Hydrogen development",
    "TypeScript development agency",
    "web agency Rabat",
    "software studio Rabat",
    "enterprise software Morocco",
    "custom ERP development",
    "headless e-commerce Morocco",
    "cloud infrastructure Morocco",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${siteUrl}/`,
    title: "CodeLovers | Full-Stack Software & SaaS Engineering Studio",
    description:
      "Partner with CodeLovers for full-stack development, SaaS platforms, IoT systems, E-Commerce solutions, and DevOps infrastructure engineered in Morocco for global impact.",
    siteName: "CodeLovers",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CodeLovers — Full-Stack Software & SaaS Engineering Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeLovers | Full-Stack Development & SaaS Engineering Studio",
    description:
      "Full-stack development, SaaS engineering, IoT systems, E-Commerce builds, and DevOps infrastructure delivered by CodeLovers.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": `${siteUrl}/#organization`,
      name: "CodeLovers",
      url: `${siteUrl}/`,
      image: `${siteUrl}/og-image.png`,
      logo: `${siteUrl}/logo.png`,
      description:
        "CodeLovers is a Morocco software studio delivering full-stack development, SaaS engineering, IoT systems, E-Commerce solutions, and DevOps infrastructure for ambitious brands.",
      address: {
        "@type": "PostalAddress",
        addressCountry: "MA",
        addressLocality: "Rabat",
      },
      areaServed: ["MA", "FR", "ES", "United Kingdom", "United States"],
      telephone: "+212691870293",
      email: "tech@wearecodelovers.com",
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
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: `${siteUrl}/`,
      name: "CodeLovers",
      description:
        "Full-stack software and SaaS engineering studio based in Rabat, Morocco.",
      publisher: { "@id": `${siteUrl}/#organization` },
      inLanguage: "en",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        {children}
      </body>
    </html>
  );
}
