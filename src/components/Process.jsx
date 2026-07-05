import { useEffect, useRef } from 'react'

const STEPS = [
  ['01', 'Discovery', 'We dig into your goals, audience and market until the brief is razor-sharp.'],
  ['02', 'Strategy', "A clear plan: scope, stack and the metrics we'll actually move."],
  ['03', 'Build', 'Design and engineering in tight loops — you see progress every week.'],
  ['04', 'Launch', 'We ship, test and harden — fast, secure and ready for traffic.'],
  ['05', 'Grow', 'Then we optimise: campaigns, automation and iteration that compounds.'],
]

export default function Process() {
  const gridRef = useRef(null)
  useEffect(() => {
    const el = gridRef.current
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { el.classList.add('in'); io.unobserve(el) }
    }), { threshold: 0.3 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section className="section" id="process">
      <div className="wrap">
        <div className="shead" data-rise>
          <span className="eyebrow">How we work</span>
          <h2 className="h-sec">A clear path from first call to compounding growth.</h2>
        </div>
        <div className="proc-grid" ref={gridRef}>
          <div className="proc-line"><i /></div>
          {STEPS.map(([n, h, p]) => (
            <div className="pstep" key={n}>
              <div className="pn">{n}</div><h4>{h}</h4><p>{p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
