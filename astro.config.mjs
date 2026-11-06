// @ts-check
import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import rehypeSanitize from "rehype-sanitize";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://wearecodelovers.com",
  output: "static",
  trailingSlash: "always",
  markdown: { processor: unified({ rehypePlugins: [rehypeSanitize] }) },
  integrations: [sitemap()],
  // Inline the CSS into each page: removes the render-blocking stylesheet
  // request, so the first paint needs only the HTML document.
  build: {
    inlineStylesheets: "always",
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
