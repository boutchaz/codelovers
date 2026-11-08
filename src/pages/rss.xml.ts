import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_URL } from '@/data/constants';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  // Unlisted posts keep their URL but are not announced in the feed.
  const blog = (await getCollection('blog')).filter((post) => !post.data.unlisted);

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
