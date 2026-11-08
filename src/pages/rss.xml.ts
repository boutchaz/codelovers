import rss from '@astrojs/rss';
import { getListedPosts } from '@/data/blog';
import { SITE_URL } from '@/data/constants';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  // Drafts and unlisted posts are not announced in the feed.
  const blog = await getListedPosts();

  const sortedPosts = blog.sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );

  return rss({
    title: 'CodeLovers Blog',
    description: 'Guides pratiques pour les gérants de salles de sport et d’arts martiaux au Maroc, par CodeLovers.',
    site: context.site ?? SITE_URL,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      author: post.data.author,
      link: `/blog/${post.id}/`,
      categories: post.data.tags,
    })),
    customData: `<language>fr</language>`,
  });
}
