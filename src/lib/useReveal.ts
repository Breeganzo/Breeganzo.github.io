/**
 * Scroll-reveal driven by IntersectionObserver.
 *
 * Attach the returned ref to a container; every descendant carrying a
 * `data-reveal` attribute is observed once and flipped to
 * `data-revealed="true"`, which the CSS in index.css transitions.
 *
 * Elements are unobserved after firing — reveal is a one-way trip, so
 * scrolling back up does not replay the animation.
 */
import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'

const REDUCED = '(prefers-reduced-motion: reduce)'

export function useReveal<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (targets.length === 0) return

    // No observer at all under reduced motion: mark everything visible and
    // leave. The CSS media query already neutralises the transform, this
    // just avoids pointless observer work.
    if (typeof IntersectionObserver === 'undefined' || window.matchMedia(REDUCED).matches) {
      for (const el of targets) el.dataset.revealed = 'true'
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const el = entry.target as HTMLElement
          el.dataset.revealed = 'true'
          observer.unobserve(el)
        }
      },
      // Fire slightly before the element reaches the viewport edge so the
      // transition is already underway when it becomes properly visible.
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    )

    for (const el of targets) observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return ref
}

/**
 * Stagger helper. Spreads onto an element alongside `data-reveal` to
 * offset its transition without hardcoding delays in the CSS.
 */
export function reveal(index = 0, step = 70) {
  return {
    'data-reveal': '',
    style: { '--reveal-delay': `${index * step}ms` } as CSSProperties,
  }
}
