import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import UnoCSS from 'unocss/astro'
import vitesseDark from './src/styles/vitesse-dark.json'

import mdx from '@astrojs/mdx'

// https://astro.build/config
export default defineConfig({
  site: 'https://3fuyang.github.io',
  markdown: {
    shikiConfig: {
      theme: vitesseDark,
    },
  },
  integrations: [
    react(),
    UnoCSS({
      injectReset: true,
    }),
    mdx(),
  ],
  experimental: {
    assets: true,
  },
})
