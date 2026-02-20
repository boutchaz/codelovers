import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/ingest/", "/api/"],
    },
    sitemap: "https://wearecodelovers.com/sitemap.xml",
  };
}
