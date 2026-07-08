import { useEffect, useState } from 'react'
import { PROJECTS as DEFAULT_PROJECTS, AI_PROJECTS as DEFAULT_AI, CATLABEL } from '../data'
import { api } from '../api'

const FILTERS = [
  ['all', 'All'], ['ai', 'AI automation'], ['web', 'Web'], ['brand', 'Branding'], ['mktg', 'Marketing'],
]

// Bundled fallbacks, normalised to the API shape.
const defaultProjects = DEFAULT_PROJECTS.map((p) => ({ title: p.t, image: p.img, url: p.url, categories: p.cats }))
const defaultAi = DEFAULT_AI

// image can be a full URL, an absolute path, or a bare asset name ("tycoon").
const imgSrc = (image) => {
  if (!image) return ''
  if (/^https?:\/\//i.test(image) || image.startsWith('/')) return image
  return `/assets/${image}.webp`
}

export default function Work() {
  const [cat, setCat] = useState('all')
  const [projects, setProjects] = useState(defaultProjects)
  const [aiProjects, setAiProjects] = useState(defaultAi)

  useEffect(() => {
    let alive = true
    api.getProjects().then((rows) => {
      if (alive && Array.isArray(rows) && rows.length) setProjects(rows)
    }).catch(() => {})
    api.getAiProjects().then((rows) => {
      if (alive && Array.isArray(rows) && rows.length) setAiProjects(rows)
    }).catch(() => {})
    return () => { alive = false }
  }, [])

  const showAI = cat === 'all' || cat === 'ai'
  const shown = projects.filter((p) => cat === 'all' || (p.categories || []).includes(cat))

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

        {showAI && aiProjects.length > 0 && (
          <div data-rise>
            <div className="ai-cards">
              {aiProjects.map((a) => (
                <article className="ai-card" key={a.id ?? a.title}>
                  <span className="tag">{a.tag}</span>
                  <h4>{a.title}</h4>
                  <div className="ai-feats">{(a.features || []).map((f) => <span key={f}>{f}</span>)}</div>
                  {a.demo && (
                    <a className="btn btn-primary" href={a.demo} target="_blank" rel="noopener noreferrer">
                      Request a demo <span className="arr">→</span>
                    </a>
                  )}
                </article>
              ))}
            </div>
          </div>
        )}

        <div className="work-grid">
          {shown.map((p) => (
            <article className="pcard" key={p.id ?? p.title}>
              <div className="pv"><img loading="lazy" src={imgSrc(p.image)} alt={p.title} /></div>
              <div className="body">
                <div className="tag">{(p.categories || []).map((c) => CATLABEL[c] || c).join(' · ')}</div>
                <h4>{p.title}</h4>
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
