import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'

import { readInviteCode } from '../src/lib/invite-code.mjs'

test('reads an invite code from the query string', () => {
  assert.equal(readInviteCode('?code=TEST123'), 'TEST123')
})

test('decodes and trims an invite code', () => {
  assert.equal(readInviteCode('?code=%20KMD-ABC%20123%20'), 'KMD-ABC 123')
})

test('returns an empty string when the code is absent or empty', () => {
  assert.equal(readInviteCode(''), '')
  assert.equal(readInviteCode('?source=friend'), '')
  assert.equal(readInviteCode('?code='), '')
})

test('invite page exposes copy, fallback, guidance, and the verified download', async () => {
  const page = await readFile(new URL('../src/pages/invite.astro', import.meta.url), 'utf8')

  assert.match(page, /readInviteCode/)
  assert.match(page, /navigator\.clipboard\.writeText/)
  assert.match(page, /document\.execCommand\(['"]copy['"]\)/)
  assert.match(page, /aria-live=["']polite["']/)
  assert.match(page, /复制邀请码/)
  assert.match(page, /下载 App/)
  assert.match(page, /打开 App/)
  assert.match(page, /没有邀请码/)
  assert.match(
    page,
    /https:\/\/api\.kimidance\.com\/downloads\/Kimidance-Test-Mac-0\.2\.3\.0\.dmg/,
  )
})
