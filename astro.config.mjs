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
  // 2026-07-08 首批案例曾以哈希 slug 上线并推送过 IndexNow；
  // 改拼音 slug 后为历史 URL 保留 meta-refresh 跳转（静态站没有 301）。
  // 其中两部（西游散伙人/婚姻正义联盟）因源数据问题下架，回落到案例库首页。
  redirects: {
    '/cases/case-e5e1aa7a/': '/cases/da-ming-li-jing-long-de-bie-yang-ren-sheng/',
    '/cases/case-08276dd5/': '/cases/fan-ren-bai-shi-shu/',
    '/cases/case-45659879/': '/cases/mo-shi-cong-ban-kong-quan-qiu-cang-ku-kai-shi-di-yi-ji/',
    '/cases/case-38c71eb6/': '/cases/ri-xin-yi-wan-wo-zai-bo-wu-guan-zhi-ye-ban/',
    '/cases/case-9ce183d2/': '/cases/shi-guang-he-ni-dou-hen-mei/',
    '/cases/case-9980efbd/': '/cases/ying-he-bao-zi-pu/',
    '/cases/case-79ffb035/': '/cases/',
    '/cases/case-11f71928/': '/cases/',
  },
  integrations: [
    react(),
    sitemap({
      filter: (page) =>
        (hasPublishedCases || !page.endsWith('/cases/')) &&
        // 历史哈希 slug 的跳转页不进 sitemap
        !/\/cases\/case-[0-9a-f]{8}\/$/.test(page),
    }),
  ],
})
