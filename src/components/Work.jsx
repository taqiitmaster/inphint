import { useState } from 'react'
import { PROJECTS, AI_PROJECTS, CATLABEL } from '../data'

const FILTERS = [
  ['all', 'All'], ['ai', 'AI automation'], ['web', 'Web'], ['brand', 'Branding'], ['mktg', 'Marketing'],
]

export default function Work() {
  const [cat, setCat] = useState('all')
  const showAI = cat === 'all' || cat === 'ai'
  const projects = PROJECTS.filter((p) => cat === 'all' || p.cats.includes(cat))

  return (
    <section className="section" id="work">
      <div className="wrap">
        <div className="shead" data-rise>
          <span className="eyebrow">Selected work</span>
          <h2 className="h-sec">Projects we're proud to put our name on.</h2>
        </div>

        <div className="filters" data-rise>
          {FILTERS.map(([k, label]) => (
            <button key={k} className={`fbtn${cat === k ? ' active' : ''}`} onClick={() => setCat(k)}>{label}</button>
          ))}
        </div>

        {showAI && (
          <div data-rise>
            <div className="ai-cards">
              {AI_PROJECTS.map((a) => (
                <article className="ai-card" key={a.title}>
                  <span className="tag">{a.tag}</span>
                  <h4>{a.title}</h4>
                  <div className="ai-feats">{a.features.map((f) => <span key={f}>{f}</span>)}</div>
                  <a className="btn btn-primary" href={a.demo} target="_blank" rel="noopener noreferrer">
                    Request a demo <span className="arr">→</span>
                  </a>
                </article>
              ))}
            </div>
          </div>
        )}

        <div className="work-grid">
          {projects.map((p) => (
            <article className="pcard" key={p.t}>
              <div className="pv"><img loading="lazy" src={`/assets/${p.img}.webp`} alt={p.t} /></div>
              <div className="body">
                <div className="tag">{p.cats.map((c) => CATLABEL[c]).join(' · ')}</div>
                <h4>{p.t}</h4>
                <div className="links">
                  {p.url
                    ? <a className="tlink" href={p.url} target="_blank" rel="noopener noreferrer">Visit site →</a>
                    : <span className="tlink" style={{ color: 'var(--muted-2)', cursor: 'default' }}>Branding project</span>}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
