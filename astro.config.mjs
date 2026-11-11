// @ts-check
import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import { markdown } from "./src/data/markdown.mjs";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://wearecodelovers.com",
  output: "static",
  trailingSlash: "always",
  adapter: node({mode: "standalone", bodySizeLimit: 131072}),
  session: false,
  // The only dynamic POST route checks the ERP Origin itself; public pages stay static.
  security: {checkOrigin: false},
  markdown,
  // The sitemap pairs each English page with its /fr/ counterpart (about, services, case studies, home).
  integrations: [sitemap({ filter: (page) => !new URL(page).pathname.startsWith("/preview/"), i18n: { defaultLocale: "en", locales: { en: "en", fr: "fr" } } })],
  // Inline the CSS into each page: removes the render-blocking stylesheet
  // request, so the first paint needs only the HTML document.
  build: {
    inlineStylesheets: "always",
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
