import { certifications, degrees } from '../../content/credentials.ts'
import {
  CERTIFICATIONS_ANCHOR,
  degreeAnchor,
  roleAnchor,
  skillAnchor,
} from '../../content/anchors.ts'
import { roles } from '../../content/experience.ts'
import { profile } from '../../content/profile.ts'
import { projects, statusLabels, trackLabels } from '../../content/projects.ts'
import { skillGroups } from '../../content/skills.ts'

/**
 * Flattens the site's content into retrievable documents.
 *
 * The content files are the single source of truth: there is no separate
 * index to maintain, so a project added to `projects.ts` is answerable
 * immediately and cannot drift out of sync with what the pages render.
 *
 * Granularity is one document per *thing a visitor would ask about* — a
 * project, a role, a qualification. Chunking finer (per bullet) fragments the
 * context; chunking coarser (one doc for "all projects") makes every query
 * return the same result.
 */

export type DocKind = 'project' | 'role' | 'education' | 'certifications' | 'skills' | 'contact'

export interface Doc {
  id: string
  kind: DocKind
  title: string
  /** Small grey line under the title in results. */
  meta: string
  /** Prose shown as the answer. Must stand alone — it is all a visitor reads. */
  snippet: string
  /**
   * Where "open" goes. Points at the individual item, not the section it lives
   * in: sending three different roles to the same `#experience` heading makes
   * the visitor do the finding, which is the job they came here to delegate.
   */
  href: string
  external?: boolean
  /** Indexed only, never displayed. */
  text: string
}

const kindLabels: Record<DocKind, string> = {
  project: 'Project',
  role: 'Experience',
  education: 'Education',
  certifications: 'Certifications',
  skills: 'Skills',
  contact: 'Contact',
}

export { kindLabels }

export const docs: Doc[] = [
  ...projects.map<Doc>((p) => ({
    id: `project:${p.slug}`,
    kind: 'project',
    title: p.name,
    meta: `${trackLabels[p.track]} · ${statusLabels[p.status]}`,
    snippet: p.tagline,
    href: `/projects/${p.slug}`,
    // Highlights and body carry the substance; stack matters because visitors
    // search by technology far more than by project name.
    text: [
      p.name,
      p.tagline,
      trackLabels[p.track],
      statusLabels[p.status],
      p.badge ?? '',
      p.stack.join(' '),
      p.highlights.join(' '),
      (p.body ?? []).join(' '),
    ].join(' '),
  })),

  ...roles.map<Doc>((r) => ({
    id: `role:${r.company.toLowerCase()}`,
    kind: 'role',
    title: `${r.title} — ${r.company}`,
    meta: `${r.start} – ${r.end} · ${r.location}`,
    snippet: r.bullets[0],
    href: `/#${roleAnchor(r.company, r.start)}`,
    // "Present" is how the role renders, but "current job" is how a visitor
    // asks for it, and no amount of query rewriting bridges a word the
    // document simply does not contain. The fact is already true of the data;
    // this only makes it searchable.
    text: [
      r.company,
      r.title,
      r.location,
      r.start,
      r.end,
      r.end === 'Present' ? 'current present ongoing now latest' : 'previous former past',
      r.bullets.join(' '),
    ].join(' '),
  })),

  ...degrees.map<Doc>((d) => ({
    id: `education:${d.id}`,
    kind: 'education',
    title: d.qualification,
    meta: `${d.institution} · ${d.start} – ${d.end}`,
    snippet: [d.detail, d.note].filter(Boolean).join('. ') || d.institution,
    href: `/#${degreeAnchor(d.id)}`,
    text: [d.institution, d.qualification, d.detail ?? '', d.note ?? '', 'education degree university study'].join(' '),
  })),

  {
    id: 'certifications:all',
    kind: 'certifications',
    title: 'Certifications',
    meta: `${certifications.length} total`,
    snippet: certifications
      .map((c) => `${c.name}${c.inProgress ? ' (in progress)' : ''}`)
      .join(' · '),
    href: `/#${CERTIFICATIONS_ANCHOR}`,
    text: ['certification certified credential', ...certifications.map((c) => `${c.name} ${c.issuer}`)].join(' '),
  },

  ...skillGroups.map<Doc>((g) => ({
    id: `skills:${g.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    kind: 'skills',
    title: g.name,
    meta: `${g.items.length} skills`,
    snippet: g.items.join(' · '),
    href: `/#${skillAnchor(g.name)}`,
    text: [g.name, g.items.join(' '), 'skill technology tool'].join(' '),
  })),

  {
    id: 'contact:email',
    kind: 'contact',
    title: 'Get in touch',
    meta: profile.email,
    snippet: `${profile.name} — ${profile.title} at ${profile.company}, based in ${profile.location}. ${profile.availability}.`,
    href: `mailto:${profile.email}`,
    external: true,
    text: 'contact email reach hire hiring available availability opportunity work together message get in touch',
  },
  {
    id: 'contact:github',
    kind: 'contact',
    title: 'GitHub',
    meta: 'github.com/Breeganzo',
    snippet: 'Source for the public projects, including Scintilla, AlphaFlow and the ENTSO-E forecasting work.',
    href: profile.links.github,
    external: true,
    text: 'github source code repository repo open source',
  },
  {
    id: 'contact:linkedin',
    kind: 'contact',
    title: 'LinkedIn',
    meta: 'linkedin.com/in/breeganzo',
    snippet: 'Professional profile and full career history.',
    href: profile.links.linkedin,
    external: true,
    text: 'linkedin profile network professional connect',
  },
]

export const docById = new Map(docs.map((d) => [d.id, d]))
