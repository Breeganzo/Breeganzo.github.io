import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Github, Lock } from 'lucide-react'
import { findProject, trackLabels } from '../content/projects'
import { DataTable, StatusDot, Tag, buttonProps } from '../components/ui'
import { usePageMeta } from '../lib/usePageMeta'
import NotFound from './NotFound'

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const project = slug ? findProject(slug) : undefined

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

      <p className="mt-4 text-[16px] leading-relaxed text-muted">{project.tagline}</p>

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
        <>
          <h2 className="mt-10 mb-4 text-lg font-semibold tracking-tight">Notes</h2>
          <div className="space-y-4 text-[14.5px] leading-relaxed text-muted">
            {project.body.map((p) => (
              <p key={p.slice(0, 30)}>{p}</p>
            ))}
          </div>
        </>
      )}
    </article>
  )
}
