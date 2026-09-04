# breeganzo.github.io

Personal site for Anthony Breeganzo Thomas — AI Engineer at Kyndryl.

Live at **https://breeganzo.github.io**

## Stack

React 19, Vite, TypeScript, Tailwind CSS v4, React Router. Static build, no backend.
Deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`.

## Local development

```bash
npm install
npm run dev
```

## The content layer

All copy lives in typed data files under `src/content/` and nowhere else. Components
read from them; nothing is hardcoded in JSX. To update the site, edit one file:

| File | Holds |
| --- | --- |
| `profile.ts` | Name, title, links, hero copy, resume list |
| `projects.ts` | Every project, its track, status, stack and links |
| `experience.ts` | Roles and bullets |
| `skills.ts` | Skill groups (deliberately no proficiency ratings) |
| `credentials.ts` | Degrees, certifications, awards |

## Content rules

**Verified only.** If a claim cannot be traced to a resume, a repository, or a
confirmed first-hand account, it does not go on the site. Removing an unverified
claim is always preferable to softening it.

Client engagements are described without identifying details and carry no
repository link. Where a link is deliberately absent, `noRepoReason` states why,
so the gap reads as a decision rather than an omission.

## Release gates

All three run in CI and fail the deploy.

```bash
npm run audit:content    # withheld / confidential content, outdated title, retired domain
npm run checklinks       # every external URL resolves
npm run eval:retrieval   # Ask panel retrieval quality
```

`audit:content` scans `dist/` and any PDF in `public/` (needs `pdftotext`). It has a
short allowlist for documented false positives — each entry carries a reason, and it
is not for silencing real hits.

`checklinks` deliberately sends no auth token, because a 404 from GitHub is exactly
the signal that a linked repository is still private. LinkedIn's anti-bot codes (999
and 429) are treated as passes; a gate that fails intermittently gets ignored.

`eval:retrieval` scores the Ask panel against 36 hand-written queries and fails below
95% recall@3. Currently 100% recall@3, 86% recall@1, MRR 0.92.

## Ask panel

`⌘K` or `/` opens keyword retrieval over the site's own content — projects, roles,
qualifications, skills, contact.

There is no language model and no server behind it. A generative answer needs an API
key; a static site cannot hold a secret, so that would mean standing up a backend —
a thing that costs money, can go down, and can be abused. Instead it retrieves and
cites, which is the half of RAG that decides whether an answer is any good, and it
cannot invent a project that does not exist.

- `src/lib/ask/corpus.ts` flattens the content files into ~25 documents. The content
  files stay the single source of truth, so a new project is searchable immediately.
- `src/lib/ask/bm25.ts` is Okapi BM25 with an alias table for the vocabulary mismatch
  BM25 is bad at ("LLM" vs "language model"), applied to documents and queries alike.
- `src/lib/ask/index.ts` applies document priors after scoring. Skill groups are short
  keyword lists, so length normalisation made them outrank real work; the prior fixes
  that. It moved recall@1 from 81% to 86%.

The whole feature costs ~19 kB (6 kB gzipped) and runs offline.

## Repository metadata

`scripts/curate-repos.sh` sets the description, homepage and topics on every
repository the site links to, using the taglines from `projects.ts` as the source.
It is idempotent, so GitHub and the site cannot drift apart. Re-run it after editing
a tagline.

## Known blockers

**No resume is published.** `profile.resumes` is an empty array, so the hero's
download row hides itself. Both PDFs describe the "Elastic ML Observability &
Anomaly Detection" engagement, which `audit:content` forbids from anything public,
and `Quant_Resume.pdf` additionally identifies a client as **"India's third-largest
telecom operator (200M+ subscribers)"** — a superlative plus a scale figure names a
company as surely as naming it. They are staged, gitignored, at the repo root.

To publish them, re-export both with:

- the whole Elastic ML project removed, including the per-API-endpoint
  repartitioning across 105M+ records with 91 baselines, and the seven
  data-quality defects with the 28-panel dashboard;
- the telecom client described by sector alone — "an Indian telecom operator".

Then drop them in `public/`, restore the two entries in `profile.resumes`, and
confirm `npm run audit:content` still passes.

Other, non-blocking:

- `RMD_Agent_Demo`'s live demo link is omitted — the Streamlit app now redirects to
  a login page.
- `Veloryn` is commented out in `projects.ts`; `veloryn.dev` fails TLS and serves
  nothing over plain HTTP either.
