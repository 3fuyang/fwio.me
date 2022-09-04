// Splitted from vite.config.ts, only to make the VSCode extension for UnoCSS work.
import { defineConfig } from 'unocss'
import { presetUno, presetAttributify } from 'unocss'
import transformerVariantGroup from '@unocss/transformer-variant-group'

export default defineConfig({
  shortcuts: {
    'link': 'op70 hover:op100 transition-opacity duration-200'
  },
  presets: [
    presetUno(),
    presetAttributify()
  ],
  transformers: [
    transformerVariantGroup()
  ]
})