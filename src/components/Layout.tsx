import { useEffect, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Github, Linkedin, Mail, Menu, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import Ask from './Ask'
import Aurora from './Aurora'
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
          ? 'block rounded-pill px-3 py-2 text-sm transition-colors'
          : 'relative rounded-pill px-3 py-1.5 text-[13px] transition-colors'
        const tone = active ? 'text-ink' : 'text-muted hover:text-ink'

        return isRoute ? (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={`${cls} ${tone}`}
            style={active ? { background: 'var(--accent-soft)' } : undefined}
          >
            {item.label}
          </NavLink>
        ) : (
          <a key={item.to} href={item.to} onClick={onNavigate} className={`${cls} ${tone}`}>
            {item.label}
          </a>
        )
      })}
    </>
  )
}

function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
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

  // The header is transparent over the hero and gains its glass surface
  // once the page has scrolled, so it never competes with the hero.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="sticky top-0 z-50">
      <div
        className={`transition-[background-color,box-shadow,border-color] duration-300 ${
          scrolled ? 'glass border-x-0 border-t-0 rounded-none' : 'border-b border-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-5 py-3.5">
          <Link to="/" className="mr-auto min-w-0">
            <span className="block truncate text-sm font-semibold tracking-tight">
              {profile.name}
            </span>
            <span className="block truncate text-xs text-muted">
              {profile.title} @ {profile.company}
            </span>
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-1 sm:flex">
            <NavItems />
          </nav>

          <Ask />

          <ThemeToggle />

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="glass grid size-9 place-items-center rounded-pill text-muted sm:hidden"
          >
            {open ? <X size={16} aria-hidden /> : <Menu size={16} aria-hidden />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="border-t border-line bg-canvas sm:hidden"
          // Opaque, not translucent — the header's backdrop-blur would otherwise
          // let page content show through behind the links.
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
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center">
        <p className="text-[13px] text-faint">
          {profile.name} · {profile.location}
        </p>
        <div className="flex items-center gap-2 sm:ml-auto">
          <a
            href={profile.links.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="glass grid size-9 place-items-center rounded-pill text-muted transition-[transform,color] duration-300 hover:-translate-y-0.5 hover:text-accent"
          >
            <Github size={16} aria-hidden />
          </a>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="glass grid size-9 place-items-center rounded-pill text-muted transition-[transform,color] duration-300 hover:-translate-y-0.5 hover:text-accent"
          >
            <Linkedin size={16} aria-hidden />
          </a>
          <a
            href={`mailto:${profile.email}`}
            aria-label="Email"
            className="glass grid size-9 place-items-center rounded-pill text-muted transition-[transform,color] duration-300 hover:-translate-y-0.5 hover:text-accent"
          >
            <Mail size={16} aria-hidden />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Aurora />
      <a
        href="#main"
        className="glass sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-100 focus:rounded-pill focus:px-4 focus:py-2"
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
