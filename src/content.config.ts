import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(""),
    date: z.coerce.date(),
    author: z.string().default("CodeLovers"),
    language: z.enum(["en", "fr"]).default("en"),
    // Product the article is about (a case-study slug). Counted by the analytics and used to pick the call to action.
    product: z.string().regex(/^[a-z0-9-]*$/).default(""),
    // Keeps the URL working but hides the post from the blog index, the feed and "read next".
    unlisted: z.boolean().default(false),
    // Not published yet: the post is left out of the build entirely (no page, feed entry or sitemap line).
    // Remove the flag, set `date` to the release day, then deploy to publish it.
    draft: z.boolean().default(false),
    // Cover picture on the blog cards (drawn by src/components/blog/PostCover.astro). Leave it out for a text-only card.
    cover: z.enum(["checklist", "booking", "belts", "saas"]).optional(),
    // Series the post belongs to (a key of `seriesInfo` in src/data/blog.ts) and its place in it.
    series: z.string().regex(/^[a-z0-9-]*$/).default(""),
    seriesOrder: z.number().int().positive().optional(),
    // "Ressources" cards at the end of the article. `download` links get a download button, `external` links open in a
    // new tab. Leave the list out when the article has no extra resources.
    resources: z
      .array(
        z.object({
          kind: z.enum(["case-study", "guide", "download", "external"]),
          title: z.string(),
          href: z.string(),
          meta: z.string().default(""),
        }),
      )
      .default([]),
    erpId: z.string().optional(),
    erpRevision: z.string().regex(/^[a-f0-9]{64}$/).optional(),
    tags: z.array(z.string()).default([]),
  }),
});

const caseStudySchema = z.object({
  title: z.string(),
  category: z.string(),
  description: z.string(),
  result: z.string(),
  metric: z.string(),
  gradient: z.string(),
  externalUrl: z.string().optional(),
  stack: z.array(z.string()).default([]),
  date: z.coerce.date(),
});

const caseStudies = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/case-studies" }),
  schema: caseStudySchema,
});

// The French version of each case study: same file name (the slug) and the same fields as the English one.
const caseStudiesFr = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/case-studies-fr" }),
  schema: caseStudySchema,
});

export const collections = { blog, "case-studies": caseStudies, "case-studies-fr": caseStudiesFr };
