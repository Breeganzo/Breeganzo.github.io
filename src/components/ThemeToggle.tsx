import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

const STORAGE_KEY = 'theme'
const OS_DARK = '(prefers-color-scheme: dark)'

/** Stored choice wins; otherwise follow the operating system. */
const read = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'dark' || stored === 'light') return stored === 'dark'
  } catch {
    /* private browsing — fall through to the OS preference */
  }
  return window.matchMedia(OS_DARK).matches
}

export default function ThemeToggle() {
  const [dark, setDark] = useState(read)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  // Track the OS only while the visitor has not made an explicit choice.
  // Once they click the toggle, their choice is stored and this stops
  // overriding it.
  useEffect(() => {
    const mq = window.matchMedia(OS_DARK)
    const onChange = (e: MediaQueryListEvent) => {
      try {
        if (localStorage.getItem(STORAGE_KEY)) return
      } catch {
        /* cannot read storage — treat as no explicit choice */
      }
      setDark(e.matches)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const toggle = () => {
    setDark((d) => {
      const next = !d
      try {
        localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light')
      } catch {
        /* private browsing — theme simply won't persist */
      }
      return next
    })
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="glass grid size-9 place-items-center rounded-pill text-muted transition-[transform,color] duration-300 hover:-translate-y-0.5 hover:text-accent"
    >
      {dark ? <Sun size={16} aria-hidden /> : <Moon size={16} aria-hidden />}
    </button>
  )
}
