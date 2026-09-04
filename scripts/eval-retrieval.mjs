/**
 * Retrieval evaluation for the Ask panel.
 *
 * A search box that has never been measured is a search box that quietly stops
 * working. This scores the retriever against a hand-written golden set and
 * exits non-zero if it regresses, so the deploy fails rather than shipping a
 * feature that returns the wrong project for "what RAG work has he done".
 *
 * The queries are written as a visitor would type them — lowercase, terse,
 * sometimes an acronym — not as the documents phrase themselves. That mismatch
 * is the entire point: a golden set built by paraphrasing your own content
 * measures nothing.
 *
 * Run:  npm run eval:retrieval
 */
import { ask } from '../src/lib/ask/index.ts'

/** query -> the document a reasonable person expects at or near the top. */
const GOLDEN = [
  // Projects, by concept rather than name.
  ['hybrid search evaluation', 'project:scintilla'],
  ['does he measure retrieval quality', 'project:scintilla'],
  ['bm25 vs dense retrieval', 'project:scintilla'],
  ['multi agent orchestration in production', 'project:multi-agent-operations'],
  ['google adk', 'project:multi-agent-operations'],
  ['mcp tool layer', 'project:multi-agent-operations'],
  ['autonomous incident management', 'project:nightwatch-ai'],
  ['langgraph incident triage servicenow', 'project:nightwatch-ai'],
  ['trading signal alpha research', 'project:alphaflow'],
  ['multiple testing correction', 'project:alphaflow'],
  ['electricity price forecasting', 'project:entsoe-power-forecasting'],
  ['energy market model', 'project:entsoe-power-forecasting'],
  ['data quality agent dbt', 'project:data-quality-agent'],
  ['credit default prediction', 'project:credit-risk-scoring'],
  ['healthcare clinical decision support', 'project:rmd-health'],
  ['fhir', 'project:rmd-health'],
  ['self healing infrastructure', 'project:self-healing-infrastructure'],
  ['aws landing zone', 'project:aws-landing-zone-agent'],
  ['language learning app', 'project:french-on-the-fly'],
  ['firebase marketplace', 'project:vault-q'],

  // Projects, by name.
  ['scintilla', 'project:scintilla'],
  ['alphaflow', 'project:alphaflow'],

  // Experience.
  ['what did he do at kyndryl', 'role:kyndryl'],
  ['current job', 'role:kyndryl'],
  ['internship in london', 'role:zero2ai'],
  ['ott streaming broadcast', 'role:evertz'],

  // Education and credentials.
  ['financial engineering degree', 'education:wqu-mfe'],
  ['queen mary university', 'education:qmul-msc-ai'],
  ['commonwealth scholarship', 'education:qmul-msc-ai'],
  ['undergraduate degree', 'education:reva-btech'],
  ['aws certifications', 'certifications:all'],

  // Skills.
  ['what cloud platforms does he know', 'skills:cloud-platform'],
  ['visualisation tools', 'skills:bi-visualisation'],

  // Contact.
  ['how do i contact him', 'contact:email'],
  ['is he available for hire', 'contact:email'],
  ['github profile', 'contact:github'],
]

/**
 * Recall@3 below this fails the build. Currently 100%, gated at 95% so that a
 * single unlucky content edit is a warning rather than a broken deploy — but
 * two are not tolerated.
 */
const THRESHOLD = 0.95

let hit1 = 0
let hit3 = 0
let reciprocalTotal = 0
const failures = []

for (const [query, expected] of GOLDEN) {
  const results = ask(query, 5)
  const rank = results.findIndex((r) => r.doc.id === expected) + 1 // 0 = absent

  if (rank === 1) hit1 += 1
  if (rank >= 1 && rank <= 3) hit3 += 1
  if (rank >= 1) reciprocalTotal += 1 / rank
  if (rank < 1 || rank > 3) {
    failures.push({ query, expected, got: results.slice(0, 3).map((r) => r.doc.id) })
  }
}

const n = GOLDEN.length
const recall1 = hit1 / n
const recall3 = hit3 / n
const mrr = reciprocalTotal / n
const pct = (x) => `${(x * 100).toFixed(1)}%`

console.log(`\nretrieval eval — ${n} golden queries\n`)
console.log(`  recall@1   ${pct(recall1)}`)
console.log(`  recall@3   ${pct(recall3)}`)
console.log(`  MRR        ${mrr.toFixed(3)}`)

if (failures.length > 0) {
  console.log(`\n  ${failures.length} quer${failures.length === 1 ? 'y' : 'ies'} outside the top 3:`)
  for (const f of failures) {
    console.log(`    "${f.query}"`)
    console.log(`      want: ${f.expected}`)
    console.log(`      got:  ${f.got.join(', ') || '(nothing)'}`)
  }
}

if (recall3 < THRESHOLD) {
  console.error(`\nFAIL — recall@3 ${pct(recall3)} is below the ${pct(THRESHOLD)} threshold.`)
  console.error('Either the retriever regressed, or the content moved out from under the golden set.')
  process.exit(1)
}

console.log(`\npass — recall@3 ${pct(recall3)} meets the ${pct(THRESHOLD)} threshold.\n`)
