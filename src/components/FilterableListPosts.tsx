import { useState } from 'react'

import NotesFilter from './NotesFilter'

interface Post {
  slug: string
  data: {
    title: string
    pubDate: Date
  }
}

interface FilterableListPostsProps {
  posts: Post[]
}

export default function FilterableListPosts({
  posts,
}: FilterableListPostsProps) {
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(posts)

  const postsByYear = groupPostsByYear(filteredPosts)

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-6">
        <NotesFilter
          onFilterChange={(filter) => {
            setFilteredPosts(
              posts.filter((post) => {
                if (filter === 'all') {
                  return true
                } else if (filter === 'readings') {
                  return isReadingNote(post.slug)
                }
                return !isReadingNote(post.slug)
              }),
            )
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
                <article key={slug} id={postId}>
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

// TODO: use a more robust way to determine if a post is a reading note
function isReadingNote(slug: string): boolean {
  const filename = slug.split('/').pop() || ''
  return /^\d{6}-reading$/.test(filename) || /^20\d{6}-reading$/.test(filename)
}
