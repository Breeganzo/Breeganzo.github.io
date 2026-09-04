import { buildIndex, search } from './bm25.ts'
import { docById, docs, type Doc, type DocKind } from './corpus.ts'

/**
 * Public entry point for the Ask panel and for `npm run eval:retrieval`.
 *
 * The index is built once at module load. On this corpus that is roughly a
 * millisecond, which is cheaper than the machinery required to defer it.
 */
const index = buildIndex(docs.map((d) => ({ id: d.id, title: d.title, text: d.text })))

export interface Answer {
  doc: Doc
  score: number
}

/**
 * Scores below this are matches on a single incidental term and read as
 * nonsense to a visitor. Returning nothing is a better answer than returning
 * something irrelevant with a confident-looking layout around it.
 */
const MIN_SCORE = 1.2

/**
 * Document priors, applied after BM25.
 *
 * Skill groups are short lists of keywords, so BM25's length normalisation
 * makes them punch far above their usefulness — "rag pipeline" was returning
 * the GenAI skills chip above Scintilla, which is a worse answer to the
 * question actually being asked. Someone typing a question wants the work;
 * the skills list is the thing they read after deciding to care.
 */
const PRIORS: Record<DocKind, number> = {
  project: 1,
  role: 1,
  education: 0.95,
  contact: 0.95,
  certifications: 0.9,
  skills: 0.7,
}

export function ask(query: string, limit = 5): Answer[] {
  // Over-fetch, then re-rank by prior. Applying the prior to an already-trimmed
  // list would let a strong result fall off the end before it could be promoted.
  return search(index, query, limit * 3)
    .map((h) => {
      const doc = docById.get(h.id)!
      return { doc, score: h.score * PRIORS[doc.kind] }
    })
    .filter((a) => a.score >= MIN_SCORE)
    .sort((a, b) => b.score - a.score || a.doc.id.localeCompare(b.doc.id))
    .slice(0, limit)
}

/** Shown when the input is empty. Chosen to advertise what the corpus covers. */
export const suggestions = [
  'What RAG systems has he built?',
  'Multi-agent orchestration',
  'Show me the quant work',
  'What did he do at Kyndryl?',
  'Education and scholarships',
  'How do I contact him?',
]

export { docs }
export type { Doc }
