export type Track = 'ai' | 'quant' | 'platform'

export type ProjectStatus = 'production' | 'in-development' | 'complete' | 'research'

export interface Project {
  slug: string
  name: string
  /** One line, recruiter-legible. Shown on cards. */
  tagline: string
  track: Track
  status: ProjectStatus
  /** Shown as a small label on the card, e.g. "3rd place, AI Innovation 2026". */
  badge?: string
  stack: string[]
  /** Bulleted detail. Every line must be traceable to a resume, a repo, or a confirmed account. */
  highlights: string[]
  repo?: string
  demo?: string
  /** Set when there is deliberately no repo link, so the UI can say why. */
  noRepoReason?: string
  featured?: boolean
  /** Longer prose for the detail page. */
  body?: string[]
  table?: {
    caption: string
    columns: string[]
    rows: string[][]
    note?: string
  }
}

export interface Role {
  company: string
  title: string
  location: string
  start: string
  end: string
  bullets: string[]
}

export interface SkillGroup {
  name: string
  items: string[]
  /** Surfaced in the Methods section of the quant page. */
  quant?: boolean
}

export interface Degree {
  /** Stable key. Pages look degrees up by this, never by display text. */
  id: string
  institution: string
  qualification: string
  detail?: string
  start: string
  end: string
  note?: string
}

export interface Credential {
  name: string
  issuer: string
  inProgress?: boolean
}

export interface Award {
  name: string
  detail: string
}
