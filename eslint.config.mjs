// @ts-check
import react from '@eslint-react/eslint-plugin'
import pluginJs from '@eslint/js'
import * as tsParser from '@typescript-eslint/parser'
import eslintPluginAstro from 'eslint-plugin-astro'
import reactHooks from 'eslint-plugin-react-hooks'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig(
  {
    ignores: [
      'node_modules',
      'dist',
      '.astro',
      'public',
      '.prettierrc.mjs',
      'src/components/ui',
      '.vercel',
    ],
  },
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...eslintPluginAstro.configs['flat/recommended'],
  tseslint.configs.eslintRecommended,
  reactHooks.configs.flat.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    ...react.configs.recommended,
    languageOptions: {
      parser: tsParser,
    },
  },
  {
    rules: {
      '@typescript-eslint/triple-slash-reference': 'off',
      'no-unused-vars': 'off',
    },
  },
)
