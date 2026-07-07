import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import { existsSync, readFileSync } from 'node:fs'

const caseIndexPath = './public/cases/cases.json'
const hasPublishedCases = existsSync(caseIndexPath)
  ? JSON.parse(readFileSync(caseIndexPath, 'utf8')).length > 0
  : false

// GitHub Pages serves this repo's /docs directory at https://kimidance.com
export default defineConfig({
  site: 'https://kimidance.com',
  outDir: './docs',
  integrations: [
    react(),
    sitemap({
      filter: (page) => hasPublishedCases || !page.endsWith('/cases/'),
    }),
  ],
})
