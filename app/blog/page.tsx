import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/app/components/SiteShell";
import { SectionBadge } from "@/app/components/ui/SectionBadge";
import { formatPostDate, getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes from CodeLovers on SaaS delivery, IoT systems, stack choices, and product engineering from Morocco.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog | CodeLovers Product Engineering",
    description:
      "Practical writing on SaaS, IoT, and modern web engineering from the CodeLovers studio.",
    url: "https://wearecodelovers.com/blog",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "CodeLovers Blog" }],
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <SiteShell>
      <section className="pb-20 pt-32 sm:pt-40">
        <div className="mx-auto max-w-[900px] px-6 lg:px-8">
          <SectionBadge>Blog</SectionBadge>
          <h1 className="mt-6 text-4xl font-bold text-white sm:text-5xl">
            Notes from the{" "}
            <span className="bg-gradient-to-r from-rose-400 via-red-400 to-orange-300 bg-clip-text text-transparent">
              studio
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
            Practical writing on SaaS delivery, IoT systems, and product engineering — shipped
            statically with this site.
          </p>
        </div>
      </section>

      <section className="border-t border-white/5 pb-28">
        <div className="mx-auto max-w-[900px] space-y-6 px-6 pt-12 lg:px-8">
          {posts.length === 0 ? (
            <p className="text-slate-400">Posts coming soon.</p>
          ) : (
            posts.map((post) => (
              <article
                key={post.slug}
                className="rounded-[28px] border border-white/10 bg-white/[0.03] p-8 transition hover:border-rose-500/30 hover:bg-white/[0.05] sm:p-10"
              >
                <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.25em] text-rose-200">
                  <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                  {post.tags[0] ? (
                    <>
                      <span className="text-white/20">·</span>
                      <span>{post.tags[0]}</span>
                    </>
                  ) : null}
                </div>
                <h2 className="mt-4 text-2xl font-semibold text-white sm:text-3xl">
                  <Link href={`/blog/${post.slug}`} className="transition hover:text-rose-200">
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-3 text-base leading-relaxed text-slate-300">{post.description}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-rose-300 transition hover:text-rose-200"
                >
                  Read article <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))
          )}
        </div>
      </section>
    </SiteShell>
  );
}
