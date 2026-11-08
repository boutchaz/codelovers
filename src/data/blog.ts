import { getCollection, type CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"blog">;

// Drafts are left out of the build, so a draft gets no page, no feed entry and no sitemap line. `astro dev` still
// includes them, so a draft can be previewed before it is released.
export async function getPosts(): Promise<Post[]> {
  return getCollection("blog", ({ data }) => import.meta.env.DEV || !data.draft);
}

// The posts offered to readers: published, and not unlisted (unlisted posts keep their URL but are not promoted).
export async function getListedPosts(): Promise<Post[]> {
  return (await getPosts()).filter(({ data }) => !data.unlisted);
}

// "Salles de sport" -> "salles-de-sport": the key used for a topic in the blog index filters and links.
export const slugify = (label: string) =>
  label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// Minutes to read a post, at about 200 words a minute, never less than one.
export function readingTime(body = ""): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

// Series shown on the blog index and on each article of the series. A post joins one with `series: "<key>"` and
// `seriesOrder` in its frontmatter. `total` is the planned number of guides, so "2 / 3" stays true while the later
// guides are still drafts.
export const seriesInfo: Record<string, { title: string; description: string; total: number }> = {
  "gym-owners": {
    title: "Guides pour les gérants de salle",
    description:
      "Réservations, présence, progression des élèves et données des membres : des conseils concrets pour faire tourner une salle de sport ou d’arts martiaux, sans jargon.",
    total: 3,
  },
};

// The published posts of each series, in reading order. A series with fewer than two published posts is left out
// of the blog index, so it appears once its second guide is released.
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

// Where an article sits in its series: its place, the planned total, and the neighbouring guides that are published.
// `nextSoon` is true when a later guide is planned but not released yet. Null for a post outside any series.
export function getSeriesNav(post: Post, published: Post[]) {
  const info = seriesInfo[post.data.series];
  const position = post.data.seriesOrder;
  if (!info || !position) return null;
  const neighbour = (order: number) =>
    published.find((item) => item.data.series === post.data.series && item.data.seriesOrder === order);
  const next = neighbour(position + 1);
  return {
    title: info.title,
    total: info.total,
    position,
    previous: neighbour(position - 1),
    next,
    nextSoon: position < info.total && !next,
  };
}
