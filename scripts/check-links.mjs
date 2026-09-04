#!/usr/bin/env node
/**
 * Verifies every external URL in the content layer resolves.
 *
 * The important case this catches: a repo link that is still private, which
 * returns 404 to anyone who is not signed in as the owner.
 *
 * Run:  npm run checklinks
 */
import { readFileSync } from 'node:fs'

const files = ['src/content/projects.ts', 'src/content/profile.ts']
const urls = new Set()

for (const f of files) {
  const src = readFileSync(f, 'utf8')
  for (const m of src.matchAll(/https?:\/\/[^\s'"`,)]+/g)) urls.add(m[0])
}

const results = await Promise.all(
  [...urls].sort().map(async (url) => {
    try {
      // GitHub returns 404 for private repos to unauthenticated clients, which
      // is exactly the signal we want — so do NOT send a token here.
      const res = await fetch(url, { redirect: 'follow', headers: { 'User-Agent': 'link-check' } })
      // LinkedIn answers automated clients with 999, and 429 once it has seen a
      // few. Both are anti-bot responses, not broken links. Treating 429 as a
      // failure would make this gate flaky and eventually train us to ignore
      // it — which defeats the point of gating the deploy on it at all.
      const antiBot = res.status === 999 || res.status === 429
      const ok = res.ok || (antiBot && url.includes('linkedin.com'))
      return { url, status: res.status, ok }
    } catch (err) {
      return { url, status: 0, ok: false, err: err.message }
    }
  }),
)

let bad = 0
for (const r of results) {
  if (r.ok) {
    console.log(`  ${String(r.status).padEnd(3)}  ${r.url}`)
  } else {
    bad++
    console.error(`  ${String(r.status || 'ERR').padEnd(3)}  ${r.url}${r.err ? `  (${r.err})` : ''}`)
  }
}

console.log(`\n${results.length} link(s) checked, ${bad} failing`)
if (bad) {
  console.error('\nA 404 on a github.com/Breeganzo/... URL almost certainly means that repo is still private.')
  process.exit(1)
}
