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

Both run in CI and fail the deploy.

```bash
npm run audit:content   # withheld / confidential content, outdated title, retired domain
npm run checklinks      # every external URL resolves
```

`audit:content` scans `dist/` and any PDF in `public/` (needs `pdftotext`). It has a
short allowlist for documented false positives — each entry carries a reason, and it
is not for silencing real hits.

`checklinks` deliberately sends no auth token, because a 404 from GitHub is exactly
the signal that a linked repository is still private.

## Known blockers

- **Resume downloads are disabled.** `profile.resumes` is empty because both source
  PDFs still contain two bullets that are excluded from this site. Regenerate them
  without those bullets, put them in `public/`, then restore the two entries.
  `audit:content` fails if a PDF containing the excluded phrases is present.
- Three linked repositories are still private, so those links 404 until they are
  made public: `AlphaFlow`, `AWS_LZ_AGENT`, `french-on-the-fly`.
- `RMD_Agent_Demo`'s live demo link is omitted — the Streamlit app now redirects to
  a login page.
