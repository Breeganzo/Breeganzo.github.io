import type { ReactNode } from 'react'
import type { Project } from '../content/types'
import { statusLabels } from '../content/projects'

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span
      className="rounded px-1.5 py-0.5 font-mono text-[11px] leading-relaxed"
      style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
    >
      {children}
    </span>
  )
}

export function StatusDot({ status }: { status: Project['status'] }) {
  const live = status === 'production'
  const active = status === 'in-development'
  const color = live ? '#3fb950' : active ? '#d29922' : 'var(--text-faint)'
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--text-muted)' }}>
      <span
        aria-hidden
        className="size-1.5 rounded-full"
        style={{ background: color, boxShadow: live || active ? `0 0 0 2px color-mix(in srgb, ${color} 20%, transparent)` : undefined }}
      />
      {statusLabels[status]}
    </span>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string
  title: string
  children?: ReactNode
}) {
  return (
    <div className="mb-8">
      {eyebrow && (
        <p className="mb-2 font-mono text-xs tracking-wide uppercase" style={{ color: 'var(--accent)' }}>
          {eyebrow}
        </p>
      )}
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
      {children && (
        <div className="mt-3 max-w-2xl prose-body text-[15px]">{children}</div>
      )}
    </div>
  )
}

export function DataTable({ table }: { table: NonNullable<Project['table']> }) {
  return (
    <figure className="my-6">
      <figcaption className="mb-3 text-sm font-medium">{table.caption}</figcaption>
      {/* Wide content scrolls inside its own container so the page never scrolls sideways. */}
      <div className="overflow-x-auto rounded-lg surface">
        <table className="w-full border-collapse font-mono text-[13px]">
          <thead>
            <tr>
              {table.columns.map((c, i) => (
                <th
                  key={c}
                  scope="col"
                  className={`px-3 py-2.5 font-medium whitespace-nowrap ${i === 0 ? 'text-left' : 'text-right'}`}
                  style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row) => (
              <tr key={row[0]}>
                {row.map((cell, i) => (
                  <td
                    key={i}
                    className={`px-3 py-2.5 whitespace-nowrap ${i === 0 ? 'text-left' : 'text-right'}`}
                    style={{ borderTop: '1px solid var(--border)' }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {table.note && (
        <figcaption className="mt-3 text-[13px]" style={{ color: 'var(--text-faint)' }}>
          {table.note}
        </figcaption>
      )}
    </figure>
  )
}
