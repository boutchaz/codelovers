import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_URL } from '@/data/constants';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const blog = await getCollection('blog');
  
  const sortedPosts = blog.sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );

  return rss({
    title: 'CodeLovers Blog',
    description: 'Engineering insights, SaaS lessons, and technical deep-dives from CodeLovers — a Morocco-based product engineering studio.',
    site: context.site ?? SITE_URL,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      author: post.data.author,
      link: `/blog/${post.id}`,
      categories: post.data.tags,
    })),
    customData: `<language>en-us</language>`,
  });
}
