import { Link } from 'react-router-dom'
import { usePageMeta } from '../lib/usePageMeta'

export default function NotFound() {
  usePageMeta('Not found — Anthony Breeganzo Thomas')
  return (
    <section className="mx-auto flex max-w-5xl flex-col items-start px-5 py-28">
      <p className="mb-3 font-mono text-xs tracking-wide uppercase" style={{ color: 'var(--accent)' }}>
        404
      </p>
      <h1 className="text-2xl font-semibold tracking-tight">That page doesn't exist</h1>
      <p className="mt-3 text-[15px]" style={{ color: 'var(--text-muted)' }}>
        The link may be out of date.
      </p>
      <Link
        to="/"
        className="mt-6 rounded-md px-4 py-2 text-sm font-medium text-white"
        style={{ background: 'var(--accent)' }}
      >
        Back home
      </Link>
    </section>
  )
}
