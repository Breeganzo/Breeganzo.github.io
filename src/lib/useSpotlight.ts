/**
 * Pointer-tracked spotlight for cards.
 *
 * Writes `--mx` / `--my` on the element; `.spotlight::after` in index.css
 * renders the radial highlight. Updates are coalesced into a single rAF
 * per frame so a fast mouse cannot queue up style writes.
 *
 * Skipped entirely on coarse pointers (touch) and under reduced motion —
 * there is no hover state to track, so the listener would be dead weight.
 */
import { useCallback, useEffect, useRef } from 'react'

export function useSpotlight<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null)
  const frame = useRef(0)
  const enabled = useRef(true)

  useEffect(() => {
    enabled.current =
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    return () => cancelAnimationFrame(frame.current)
  }, [])

  const onPointerMove = useCallback((event: React.PointerEvent<T>) => {
    const el = ref.current
    if (!el || !enabled.current) return

    const { clientX, clientY } = event
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect()
      el.style.setProperty('--mx', `${clientX - rect.left}px`)
      el.style.setProperty('--my', `${clientY - rect.top}px`)
    })
  }, [])

  return { ref, onPointerMove }
}
