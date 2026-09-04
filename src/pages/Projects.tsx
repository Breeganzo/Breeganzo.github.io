import { useMemo, useState } from 'react'
import { byTrack, projects, trackLabels } from '../content/projects'
import type { Track } from '../content/types'
import ProjectCard from '../components/ProjectCard'
import { SectionHeading } from '../components/ui'
import { usePageMeta } from '../lib/usePageMeta'
import { reveal, useReveal } from '../lib/useReveal'

type Filter = Track | 'all'

const filters: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'ai', label: trackLabels.ai },
  { key: 'quant', label: trackLabels.quant },
  { key: 'platform', label: trackLabels.platform },
]

export default function Projects() {
  usePageMeta(
    'Projects — Anthony Breeganzo Thomas',
    'Generative-AI, agentic and quantitative engineering projects, with code where it can be shared.',
  )
  const [filter, setFilter] = useState<Filter>('all')
  const root = useReveal<HTMLElement>()

  const shown = useMemo(() => (filter === 'all' ? projects : byTrack(filter)), [filter])

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: projects.length, ai: 0, quant: 0, platform: 0 }
    for (const p of projects) c[p.track] += 1
    return c
  }, [])

  return (
    <section ref={root} className="mx-auto max-w-5xl px-5 pt-14 pb-20">
      <div {...reveal(0)}>
        <SectionHeading eyebrow="Projects" title="Everything, filterable">
          <p>
            Production client work, independent research and personal products. Client engagements are
            described without identifying details and carry no repository link — that constraint is stated
            on the card rather than hidden.
          </p>
        </SectionHeading>
      </div>

      <div
        role="group"
        aria-label="Filter projects by track"
        {...reveal(1)}
        className="mb-8 flex flex-wrap gap-2"
      >
        {filters.map((f) => {
          const active = filter === f.key
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              aria-pressed={active}
              className={`rounded-pill px-4 py-2 text-[13px] font-medium transition-[transform,box-shadow,color] duration-300 hover:-translate-y-0.5 ${
                active ? 'text-on-accent shadow-float' : 'glass text-muted hover:text-ink'
              }`}
              style={active ? { background: 'var(--grad-accent)' } : undefined}
            >
              {f.label}
              <span className="ml-1.5 font-mono text-[11px] opacity-70">{counts[f.key]}</span>
            </button>
          )
        })}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {shown.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </section>
  )
}
