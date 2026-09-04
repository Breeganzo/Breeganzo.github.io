import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

const read = () => {
  try {
    const stored = localStorage.getItem('theme')
    return stored ? stored === 'dark' : true
  } catch {
    return true
  }
}

export default function ThemeToggle() {
  const [dark, setDark] = useState(read)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    try {
      localStorage.setItem('theme', dark ? 'dark' : 'light')
    } catch {
      /* private browsing — theme simply won't persist */
    }
  }, [dark])

  return (
    <button
      type="button"
      onClick={() => setDark((d) => !d)}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="grid size-9 place-items-center rounded-md border transition-colors"
      style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
    >
      {dark ? <Sun size={16} aria-hidden /> : <Moon size={16} aria-hidden />}
    </button>
  )
}
