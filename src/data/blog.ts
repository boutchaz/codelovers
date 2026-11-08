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
