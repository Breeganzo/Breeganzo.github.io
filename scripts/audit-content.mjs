#!/usr/bin/env node
/**
 * Release gate. Fails if withheld or confidential content reaches the build.
 *
 * Scans dist/ (or src/ when dist/ is absent) plus any PDF in public/.
 * Run after `npm run build`:  npm run audit:content
 */
import { execFileSync } from 'node:child_process'
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs'
import { join, extname } from 'node:path'

// Substring matches, case-insensitive. Grouped so failures explain themselves.
const FORBIDDEN = [
  // Withheld at Anthony's instruction — the two Elastic ML bullets.
  { term: '105M', why: 'excluded Elastic ML bullet' },
  { term: 'per-API-endpoint', why: 'excluded Elastic ML bullet' },
  { term: '28-panel', why: 'excluded Elastic ML bullet' },
  { term: 'seven data-quality', why: 'excluded Elastic ML bullet' },
  { term: '91 independent', why: 'excluded Elastic ML bullet' },
  { term: 'Elastic ML', why: 'excluded project' },

  // Client identity — hospitality engagement.
  { term: 'Rubik', why: 'internal platform name, appears nowhere public' },
  { term: 'Frasers', why: 'client name' },
  { term: 'Digikey', why: 'other client name' },
  { term: 'serviced apartment', why: 'identifying client descriptor' },
  { term: '20 countries', why: 'identifying client descriptor' },

  // Unverified protocol claims.
  { term: 'Agent2Agent', why: 'A2A is unverified' },
  { term: 'agent card', why: 'A2A is unverified' },
  { term: 'RemoteA2aAgent', why: 'A2A is unverified' },
  { term: 'well-known/agent.json', why: 'A2A is unverified' },

  // Off-limits capabilities on the hospitality engagement.
  { term: 'profit optimisation', why: 'off-limits capability' },
  { term: 'profit optimization', why: 'off-limits capability' },
  { term: 'asset management', why: 'off-limits capability' },
  { term: 'investment-insight', why: 'off-limits capability' },

  // Superseded positioning from the old site.
  { term: 'Platform Engineer', why: 'outdated title' },
  { term: 'parkconnect', why: 'retired domain' },
]

/** "A2A" needs word-boundary matching — it collides with nothing useful but is short. */
const FORBIDDEN_REGEX = [
  { re: /\bA2A\b/i, label: 'A2A', why: 'A2A is unverified' },
]

/**
 * Documented exceptions. These phrases are removed from the text before
 * scanning, so an unrelated legitimate use does not trip a rule.
 *
 * Each entry needs a reason. Do not add one to silence a real hit.
 */
const ALLOWED = [
  {
    phrase: 'media asset management',
    why: 'Evertz 2022 internship, OTT broadcast assets. Unrelated to the hospitality client’s off-limits asset-management capability.',
  },
]

const TEXT_EXT = new Set(['.html', '.js', '.css', '.json', '.txt', '.xml', '.ts', '.tsx', '.md'])

function walk(dir, out = []) {
  if (!existsSync(dir)) return out
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === '.git') continue
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else out.push(p)
  }
  return out
}

function pdfText(file) {
  try {
    return execFileSync('pdftotext', ['-layout', file, '-'], { encoding: 'utf8' })
  } catch {
    return null
  }
}

const failures = []
const scanned = []
const target = existsSync('dist') ? 'dist' : 'src'

for (const file of [...walk(target), ...walk('public'), ...(existsSync('index.html') ? ['index.html'] : [])]) {
  const ext = extname(file).toLowerCase()
  let text = null

  if (ext === '.pdf') {
    text = pdfText(file)
    if (text === null) {
      failures.push({ file, term: '(unreadable)', why: 'pdftotext unavailable — cannot verify this PDF. Install poppler or remove the file.' })
      continue
    }
  } else if (TEXT_EXT.has(ext)) {
    text = readFileSync(file, 'utf8')
  } else {
    continue
  }

  scanned.push(file)

  // Strip documented exceptions before scanning.
  let cleaned = text
  for (const { phrase } of ALLOWED) {
    cleaned = cleaned.replaceAll(new RegExp(phrase, 'gi'), ' ')
  }
  const lower = cleaned.toLowerCase()

  for (const { term, why } of FORBIDDEN) {
    if (lower.includes(term.toLowerCase())) failures.push({ file, term, why })
  }
  for (const { re, label, why } of FORBIDDEN_REGEX) {
    if (re.test(cleaned)) failures.push({ file, term: label, why })
  }
}

console.log(`content audit — scanned ${scanned.length} file(s) under ${target}/, public/`)

if (failures.length) {
  console.error(`\n${failures.length} violation(s):\n`)
  for (const f of failures) {
    console.error(`  ${f.file}`)
    console.error(`    "${f.term}" — ${f.why}\n`)
  }
  process.exit(1)
}

console.log('clean — no withheld or confidential content found')
