/**
 * Count-up for the hero stat row.
 *
 * Starts when the element scrolls into view, runs on rAF with an
 * ease-out curve, and snaps straight to the final value under reduced
 * motion — a number that never arrives is worse than one that does not
 * animate.
 */
import { useEffect, useRef, useState } from 'react'

export function useCountUp(target: number, durationMs = 1100) {
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setValue(target)
      return
    }

    let raf = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()

        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min((now - start) / durationMs, 1)
          // easeOutCubic — fast to begin with, settles gently.
          const eased = 1 - Math.pow(1 - t, 3)
          setValue(Math.round(target * eased))
          if (t < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )

    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [target, durationMs])

  return { ref, value }
}
