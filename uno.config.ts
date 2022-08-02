// Splitted from vite.config.ts, only to make the VSCode extension for UnoCSS work.
import { defineConfig } from 'unocss'
import { presetUno, presetAttributify, presetIcons } from 'unocss'
import transformerVariantGroup from '@unocss/transformer-variant-group'

export default defineConfig({
  shortcuts: [],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
        'height': '1.25em',
        'width': '1.25em'
      }
    })
  ],
  transformers: [
    transformerVariantGroup()
  ]
})