const PRINCIPLES = [
  ['01', 'Senior, hands-on team', 'You talk to the people doing the work — no account-manager telephone game.'],
  ['02', 'Outcomes over output', 'We measure success in your numbers: leads, revenue, time saved — not deliverables.'],
  ['03', 'AI-native by default', "If a task can be automated well, we'll automate it — and show you the time it gives back."],
  ['04', 'Transparent, always', "Clear scope, clear pricing, clear reporting. You'll never wonder where things stand."],
]

export function About() {
  return (
    <section className="section" id="about">
      <div className="wrap">
        <div className="about-grid">
          <div className="about" data-rise>
            <span className="eyebrow">About Inphint</span>
            <h2 className="h-sec" style={{ marginBottom: '22px' }}>A small studio that takes your growth personally.</h2>
            <p>Inphint is a small studio of 15+ designers, engineers and marketers who bring more than 10 years of combined experience and treat your business like our own.</p>
            <p>We're AI-native by default — automation runs through everything we build — but the goal is always the same: practical work that grows your business and that you'll be proud to show off.</p>
          </div>
          <div data-rise style={{ transitionDelay: '0.08s' }}>
            {PRINCIPLES.map(([n, h, p]) => (
              <div className="principle" key={n}>
                <div className="pn">{n}</div>
                <div><h4>{h}</h4><p>{p}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function FinalCta() {
  return (
    <section className="section">
      <div className="wrap">
        <div className="cta-panel" data-rise>
          <h2>Let's build something that<br />grows your business.</h2>
          <p>Whether you need AI automation, a website, a brand or a marketing engine, Inphint is ready when you are.</p>
          <div className="btns">
            <a href="#contact" className="btn btn-primary">Book a discovery call <span className="arr">→</span></a>
            <a href="#contact" className="btn btn-ghost">Start a project</a>
          </div>
          <div className="hint">Have a quick question? Ask <b>Inphox</b>, our AI assistant — bottom-right, any time.</div>
        </div>
      </div>
    </section>
  )
}
