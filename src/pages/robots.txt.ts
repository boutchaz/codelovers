import type { APIRoute } from "astro";

const SITE_URL = "https://wearecodelovers.com";

export const GET: APIRoute = () => {
  const body = `User-agent: *
Allow: /
Disallow: /ingest/

Sitemap: ${SITE_URL}/sitemap-index.xml
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
