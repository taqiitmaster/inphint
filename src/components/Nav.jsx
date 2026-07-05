import { useEffect, useState } from 'react'

const LINKS = [
  ['#services', 'Services'],
  ['#work', 'Work'],
  ['#process', 'Process'],
  ['#contact', 'Contact'],
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-in">
          <a href="#top" aria-label="Inphint home">
            <img className="logo" src="/assets/logo.webp" alt="Inphint" />
          </a>
          <div className="nav-links">
            {LINKS.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
          </div>
          <div className="nav-cta">
            <a href="#contact" className="btn btn-primary">Book a call</a>
            <button className="burger" aria-label="Open menu" onClick={() => setOpen((o) => !o)}>
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>
      <div className={`mobile${open ? ' open' : ''}`}>
        {LINKS.map(([href, label]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>
        ))}
      </div>
    </>
  )
}
