import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'

// GitHub Pages serves this repo's /docs directory at https://kimidance.com
export default defineConfig({
  site: 'https://kimidance.com',
  outDir: './docs',
  integrations: [react(), sitemap()],
})
