/**
 * Anchor ids for individually addressable items on the home page.
 *
 * Shared by `Home.tsx` (which renders the ids) and `lib/ask/corpus.ts` (which
 * links to them). Deriving both from one function is the point: a hand-written
 * href and a hand-written id drift the moment either side is edited, and the
 * failure is silent — the link still "works", it just lands nowhere useful.
 *
 * Takes primitives rather than the content types so it stays importable from
 * the Node-run retrieval eval without dragging type-only imports along.
 */

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/** Start date is included because the same employer can appear twice. */
export const roleAnchor = (company: string, start: string) =>
  `role-${slug(company)}-${slug(start)}`

export const degreeAnchor = (id: string) => `edu-${slug(id)}`

export const skillAnchor = (name: string) => `skills-${slug(name)}`

export const CERTIFICATIONS_ANCHOR = 'certifications'
