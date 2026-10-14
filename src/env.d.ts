/// <reference types="astro/client" />

interface Window {
  /** Defined by the inline theme script in `BaseLayout.astro`. */
  applyTheme?: (preference: 'light' | 'dark' | 'system') => void
}
