import { useEffect, useState } from 'react'
import { SERVICES as DEFAULT_SERVICES, AI_CHIPS as DEFAULT_CHIPS } from '../data'
import { api } from '../api'

// Normalise the bundled defaults into the shape the API returns, so the
// component renders identically whether data comes from the DB or the fallback.
const defaultServices = DEFAULT_SERVICES.map((s) => ({ title: s.t, description: s.d, sub: s.sub, icon: s.icon }))
const defaultChips = [...DEFAULT_CHIPS.map((label) => ({ label, hot: false })), { label: 'Custom AI automation', hot: true }]

export default function Services() {
  const [services, setServices] = useState(defaultServices)
  const [chips, setChips] = useState(defaultChips)

  useEffect(() => {
    let alive = true
    api.getServices().then((rows) => {
      if (alive && Array.isArray(rows) && rows.length) setServices(rows)
    }).catch(() => { /* keep defaults if API/DB unavailable */ })
    api.getAiChips().then((rows) => {
      if (alive && Array.isArray(rows) && rows.length) setChips(rows)
    }).catch(() => {})
    return () => { alive = false }
  }, [])

  return (
    <section className="section" id="services">
      <div className="wrap">
        <div className="shead" data-rise>
          <span className="eyebrow">What we do</span>
          <h2 className="h-sec">One team for the work that moves the needle.</h2>
          <p className="lead">Seven disciplines, joined up — led by the one most businesses ask for first.</p>
        </div>

        <div className="svc-feature" data-rise>
          <div>
            <span className="badge">Flagship · most requested</span>
            <h3>AI automation</h3>
            <p>Put the repetitive work on autopilot. We build AI agents and workflows for almost anything — sales, support, bookings, follow-ups, data and reporting — and if your process is unique, we build fully custom AI automation around it.</p>
            <div className="chips">
              {chips.map((c) => (
                c.hot
                  ? <span className="hot" key={c.id ?? c.label}>{c.label}</span>
                  : <span key={c.id ?? c.label}>{c.label}</span>
              ))}
            </div>
          </div>
          <div className="right">
            <div className="stat-row"><span className="k">Avg. response time after launch</span><span className="v">&lt;30s</span></div>
            <div className="stat-row"><span className="k">Routine tasks removed</span><span className="v">40%<small>typical</small></span></div>
            <div className="stat-row"><span className="k">Coverage</span><span className="v">24/7</span></div>
          </div>
        </div>

        <div className="svc-grid">
          {services.map((s, i) => (
            <div className="svc" key={s.id ?? s.title} data-rise style={{ transitionDelay: `${(i % 3) * 0.05}s` }}>
              <div className="ico">
                <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"
                  dangerouslySetInnerHTML={{ __html: s.icon || '' }} />
              </div>
              <h4>{s.title}</h4>
              <p>{s.description}</p>
              <div className="sub">{(s.sub || []).map((x) => <span key={x}>{x}</span>)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
