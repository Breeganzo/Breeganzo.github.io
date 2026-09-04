import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from 'react'
import type { Project } from '../content/types'
import { statusLabels } from '../content/projects'
import { useSpotlight } from '../lib/useSpotlight'

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-pill border border-line bg-subtle px-2 py-0.5 font-mono text-[11px] leading-relaxed text-muted">
      {children}
    </span>
  )
}

export function StatusDot({ status }: { status: Project['status'] }) {
  const live = status === 'production'
  const active = status === 'in-development'
  const color = live ? '#3fb950' : active ? '#d29922' : 'var(--text-faint)'
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] text-muted">
      <span
        aria-hidden
        className="size-1.5 rounded-full"
        style={{
          background: color,
          boxShadow:
            live || active ? `0 0 0 2px color-mix(in srgb, ${color} 20%, transparent)` : undefined,
        }}
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
        <p className="mb-2.5 flex items-center gap-2 font-mono text-xs tracking-[0.14em] uppercase text-accent">
          <span aria-hidden className="h-px w-6" style={{ background: 'var(--grad-accent)' }} />
          {eyebrow}
        </p>
      )}
      <h2 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">{title}</h2>
      {children && <div className="prose-body mt-3 max-w-2xl text-[15px]">{children}</div>}
    </div>
  )
}

export function DataTable({ table }: { table: NonNullable<Project['table']> }) {
  return (
    <figure className="my-6">
      <figcaption className="mb-3 text-sm font-medium">{table.caption}</figcaption>
      {/* Wide content scrolls inside its own container so the page never scrolls sideways. */}
      <div className="glass overflow-x-auto rounded-card">
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
        <figcaption className="mt-3 text-[13px] text-faint">{table.note}</figcaption>
      )}
    </figure>
  )
}

/**
 * Glass card with a hover lift, a gradient top edge that wipes in, and a
 * pointer-tracked glare. `isolate` confines the glare's z-index:-1 to the
 * card so it stays above the card background and behind the content.
 */
export function Card({
  children,
  className = '',
  ...rest
}: ComponentPropsWithoutRef<'div'>) {
  const { ref, onPointerMove } = useSpotlight<HTMLDivElement>()
  return (
    <div
      {...rest}
      ref={ref}
      onPointerMove={onPointerMove}
      className={`spotlight group relative isolate overflow-hidden rounded-card glass transition-[transform,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-lift ${className}`}
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
        style={{ background: 'var(--grad-accent)' }}
      />
      {children}
    </div>
  )
}

/** Static glass container — no hover behaviour, used for page sections. */
export function Panel({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={`glass-panel ${className}`}>{children}</div>
}

export type ButtonVariant = 'primary' | 'ghost' | 'quiet'

/**
 * Shared button appearance. Returned as props rather than rendered as a
 * component so the same styling can sit on a <button>, an <a> and a
 * react-router <Link> without a polymorphic wrapper.
 */
export function buttonProps(variant: ButtonVariant = 'ghost') {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-pill px-5 py-2.5 text-sm font-medium transition-[transform,box-shadow,background-color,color] duration-300 hover:-translate-y-0.5 active:translate-y-0'

  if (variant === 'primary') {
    return {
      className: `${base} text-on-accent shadow-float hover:shadow-lift`,
      style: { background: 'var(--grad-accent)' } as CSSProperties,
    }
  }
  if (variant === 'quiet') {
    return { className: `${base} text-muted hover:text-ink`, style: undefined }
  }
  return { className: `${base} glass text-ink hover:shadow-float`, style: undefined }
}

export function Badge({
  icon,
  title,
  subtitle,
}: {
  icon: ReactNode
  title: string
  subtitle: string
}) {
  return (
    <div className="glass flex items-center gap-3 rounded-card px-4 py-3">
      <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-pill text-accent bg-accent-soft">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[13px] font-semibold">{title}</span>
        <span className="block truncate text-[12px] text-muted">{subtitle}</span>
      </span>
    </div>
  )
}

export function Stat({ value, label }: { value: ReactNode; label: string }) {
  return (
    <div className="text-center sm:text-left">
      <div className="text-3xl font-bold tracking-tight tabular-nums gradient-text">{value}</div>
      <div className="mt-0.5 text-[12.5px] text-muted">{label}</div>
    </div>
  )
}
