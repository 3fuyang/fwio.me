import { getPostUrl, getPublishedPosts } from '@/lib/posts'
import rss from '@astrojs/rss'
import type { APIContext } from 'astro'

export async function GET(context: APIContext) {
  const posts = (
    await Promise.all([
      getPublishedPosts('blog'),
      getPublishedPosts('notes'),
      getPublishedPosts('essay'),
    ])
  ).flat()

  return rss({
    title: 'Blog | Fwio',
    description: 'UN JOUR JE SERAI DE RETOUR PRÈS DE TOI',
    site: context.site!,
    items: posts
      .map((post) => ({ ...post.data, link: getPostUrl(post) }))
      .sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf()),
  })
}
