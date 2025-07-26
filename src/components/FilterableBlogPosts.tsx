import { useState } from 'react'
import { flushSync } from 'react-dom'

import BlogFilter from './BlogFilter'

interface Post {
  slug: string
  data: {
    title: string
    pubDate: Date
    lang?: 'en' | 'zh'
  }
}

interface FilterableBlogPostsProps {
  posts: Post[]
}

export default function FilterableBlogPosts({
  posts,
}: FilterableBlogPostsProps) {
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(posts)

  const postsByYear = groupPostsByYear(filteredPosts)

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-6">
        <BlogFilter
          onFilterChange={(filter) => {
            // eslint-disable-next-line @eslint-react/dom/no-flush-sync
            flushSync(() => {
              const filteredPosts = posts.filter((post) => {
                switch (filter) {
                  case 'all':
                    return true
                  case 'en':
                    return post.data.lang === 'en'
                  case 'zh':
                    return post.data.lang === 'zh'
                  default:
                    return true
                }
              })

              if (document.startViewTransition) {
                document.startViewTransition(() => {
                  setFilteredPosts(filteredPosts)
                })
              } else {
                setFilteredPosts(filteredPosts)
              }
            })
          }}
        />
      </div>

      {postsByYear.map(({ year, posts }) => (
        <section key={year} className="relative py-4">
          <h2 className="year-marker pointer-events-none absolute top-0 left-0 text-4xl text-transparent opacity-50 select-none">
            {year}
          </h2>
          <div className="space-y-6">
            {posts.map(({ slug, data: { title, pubDate } }) => {
              const dateTime = new Date(pubDate).toLocaleDateString('en-US')
              const postId = '_' + slug.split('/').at(-1)

              return (
                <article
                  key={slug}
                  id={postId}
                  style={{ viewTransitionName: postId }}
                >
                  <a
                    href={slug}
                    className="ml-2 block rounded-sm px-1 text-foreground/90 hover:text-foreground focus-visible:text-foreground transition-colors group"
                  >
                    <h3
                      title={title}
                      className="truncate text-base tracking-wide underline-offset-4 group-hover:underline group-focus-visible:underline"
                    >
                      {title}
                    </h3>
                    <time
                      className="text-foreground/60 text-xs sm:text-sm"
                      dateTime={dateTime}
                    >
                      {dateTime}
                    </time>
                  </a>
                </article>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}

function groupPostsByYear(posts: Post[]) {
  const postsOfYearMap: Record<number, Post[]> = {}

  for (const post of posts) {
    const year = post.data.pubDate.getFullYear()

    if (!year) continue

    if (!postsOfYearMap[year]) {
      postsOfYearMap[year] = []
    }

    postsOfYearMap[year].push(post)
  }

  const postsOfYearEntries = Object.entries(postsOfYearMap).sort(
    (a, b) => Number(b[0]) - Number(a[0]),
  )

  const result = postsOfYearEntries.map(([year, posts]) => ({ year, posts }))

  return result
}