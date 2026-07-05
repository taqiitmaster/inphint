import { useEffect, useRef } from 'react'

const WORDS = ['AI Automation', 'Web Development', 'Branding', 'SEO', 'Social Marketing', 'Video Editing', 'Web Hosting']

export function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="mq-track">
        {[...WORDS, ...WORDS].map((w, i) => <span key={i}>{w}</span>)}
      </div>
    </div>
  )
}

const STATS = [
  { to: 100, suffix: '+', label: 'Projects delivered' },
  { to: 10, suffix: '+', label: 'Years of experience' },
  { to: 4, suffix: '', label: 'Continents served' },
  { to: 98, suffix: '%', label: 'Client satisfaction' },
]

function Counter({ to, suffix }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return
      io.unobserve(el)
      const t0 = performance.now()
      const step = (now) => {
        const p = Math.min(1, (now - t0) / 1300)
        const eased = 1 - Math.pow(1 - p, 3)
        el.textContent = Math.round(to * eased) + suffix
        if (p < 1) requestAnimationFrame(step)
        else el.textContent = to + suffix
      }
      requestAnimationFrame(step)
    }), { threshold: 0.5 })
    io.observe(el)
    return () => io.disconnect()
  }, [to, suffix])
  return <span ref={ref} className="count">0</span>
}

export function Stats() {
  return (
    <section className="strip" style={{ borderBottom: '1px solid var(--line-soft)' }}>
      <div className="wrap">
        <div className="strip-in">
          {STATS.map((s, i) => (
            <div key={i} data-rise style={{ transitionDelay: `${i * 0.06}s` }}>
              <div className="n"><Counter to={s.to} suffix={s.suffix} /></div>
              <div className="l">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
