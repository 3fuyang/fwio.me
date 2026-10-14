import { rssSchema } from '@astrojs/rss'
import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const postSchema = rssSchema
  .extend({
    title: z.string(),
    keywords: z.array(z.string()).optional(),
    description: z.string().optional(),
    lang: z.enum(['zh', 'en']).optional(),
    draft: z.boolean().optional(),
  })
  .required({
    pubDate: true,
  })

function postsIn(dir: string) {
  return glob({ pattern: '**/*.{md,mdx}', base: `./src/content/${dir}` })
}

const blogCollection = defineCollection({
  loader: postsIn('blog'),
  schema: postSchema,
})
const notesCollection = defineCollection({
  loader: postsIn('notes'),
  schema: postSchema.extend({
    category: z.enum(['reading', 'regular']).default('regular'),
  }),
})
const essayCollection = defineCollection({
  loader: postsIn('essay'),
  schema: postSchema,
})

export const collections = {
  blog: blogCollection,
  notes: notesCollection,
  essay: essayCollection,
}
