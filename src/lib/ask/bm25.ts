/**
 * Okapi BM25 over the site's own content.
 *
 * WHY BM25 AND NOT EMBEDDINGS
 * Embeddings would need either a model in the bundle (tens of MB, for ~60
 * documents) or an API call, and an API call from a static site means shipping
 * a key in the bundle. BM25 is a few hundred lines of arithmetic, runs in under
 * a millisecond on a corpus this size, works offline, and — crucially — is
 * measurable. `npm run eval:retrieval` scores it against a golden set and CI
 * fails if it regresses.
 *
 * The lexical weakness of BM25 is vocabulary mismatch: a visitor typing "LLM"
 * gets nothing from a document that only says "language model". That is what
 * ALIASES below exists to patch, and it is applied to documents and queries
 * alike so the two always meet in the same vocabulary.
 */

export interface IndexEntry {
  id: string
  /** Weighted higher than body text — a title match is a much stronger signal. */
  title: string
  text: string
}

export interface Hit {
  id: string
  score: number
}

interface Posting {
  id: string
  len: number
  tf: Map<string, number>
}

export interface Index {
  postings: Posting[]
  df: Map<string, number>
  avgLen: number
}

const K1 = 1.5
const B = 0.75
/** A title term counts this many times. Chosen by the eval set, not by taste. */
const TITLE_BOOST = 3

// Short, closed-class words carry no discriminating power on a corpus where
// every document is about the same person. Kept deliberately small: aggressive
// stoplists remove real query terms ("no code", "in production").
const STOPWORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'been', 'but', 'by', 'can', 'did',
  'do', 'does', 'for', 'from', 'had', 'has', 'have', 'he', 'her', 'his', 'how',
  'i', 'in', 'is', 'it', 'its', 'me', 'my', 'of', 'on', 'or', 'that', 'the',
  'their', 'them', 'they', 'this', 'to', 'was', 'were', 'what', 'when', 'which',
  'who', 'will', 'with', 'you', 'your',
])

/**
 * Token -> extra tokens emitted alongside it. Expansion is additive and runs on
 * both sides, so "rag" and "retrieval augmented generation" score identically
 * whichever the visitor types and whichever the document happens to use.
 */
const ALIASES: Record<string, string[]> = {
  rag: ['retrieval', 'augmented', 'generation', 'grounded'],
  llm: ['language', 'model', 'generative'],
  llms: ['language', 'model', 'generative'],
  genai: ['generative', 'ai'],
  gpt: ['language', 'model', 'openai'],
  ml: ['machine', 'learning'],
  ai: ['artificial', 'intelligence'],
  nlp: ['natural', 'language'],
  agentic: ['agent', 'orchestration'],
  agents: ['agent', 'orchestration'],
  multiagent: ['agent', 'orchestration'],
  embeddings: ['vector', 'dense', 'semantic'],
  embedding: ['vector', 'dense', 'semantic'],
  vectordb: ['vector', 'database'],
  quant: ['quantitative', 'finance', 'trading'],
  finance: ['financial', 'quantitative'],
  trading: ['signal', 'alpha', 'market'],
  backtest: ['walk', 'forward', 'validation'],
  devops: ['infrastructure', 'platform', 'deployment'],
  cloud: ['aws', 'azure', 'gcp', 'infrastructure'],
  k8s: ['kubernetes', 'container'],
  job: ['role', 'work', 'experience', 'employment'],
  jobs: ['role', 'work', 'experience', 'employment'],
  works: ['work', 'role'],
  worked: ['work', 'role'],
  study: ['education', 'degree', 'university'],
  studied: ['education', 'degree', 'university'],
  studies: ['education', 'degree', 'university'],
  school: ['education', 'university'],
  uni: ['university', 'education'],
  masters: ['msc', 'degree', 'education'],
  msc: ['masters', 'degree', 'education'],
  phd: ['doctorate', 'research'],
  hire: ['contact', 'available', 'email'],
  hiring: ['contact', 'available', 'email'],
  email: ['contact', 'reach'],
  contact: ['email', 'reach'],
  resume: ['cv', 'contact'],
  cv: ['resume', 'contact'],
  cert: ['certification', 'certified'],
  certs: ['certification', 'certified'],
  certified: ['certification'],
  paper: ['research', 'publication'],
  eval: ['evaluation', 'measure', 'benchmark'],
  evals: ['evaluation', 'measure', 'benchmark'],
}

/**
 * Crude suffix stripping. A real stemmer (Porter) is ~200 lines for a gain that
 * did not show up on the eval set at this corpus size, so this handles the
 * plural/gerund cases that actually occurred and stops there.
 */
function normalise(token: string): string {
  if (token.length > 4 && token.endsWith('ies')) return `${token.slice(0, -3)}y`
  if (token.length > 4 && token.endsWith('ing')) return token.slice(0, -3)
  if (token.length > 4 && token.endsWith('ed')) return token.slice(0, -2)
  if (token.length > 3 && token.endsWith('es')) return token.slice(0, -2)
  if (token.length > 3 && token.endsWith('s')) return token.slice(0, -1)
  return token
}

export function tokenize(input: string): string[] {
  const raw = input
    .toLowerCase()
    // Keep alphanumerics only. Hyphens and slashes become boundaries so
    // "multi-agent" and "long/short" index as their parts.
    .replace(/[^a-z0-9]+/g, ' ')
    .split(' ')
    .filter(Boolean)

  const out: string[] = []
  for (const token of raw) {
    if (STOPWORDS.has(token)) continue
    const alias = ALIASES[token]
    if (alias) out.push(...alias.map(normalise))
    out.push(normalise(token))
  }
  return out
}

export function buildIndex(entries: IndexEntry[]): Index {
  const postings: Posting[] = []
  const df = new Map<string, number>()
  let total = 0

  for (const entry of entries) {
    const tokens = [
      ...Array.from({ length: TITLE_BOOST }, () => tokenize(entry.title)).flat(),
      ...tokenize(entry.text),
    ]
    const tf = new Map<string, number>()
    for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1)
    for (const t of tf.keys()) df.set(t, (df.get(t) ?? 0) + 1)
    postings.push({ id: entry.id, len: tokens.length, tf })
    total += tokens.length
  }

  return { postings, df, avgLen: total / Math.max(postings.length, 1) }
}

export function search(index: Index, query: string, limit = 5): Hit[] {
  const terms = tokenize(query)
  if (terms.length === 0) return []

  const N = index.postings.length
  const hits: Hit[] = []

  for (const doc of index.postings) {
    let score = 0
    for (const term of terms) {
      const f = doc.tf.get(term)
      if (!f) continue
      const n = index.df.get(term) ?? 0
      // Standard BM25 IDF with the +1 that keeps it non-negative for terms
      // appearing in more than half the corpus — without it, common terms like
      // "agent" would actively subtract from the score.
      const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5))
      score += idf * ((f * (K1 + 1)) / (f + K1 * (1 - B + B * (doc.len / index.avgLen))))
    }
    if (score > 0) hits.push({ id: doc.id, score })
  }

  return hits.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id)).slice(0, limit)
}
