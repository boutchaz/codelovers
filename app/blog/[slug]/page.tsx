import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { SiteShell } from "@/app/components/SiteShell";
import { formatPostDate, getAllPosts, getPostBySlug, getPostSlugs } from "@/lib/blog";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post not found" };

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: `${post.title} | CodeLovers Blog`,
      description: post.description,
      url: `https://wearecodelovers.com/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: post.title }],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getAllPosts()
    .filter((item) => item.slug !== post.slug)
    .slice(0, 2);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      "@type": "Organization",
      name: post.author,
      url: "https://wearecodelovers.com/",
    },
    publisher: {
      "@type": "Organization",
      name: "CodeLovers",
      url: "https://wearecodelovers.com/",
      logo: "https://wearecodelovers.com/logo.png",
    },
    mainEntityOfPage: `https://wearecodelovers.com/blog/${post.slug}`,
  };

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <article className="pb-24 pt-32 sm:pt-40">
        <div className="mx-auto max-w-[760px] px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <span aria-hidden="true">←</span> All posts
          </Link>

          <header className="mt-8 space-y-5 border-b border-white/10 pb-10">
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.25em] text-rose-200">
              <time dateTime={post.date}>{formatPostDate(post.date)}</time>
              <span className="text-white/20">·</span>
              <span>{post.author}</span>
            </div>
            <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl">{post.title}</h1>
            <p className="text-lg leading-relaxed text-slate-300">{post.description}</p>
            {post.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-rose-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </header>

          <div className="blog-prose mt-10 space-y-5 text-base leading-relaxed text-slate-300 sm:text-lg">
            <ReactMarkdown
              components={{
                h2: ({ children }) => (
                  <h2 className="mt-10 text-2xl font-semibold text-white">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="mt-8 text-xl font-semibold text-white">{children}</h3>
                ),
                p: ({ children }) => <p className="leading-relaxed text-slate-300">{children}</p>,
                ul: ({ children }) => (
                  <ul className="list-disc space-y-2 pl-5 text-slate-300">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal space-y-2 pl-5 text-slate-300">{children}</ol>
                ),
                li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                strong: ({ children }) => (
                  <strong className="font-semibold text-white">{children}</strong>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    className="font-medium text-rose-300 underline decoration-rose-500/40 underline-offset-4 transition hover:text-rose-200"
                    {...(href?.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {children}
                  </a>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-rose-400/50 pl-4 italic text-slate-400">
                    {children}
                  </blockquote>
                ),
                code: ({ children }) => (
                  <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm text-rose-100">
                    {children}
                  </code>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          <div className="mt-14 rounded-[28px] border border-white/10 bg-gradient-to-r from-rose-600/25 via-red-500/15 to-orange-400/20 p-8 sm:p-10">
            <h2 className="text-2xl font-semibold text-white">Build with CodeLovers</h2>
            <p className="mt-3 text-slate-200">
              Have a product challenge? We will assemble strategy, design, and engineering around
              your outcomes.
            </p>
            <Link
              href="/#contact"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-rose-100"
            >
              Start a project <span aria-hidden="true">→</span>
            </Link>
          </div>

          {related.length > 0 ? (
            <aside className="mt-16 border-t border-white/10 pt-12">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-200">
                More from the studio
              </p>
              <ul className="mt-6 space-y-4">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/blog/${item.slug}`}
                      className="text-lg font-medium text-white transition hover:text-rose-200"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          ) : null}
        </div>
      </article>
    </SiteShell>
  );
}
