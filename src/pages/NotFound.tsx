import { Link } from 'react-router-dom'
import { usePageMeta } from '../lib/usePageMeta'
import { buttonProps } from '../components/ui'

export default function NotFound() {
  usePageMeta('Not found — Anthony Breeganzo Thomas')
  return (
    <section className="mx-auto max-w-5xl px-5 py-24">
      <div className="glass-panel px-7 py-14 text-center">
        <p className="mb-3 font-mono text-xs tracking-[0.14em] uppercase text-accent">404</p>
        <h1 className="text-2xl font-semibold tracking-tight">That page doesn't exist</h1>
        <p className="mt-3 text-[15px] text-muted">The link may be out of date.</p>
        <div className="mt-7 flex justify-center">
          <Link to="/" {...buttonProps('primary')}>
            Back home
          </Link>
        </div>
      </div>
    </section>
  )
}
