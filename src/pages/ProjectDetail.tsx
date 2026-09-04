import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ExternalLink, Github, Lock } from 'lucide-react'
import { adjacentProjects, findProject, statusLabels, trackLabels } from '../content/projects'
import { DataTable, StatusDot, Tag, buttonProps } from '../components/ui'
import { usePageMeta } from '../lib/usePageMeta'
import NotFound from './NotFound'

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const project = slug ? findProject(slug) : undefined
  const { prev, next } = adjacentProjects(slug ?? '')

  usePageMeta(
    project ? `${project.name} — Anthony Breeganzo Thomas` : 'Not found',
    project?.tagline,
  )

  if (!project) return <NotFound />

  return (
    <article className="mx-auto max-w-3xl px-5 pt-10 pb-20">
      <Link
        to="/projects"
        className="mb-8 inline-flex items-center gap-1.5 text-[13px] text-muted transition-colors hover:text-accent"
      >
        <ArrowLeft size={14} aria-hidden /> All projects
      </Link>

      <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="font-mono text-xs tracking-[0.14em] uppercase text-accent">
          {trackLabels[project.track]}
        </span>
        <StatusDot status={project.status} />
      </div>

      <h1 className="text-3xl font-semibold tracking-tight text-balance">{project.name}</h1>

      {project.badge && <p className="mt-2 font-mono text-[12px] text-accent">{project.badge}</p>}

      <p className="mt-4 text-[17px] leading-relaxed text-balance">{project.tagline}</p>

      <div className="mt-6 flex flex-wrap items-center gap-3 text-[13px]">
        {project.repo && (
          <a href={project.repo} target="_blank" rel="noreferrer" {...buttonProps('ghost')}>
            <Github size={14} aria-hidden /> Repository
          </a>
        )}
        {project.demo && (
          <a href={project.demo} target="_blank" rel="noreferrer" {...buttonProps('ghost')}>
            <ExternalLink size={14} aria-hidden /> Live
          </a>
        )}
        {!project.repo && project.noRepoReason && (
          <span className="inline-flex items-center gap-1.5 text-faint">
            <Lock size={13} aria-hidden /> {project.noRepoReason}
          </span>
        )}
      </div>

      {/* At a glance. Repeats track/status from above in a scannable form —
          a visitor who lands here from a search result has no other context. */}
      <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-3">
        {[
          ['Track', trackLabels[project.track]],
          ['Status', statusLabels[project.status]],
          ['Stack', `${project.stack.length} technologies`],
        ].map(([label, value]) => (
          <div key={label} className="bg-raised px-4 py-3">
            <dt className="font-mono text-[10px] tracking-[0.14em] uppercase text-faint">
              {label}
            </dt>
            <dd className="mt-1 text-[13.5px] text-muted">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="my-8 flex flex-wrap gap-1.5">
        {project.stack.map((s) => (
          <Tag key={s}>{s}</Tag>
        ))}
      </div>

      <hr className="border-line" />

      <h2 className="mt-8 mb-4 text-lg font-semibold tracking-tight">Highlights</h2>
      <ul className="space-y-3">
        {project.highlights.map((h) => (
          <li key={h.slice(0, 30)} className="flex gap-3 text-[14.5px] leading-relaxed text-muted">
            <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-line-strong" />
            {h}
          </li>
        ))}
      </ul>

      {project.table && <DataTable table={project.table} />}

      {project.body && (
        <section className="mt-10">
          <h2 className="mb-1 text-lg font-semibold tracking-tight">Notes</h2>
          <p className="mb-5 text-[13px] text-faint">
            The decisions behind it, and what I would defend under questioning.
          </p>
          {/* Accent rail rather than a bordered box: this is the most valuable
              prose on the page and it should read like an essay, not a callout. */}
          <div
            className="space-y-4 border-l-2 pl-5 text-[15px] leading-[1.75] text-muted"
            style={{ borderColor: 'var(--accent)' }}
          >
            {project.body.map((p) => (
              <p key={p.slice(0, 30)}>{p}</p>
            ))}
          </div>
        </section>
      )}

      {(prev || next) && (
        <nav
          aria-label="More in this track"
          className="mt-14 grid gap-3 border-t border-line pt-8 sm:grid-cols-2"
        >
          {prev && <NeighbourLink project={prev} direction="prev" />}
          {next && <NeighbourLink project={next} direction="next" />}
        </nav>
      )}
    </article>
  )
}

function NeighbourLink({
  project,
  direction,
}: {
  project: { slug: string; name: string; tagline: string }
  direction: 'prev' | 'next'
}) {
  const isNext = direction === 'next'
  return (
    <Link
      to={`/projects/${project.slug}`}
      className={`group rounded-card border border-line p-4 transition-colors hover:border-line-strong ${
        isNext ? 'sm:text-right' : ''
      }`}
    >
      <span
        className={`flex items-center gap-1.5 font-mono text-[10px] tracking-[0.14em] uppercase text-faint ${
          isNext ? 'sm:justify-end' : ''
        }`}
      >
        {!isNext && <ArrowLeft size={12} aria-hidden />}
        {isNext ? 'Next' : 'Previous'}
        {isNext && <ArrowRight size={12} aria-hidden />}
      </span>
      <span className="mt-1.5 block text-[14.5px] font-medium transition-colors group-hover:text-accent">
        {project.name}
      </span>
      <span className="mt-1 line-clamp-2 block text-[13px] leading-relaxed text-faint">
        {project.tagline}
      </span>
    </Link>
  )
}
