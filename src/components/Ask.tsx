import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUpRight, CornerDownLeft, X } from 'lucide-react'
import { ask, suggestions, type Doc } from '../lib/ask'
import { kindLabels } from '../lib/ask/corpus'

/**
 * "Ask about my work" — retrieval over this site's own content.
 *
 * Deliberately has no language model behind it. A generative answer would need
 * an API key, and a static site cannot hold a secret; the alternative is a
 * server, which is a thing that can go down and cost money. What it does
 * instead is retrieve and cite, which is the half of RAG that actually
 * determines whether the answer is any good — and unlike a generated answer,
 * it cannot hallucinate a project that does not exist.
 *
 * The retriever is scored in CI by `npm run eval:retrieval`.
 *
 * NON-MODAL ON PURPOSE. There is no backdrop and no scroll lock: the page keeps
 * scrolling behind the panel, so a visitor can hold a result on screen and keep
 * reading rather than having to dismiss it. That also keeps it clear of the
 * interruption patterns of sales chat widgets — it never opens itself, never
 * pulses, and never greets anyone.
 */

/** A magnifier over document lines — searching content, not chatting to a bot. */
function AskIcon({ size = 19 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="10.5" cy="10.5" r="7.5" />
      <path d="M7.2 8.4h6.6M7.2 11h6.6M7.2 13.6h3.4" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  )
}

export default function Ask() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const navigate = useNavigate()

  const results = useMemo(() => (query.trim() ? ask(query, 6) : []), [query])

  const close = useCallback((restoreFocus = true) => {
    setOpen(false)
    setQuery('')
    setActive(0)
    if (restoreFocus) triggerRef.current?.focus()
  }, [])

  const go = useCallback(
    (doc: Doc) => {
      close(false)
      if (doc.external) window.open(doc.href, '_blank', 'noopener,noreferrer')
      else navigate(doc.href)
    },
    [close, navigate],
  )

  // "/" is the search convention, Cmd/Ctrl+K the command-palette one.
  // Supporting both costs nothing and matches whichever the visitor already has.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null
      const typing =
        el?.tagName === 'INPUT' || el?.tagName === 'TEXTAREA' || el?.isContentEditable
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Dismiss on outside press. With no backdrop element there is nothing to
  // click, so this is what closes it — and the trigger is excluded so its own
  // toggle is not cancelled out before the click lands.
  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node
      if (panelRef.current?.contains(t) || triggerRef.current?.contains(t)) return
      close(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open, close])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => setActive(0), [query])

  useEffect(() => {
    listRef.current?.children[active]?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') return close()
    if (results.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => (i + 1) % results.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => (i - 1 + results.length) % results.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const hit = results[active]
      if (hit) go(hit.doc)
    }
  }

  return (
    <>
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Search my work"
          className="ask-in fixed right-4 bottom-20 z-50 flex max-h-[min(70vh,34rem)] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-panel glass shadow-lift sm:right-6 sm:bottom-24 sm:w-[400px]"
        >
          <div className="flex shrink-0 items-center gap-2.5 border-b border-line px-4">
            <span className="shrink-0 text-faint">
              <AskIcon size={16} />
            </span>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onInputKey}
              placeholder="Search my work…"
              aria-label="Search my work"
              aria-controls="ask-results"
              autoComplete="off"
              spellCheck={false}
              className="ask-field w-full bg-transparent py-3.5 text-[14.5px] outline-none placeholder:text-faint"
            />
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain">
            {query.trim() === '' && (
              <div className="p-3.5">
                <p className="mb-2.5 font-mono text-[10px] tracking-[0.14em] uppercase text-faint">
                  Try
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setQuery(s)
                        inputRef.current?.focus()
                      }}
                      className="rounded-pill border border-line px-2.5 py-1.5 text-[12.5px] text-muted transition-colors hover:border-line-strong hover:text-ink"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {query.trim() !== '' && results.length === 0 && (
              <p className="px-4 py-8 text-center text-[13.5px] text-faint">
                Nothing matched. Try a technology, a project name, or “contact”.
              </p>
            )}

            {results.length > 0 && (
              <ul id="ask-results" ref={listRef} className="p-1.5">
                {results.map((r, i) => (
                  <li key={r.doc.id}>
                    <button
                      type="button"
                      onClick={() => go(r.doc)}
                      onMouseMove={() => setActive(i)}
                      className={`w-full rounded-card px-2.5 py-2.5 text-left transition-colors ${
                        i === active ? 'bg-accent-soft' : ''
                      }`}
                    >
                      <span className="flex items-baseline gap-2">
                        <span className="shrink-0 font-mono text-[9.5px] tracking-[0.12em] uppercase text-accent">
                          {kindLabels[r.doc.kind]}
                        </span>
                        <span className="truncate text-[14px] font-medium">{r.doc.title}</span>
                        {r.doc.external && (
                          <ArrowUpRight size={11} aria-hidden className="shrink-0 text-faint" />
                        )}
                      </span>
                      <span className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-muted">
                        {r.doc.snippet}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Stating what this is beats letting someone find out it is not a
              chatbot by asking it a chatbot question. The CI line is the point:
              a retrieval system that publishes its own quality gate. */}
          <div className="flex shrink-0 items-center justify-between gap-2 border-t border-line px-3.5 py-2 text-[10.5px] text-faint">
            <span>Retrieval over this site. No model — quality gated in CI.</span>
            <CornerDownLeft size={10} aria-hidden className="hidden shrink-0 sm:block" />
          </div>
        </div>
      )}

      <button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? close() : setOpen(true))}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={open ? 'Close search' : 'Search my work'}
        className="glass fixed right-4 bottom-4 z-50 flex items-center gap-2 rounded-pill py-2.5 pr-3.5 pl-3 text-muted shadow-float transition-[transform,color] duration-300 hover:-translate-y-0.5 hover:text-ink sm:right-6 sm:bottom-6"
      >
        {open ? <X size={19} aria-hidden /> : <AskIcon />}
        <span className="text-[13px] font-medium">Ask</span>
        <kbd className="hidden rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-faint lg:inline">
          ⌘K
        </kbd>
      </button>
    </>
  )
}
