import { useEffect } from 'react'

export const REDUCED = typeof window !== 'undefined'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Observes any [data-rise] element (including ones added later, e.g. project cards)
// and adds `.in` when it scrolls into view. Mirrors the original IntersectionObserver.
export function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
      }),
      { threshold: 0.12 },
    )
    const scan = () => document.querySelectorAll('[data-rise]:not(.in)').forEach((el) => io.observe(el))
    scan()
    const mo = new MutationObserver(scan)
    mo.observe(document.body, { childList: true, subtree: true })
    return () => { io.disconnect(); mo.disconnect() }
  }, [])
}
