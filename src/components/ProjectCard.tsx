import { Link } from 'react-router-dom'
import { ArrowUpRight, ExternalLink, Github, Lock } from 'lucide-react'
import type { Project } from '../content/types'
import { Card, StatusDot, Tag } from './ui'

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="flex h-full flex-col p-5">
      <div className="mb-2 flex items-start gap-3">
        <h3 className="text-[15px] font-semibold tracking-tight">
          <Link
            to={`/projects/${project.slug}`}
            className="transition-colors hover:text-accent"
            // Stretches the link over the whole card so the entire surface
            // is clickable, while the footer links stay individually
            // reachable via their own z-index.
          >
            <span aria-hidden className="absolute inset-0" />
            {project.name}
          </Link>
        </h3>
        <div className="ml-auto shrink-0 pt-0.5">
          <StatusDot status={project.status} />
        </div>
      </div>

      {project.badge && (
        <p className="mb-2 font-mono text-[11px] text-accent">{project.badge}</p>
      )}

      <p className="mb-4 text-[13.5px] leading-relaxed text-muted">{project.tagline}</p>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {project.stack.slice(0, 5).map((s) => (
          <Tag key={s}>{s}</Tag>
        ))}
        {project.stack.length > 5 && <Tag>+{project.stack.length - 5}</Tag>}
      </div>

      <div className="relative z-10 mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 text-[12.5px]">
        <span className="inline-flex items-center gap-1 text-accent">
          Details <ArrowUpRight size={13} aria-hidden />
        </span>
        {project.repo && (
          <a
            href={project.repo}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-muted transition-colors hover:text-accent"
          >
            <Github size={13} aria-hidden /> Code
          </a>
        )}
        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-muted transition-colors hover:text-accent"
          >
            <ExternalLink size={13} aria-hidden /> Live
          </a>
        )}
        {/* Say why there is no link, rather than leaving a gap that reads as an omission. */}
        {!project.repo && project.noRepoReason && (
          <span className="inline-flex items-center gap-1 text-faint">
            <Lock size={12} aria-hidden /> {project.noRepoReason}
          </span>
        )}
      </div>
    </Card>
  )
}
