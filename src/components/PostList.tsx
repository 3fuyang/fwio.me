import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { PostListItem } from '@/lib/posts'
import { useState } from 'react'
import { flushSync } from 'react-dom'

export interface PostFilter {
  value: string
  label: string
}

interface PostListProps {
  posts: PostListItem[]
  filters?: PostFilter[]
}

const ALL = 'all'

export default function PostList({ posts, filters }: PostListProps) {
  const [filter, setFilter] = useState(ALL)

  const visiblePosts =
    filter === ALL ? posts : posts.filter(({ tags }) => tags.includes(filter))

  function changeFilter(value: string) {
    if (!document.startViewTransition) {
      setFilter(value)
      return
    }

    document.startViewTransition(() => {
      // eslint-disable-next-line @eslint-react/dom/no-flush-sync
      flushSync(() => setFilter(value))
    })
  }

  return (
    <div className="mx-auto max-w-xl">
      {filters && (
        <div className="mb-6">
          <Tabs value={filter} onValueChange={changeFilter}>
            <TabsList>
              <TabsTrigger value={ALL}>All</TabsTrigger>
              {filters.map(({ value, label }) => (
                <TabsTrigger key={value} value={value}>
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      )}

      {groupPostsByYear(visiblePosts).map(({ year, posts }) => (
        <section key={year} className="relative py-4">
          <h2 className="year-marker pointer-events-none absolute top-0 left-0 text-4xl text-transparent opacity-50 select-none">
            {year}
          </h2>
          <div className="space-y-6">
            {posts.map(({ id, url, title, date, datetime }) => {
              const postId = `_${id}`

              return (
                <article
                  key={url}
                  id={postId}
                  style={{ viewTransitionName: postId }}
                >
                  <a
                    href={url}
                    className="group text-foreground/90 hover:text-foreground focus-visible:text-foreground ml-2 block rounded-sm px-1 transition-colors"
                  >
                    <h3
                      title={title}
                      className="truncate text-base tracking-wide underline-offset-4 group-hover:underline group-focus-visible:underline"
                    >
                      {title}
                    </h3>
                    <time
                      className="text-foreground/60 text-xs sm:text-sm"
                      dateTime={datetime}
                    >
                      {date}
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

function groupPostsByYear(posts: PostListItem[]) {
  const groups = new Map<string, PostListItem[]>()

  for (const post of posts) {
    const group = groups.get(post.year)

    if (group) {
      group.push(post)
    } else {
      groups.set(post.year, [post])
    }
  }

  return [...groups].map(([year, posts]) => ({ year, posts }))
}
