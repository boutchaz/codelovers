import { getCollection, type CollectionEntry } from "astro:content";

type Post = CollectionEntry<"blog">;

// Drafts are left out of the build, so a draft gets no page, no feed entry and no sitemap line. `astro dev` still
// includes them, so a draft can be previewed before it is released.
export async function getPosts(): Promise<Post[]> {
  return getCollection("blog", ({ data }) => import.meta.env.DEV || !data.draft);
}

// The posts offered to readers: published, and not unlisted (unlisted posts keep their URL but are not promoted).
export async function getListedPosts(): Promise<Post[]> {
  return (await getPosts()).filter(({ data }) => !data.unlisted);
}

// Series shown on the blog index. A post joins one with `series: "<key>"` and `seriesOrder` in its frontmatter.
export const seriesInfo: Record<string, { title: string; description: string }> = {
  "gym-owners": {
    title: "Guides pour les gérants de salle",
    description:
      "Réservations, présence, progression des élèves et données des membres : des conseils concrets pour faire tourner une salle de sport ou d’arts martiaux, sans jargon.",
  },
};

// The published posts of each series, in reading order. A series with fewer than two published posts is left out,
// so it appears once its second guide is released.
export function getSeries(posts: Post[]) {
  return Object.entries(seriesInfo)
    .map(([key, info]) => ({
      key,
      ...info,
      posts: posts
        .filter((post) => post.data.series === key)
        .sort(
          (a, b) =>
            (a.data.seriesOrder ?? Number.MAX_SAFE_INTEGER) - (b.data.seriesOrder ?? Number.MAX_SAFE_INTEGER) ||
            a.data.date.getTime() - b.data.date.getTime(),
        ),
    }))
    .filter((series) => series.posts.length >= 2);
}
