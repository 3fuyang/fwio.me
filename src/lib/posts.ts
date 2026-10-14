import { getCollection, type CollectionEntry } from 'astro:content'

export type PostCollection = 'blog' | 'notes' | 'essay'

export type Post<C extends PostCollection = PostCollection> = CollectionEntry<C>

export interface PostListItem {
  id: string
  url: string
  title: string
  date: string
  datetime: string
  year: string
  tags: string[]
}

// Dates are formatted at build time in a fixed zone so islands hydrate with identical text.
const TIME_ZONE = 'Asia/Shanghai'

export async function getPublishedPosts<C extends PostCollection>(
  collection: C,
): Promise<Post<C>[]> {
  const posts = await getCollection(collection, ({ data }) =>
    import.meta.env.PROD ? !data.draft : true,
  )

  return posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  )
}

export function getPostUrl(post: Post) {
  return `/${post.collection}/${post.id}`
}

export function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', { timeZone: TIME_ZONE })
}

export function toPostListItem(post: Post, tags: string[] = []): PostListItem {
  const { title, pubDate } = post.data

  return {
    id: post.id,
    url: getPostUrl(post),
    title,
    date: formatDate(pubDate),
    datetime: pubDate.toISOString(),
    year: pubDate.toLocaleDateString('en-US', {
      timeZone: TIME_ZONE,
      year: 'numeric',
    }),
    tags,
  }
}
