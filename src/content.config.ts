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
    erpId: z.string().optional(),
    erpRevision: z.string().regex(/^[a-f0-9]{64}$/).optional(),
    tags: z.array(z.string()).default([]),
  }),
});

const caseStudies = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/case-studies" }),
  schema: z.object({
    title: z.string(),
    category: z.string(),
    description: z.string(),
    result: z.string(),
    metric: z.string(),
    gradient: z.string(),
    externalUrl: z.string().optional(),
    stack: z.array(z.string()).default([]),
    date: z.coerce.date(),
  }),
});

export const collections = { blog, "case-studies": caseStudies };
