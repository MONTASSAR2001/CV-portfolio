
import { useEffect, useRef, useState } from 'react'

/**
 * Ticks a value up from 0 to `end` once the element scrolls into view.
 * Returns a ref to attach to the target element and the current value.
 */
export function useCountUp(end: number, duration = 1800, decimals = 0) {
  const ref = useRef<HTMLElement | null>(null)
  const [value, setValue] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || started.current) return
          started.current = true

          if (prefersReduced) {
            setValue(end)
            return
          }

          const start = performance.now()
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1)
            // easeOutExpo for a rapid-then-settle feel
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
            const factor = Math.pow(10, decimals)
            setValue(Math.round(end * eased * factor) / factor)
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        })
      },
      { threshold: 0.4 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [end, duration, decimals])

  return { ref, value }
}
