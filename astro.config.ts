import { rehypeHeadingIds } from '@astrojs/markdown-remark'
import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import vercel from '@astrojs/vercel'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeExternalLinks from 'rehype-external-links'
import { visualizer } from 'rollup-plugin-visualizer'
import { remarkReadingTime } from './src/lib/remark-reading-time'

const isProd = import.meta.env.PROD

const enabledAnalyze = process.env.ANALYZE

const SITE = 'https://www.fwio.me'

// https://astro.build/config
export default defineConfig({
  prefetch: {
    prefetchAll: false
  },
  site: SITE,
  vite: {
    plugins: [
      tailwindcss(),
      !!enabledAnalyze &&
        visualizer({
          emitFile: true,
          filename: 'stats.html',
        }),
    ],
  },
  markdown: {
    shikiConfig: {
      theme: 'nord',
    },
    remarkPlugins: [remarkReadingTime],
    rehypePlugins: [
      rehypeHeadingIds,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'wrap',
          properties: {
            className: 'prose-heading-anchor',
          },
        },
      ],
      [
        rehypeExternalLinks,
        {
          target: '_blank',
          rel: ['nofollow', 'noopener', 'noreferrer'],
        },
      ],
    ],
  },
  integrations: [react(), mdx()],
  output: 'static',
  adapter: vercel({
    webAnalytics: {
      enabled: isProd,
    },
  }),
})
