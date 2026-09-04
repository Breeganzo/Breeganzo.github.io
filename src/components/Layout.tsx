import { useEffect, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Github, Linkedin, Mail, Menu, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { profile } from '../content/profile'

const nav = [
  { to: '/projects', label: 'Projects' },
  { to: '/quant', label: 'Quant Research' },
  { to: '/#experience', label: 'Experience' },
  { to: '/#contact', label: 'Contact' },
]

function NavItems({ onNavigate, stacked = false }: { onNavigate?: () => void; stacked?: boolean }) {
  const { pathname } = useLocation()
  return (
    <>
      {nav.map((item) => {
        const isRoute = !item.to.includes('#')
        const active = isRoute && pathname === item.to
        const cls = stacked
          ? 'block rounded-md px-3 py-2 text-sm transition-colors'
          : 'rounded-md px-2.5 py-1.5 text-[13px] transition-colors'
        return isRoute ? (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cls}
            style={{
              color: active ? 'var(--text)' : 'var(--text-muted)',
              background: active ? 'var(--bg-subtle)' : undefined,
            }}
          >
            {item.label}
          </NavLink>
        ) : (
          <a
            key={item.to}
            href={item.to}
            onClick={onNavigate}
            className={cls}
            style={{ color: 'var(--text-muted)' }}
          >
            {item.label}
          </a>
        )
      })}
    </>
  )
}

function Nav() {
  const [open, setOpen] = useState(false)
  const { pathname, hash } = useLocation()

  // Close the mobile menu whenever the location changes.
  useEffect(() => setOpen(false), [pathname, hash])

  // Escape closes it, so the menu is not a keyboard trap.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur"
      style={{ background: 'color-mix(in srgb, var(--bg) 85%, transparent)', borderBottom: '1px solid var(--border)' }}
    >
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-5 py-3.5">
        <Link to="/" className="mr-auto min-w-0">
          <span className="block truncate text-sm font-semibold tracking-tight">{profile.name}</span>
          <span className="block truncate text-xs" style={{ color: 'var(--text-muted)' }}>
            {profile.title} @ {profile.company}
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 sm:flex">
          <NavItems />
        </nav>

        <ThemeToggle />

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="grid size-9 place-items-center rounded-md border sm:hidden"
          style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
        >
          {open ? <X size={16} aria-hidden /> : <Menu size={16} aria-hidden />}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="sm:hidden"
          // Opaque, not translucent — the header's backdrop-blur would otherwise
          // let page content show through behind the links.
          style={{ borderTop: '1px solid var(--border)', background: 'var(--bg)' }}
        >
          <div className="mx-auto max-w-5xl space-y-0.5 px-4 py-3">
            <NavItems stacked onNavigate={() => setOpen(false)} />
          </div>
        </nav>
      )}
    </header>
  )
}

function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)' }}>
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center">
        <p className="text-[13px]" style={{ color: 'var(--text-faint)' }}>
          {profile.name} · {profile.location}
        </p>
        <div className="flex items-center gap-3 sm:ml-auto">
          <a href={profile.links.github} target="_blank" rel="noreferrer" aria-label="GitHub" style={{ color: 'var(--text-muted)' }}>
            <Github size={17} aria-hidden />
          </a>
          <a href={profile.links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" style={{ color: 'var(--text-muted)' }}>
            <Linkedin size={17} aria-hidden />
          </a>
          <a href={`mailto:${profile.email}`} aria-label="Email" style={{ color: 'var(--text-muted)' }}>
            <Mail size={17} aria-hidden />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-100 focus:rounded focus:px-3 focus:py-2"
        style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)' }}
      >
        Skip to content
      </a>
      <Nav />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
