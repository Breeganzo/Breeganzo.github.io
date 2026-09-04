import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { ArrowUpRight, CornerDownLeft, Search, X } from 'lucide-react'
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
 */
export default function Ask() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const navigate = useNavigate()

  const results = useMemo(() => (query.trim() ? ask(query, 6) : []), [query])

  const close = useCallback(() => {
    setOpen(false)
    setQuery('')
    setActive(0)
    // Return focus to where it came from, or the panel is a keyboard dead end.
    triggerRef.current?.focus()
  }, [])

  const go = useCallback(
    (doc: Doc) => {
      close()
      if (doc.external) window.open(doc.href, '_blank', 'noopener,noreferrer')
      else navigate(doc.href)
    },
    [close, navigate],
  )

  // Global shortcut. "/" is the convention for search, Cmd/Ctrl+K for command
  // palettes; supporting both costs nothing and matches whichever the visitor
  // already has in their fingers.
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

  // Lock background scroll while the dialog is up.
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    inputRef.current?.focus()
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  useEffect(() => setActive(0), [query])

  // Keep the highlighted row visible when navigating by keyboard.
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
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="inline-flex items-center gap-2 rounded-pill border border-line px-3 py-1.5 text-[13px] text-muted transition-colors hover:border-line-strong hover:text-ink"
      >
        <Search size={14} aria-hidden />
        <span>Ask</span>
        <kbd className="hidden rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-faint sm:inline">
          ⌘K
        </kbd>
      </button>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]"
            role="presentation"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) close()
            }}
          >
            <div
              aria-hidden
              className="absolute inset-0 backdrop-blur-sm"
              style={{ background: 'color-mix(in srgb, var(--bg) 70%, transparent)' }}
            />

            <div
              role="dialog"
              aria-modal="true"
              aria-label="Ask about my work"
              className="ask-in relative w-full max-w-xl overflow-hidden rounded-panel glass shadow-lift"
            >
              <div className="flex items-center gap-3 border-b border-line px-4">
                <Search size={16} aria-hidden className="shrink-0 text-faint" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onInputKey}
                  placeholder="Ask about my work…"
                  aria-label="Ask about my work"
                  aria-controls="ask-results"
                  autoComplete="off"
                  spellCheck={false}
                  className="w-full bg-transparent py-4 text-[15px] outline-none placeholder:text-faint"
                />
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close"
                  className="shrink-0 rounded p-1 text-faint transition-colors hover:text-ink"
                >
                  <X size={16} aria-hidden />
                </button>
              </div>

              <div className="max-h-[52vh] overflow-y-auto">
                {query.trim() === '' && (
                  <div className="p-4">
                    <p className="mb-3 font-mono text-[10px] tracking-[0.14em] uppercase text-faint">
                      Try
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => {
                            setQuery(s)
                            inputRef.current?.focus()
                          }}
                          className="rounded-pill border border-line px-3 py-1.5 text-[13px] text-muted transition-colors hover:border-line-strong hover:text-ink"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {query.trim() !== '' && results.length === 0 && (
                  <p className="px-4 py-8 text-center text-[14px] text-faint">
                    Nothing matched. Try a technology, a project name, or “contact”.
                  </p>
                )}

                {results.length > 0 && (
                  <ul id="ask-results" ref={listRef} className="p-2">
                    {results.map((r, i) => (
                      <li key={r.doc.id}>
                        <button
                          type="button"
                          onClick={() => go(r.doc)}
                          onMouseMove={() => setActive(i)}
                          className={`w-full rounded-card px-3 py-3 text-left transition-colors ${
                            i === active ? 'bg-accent-soft' : ''
                          }`}
                        >
                          <span className="flex items-baseline gap-2">
                            <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-accent">
                              {kindLabels[r.doc.kind]}
                            </span>
                            <span className="truncate text-[14.5px] font-medium">
                              {r.doc.title}
                            </span>
                            {r.doc.external && (
                              <ArrowUpRight size={12} aria-hidden className="shrink-0 text-faint" />
                            )}
                          </span>
                          <span className="mt-0.5 block text-[11.5px] text-faint">
                            {r.doc.meta}
                          </span>
                          <span className="mt-1.5 line-clamp-2 block text-[13px] leading-relaxed text-muted">
                            {r.doc.snippet}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Saying what this is beats letting someone discover it is not a
                  chatbot by asking it a chatbot question. */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-4 py-2.5 text-[11px] text-faint">
                <span>Keyword retrieval over this site — no model, no server.</span>
                <span className="flex items-center gap-1">
                  <CornerDownLeft size={11} aria-hidden /> to open
                </span>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
