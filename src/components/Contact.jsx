import { useState } from 'react'
import { CONTACT } from '../data'

const SERVICES = ['AI automation', 'Web development', 'Branding & design', 'Social media marketing', 'SEO', 'Video editing', 'Web hosting', 'Not sure yet']
const SIZES = ['Just exploring', 'Small project', 'Medium project', 'Large project', 'Ongoing / retainer']
const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

export default function Contact() {
  const [f, setF] = useState({ name: '', email: '', phone: '', service: '', budget: '', msg: '' })
  const [bad, setBad] = useState({})
  const [done, setDone] = useState(false)
  const set = (k) => (e) => { setF({ ...f, [k]: e.target.value }); setBad((b) => ({ ...b, [k]: false })) }

  const submit = (e) => {
    e.preventDefault()
    const errs = {
      name: !f.name.trim(),
      email: !f.email.trim() || !emailOk(f.email.trim()),
      service: !f.service,
      budget: !f.budget,
      msg: !f.msg.trim(),
    }
    setBad(errs)
    if (Object.values(errs).some(Boolean)) return
    setDone(true)
  }

  const cls = (k) => `field${bad[k] ? ' bad' : ''}`
  const has = (k) => (f[k] ? ' has' : '')

  return (
    <section className="section" id="contact">
      <div className="wrap">
        <div className="contact-grid">
          <div className="contact-aside" data-rise>
            <span className="eyebrow">Start a project</span>
            <h2 className="h-sec">Tell us what you're building.</h2>
            <p className="lead">Share a few details and the right person on our team will reply within one business day.</p>
            <div className="cinfo">
              <div className="row"><span className="e">✉️</span><div><div className="lbl">EMAIL</div><div className="val"><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></div></div></div>
              <div className="row"><span className="e">💬</span><div><div className="lbl">WHATSAPP</div><div className="val"><a href={CONTACT.whatsappLink} target="_blank" rel="noopener noreferrer">{CONTACT.whatsapp}</a></div></div></div>
              <div className="row"><span className="e">🌍</span><div><div className="lbl">SERVING</div><div className="val">USA · Canada · Europe · Australia</div></div></div>
              <div className="row"><span className="e">🦊</span><div><div className="lbl">PREFER TO CHAT?</div><div className="val">Ask Inphox — online, bottom-right</div></div></div>
            </div>
          </div>

          <div data-rise style={{ transitionDelay: '0.08s' }}>
            {!done ? (
              <form className="form" noValidate onSubmit={submit}>
                <div className="frow">
                  <div className={cls('name')}><input id="f-name" type="text" className={has('name').trim()} value={f.name} onChange={set('name')} /><label htmlFor="f-name">Your name</label><div className="err">Please add your name</div></div>
                  <div className={cls('email')}><input id="f-email" type="email" className={has('email').trim()} value={f.email} onChange={set('email')} /><label htmlFor="f-email">Email address</label><div className="err">Enter a valid email</div></div>
                </div>
                <div className="frow">
                  <div className={cls('phone')}><input id="f-phone" type="tel" className={has('phone').trim()} value={f.phone} onChange={set('phone')} /><label htmlFor="f-phone">Phone (optional)</label></div>
                  <div className={cls('service')}>
                    <select id="f-service" className={has('service').trim()} value={f.service} onChange={set('service')}>
                      <option value="" hidden></option>
                      {SERVICES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                    <label htmlFor="f-service">Service you need</label><div className="err">Pick a service</div>
                  </div>
                </div>
                <div className={cls('budget')}>
                  <select id="f-budget" className={has('budget').trim()} value={f.budget} onChange={set('budget')}>
                    <option value="" hidden></option>
                    {SIZES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                  <label htmlFor="f-budget">Project size</label><div className="err">Pick an option</div>
                </div>
                <div className={cls('msg')}><textarea id="f-msg" className={has('msg').trim()} value={f.msg} onChange={set('msg')} /><label htmlFor="f-msg">Tell us about the project</label><div className="err">A sentence or two helps</div></div>
                <button type="submit" className="btn btn-primary">Send enquiry <span className="arr">→</span></button>
                <div className="form-note"></div>
              </form>
            ) : (
              <div className="form-done show">
                <h3>Thanks — that's with us.</h3>
                <p>We'll be in touch within one business day. For now, reach us at <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> or on WhatsApp at <a href={CONTACT.whatsappLink} target="_blank" rel="noopener noreferrer">{CONTACT.whatsapp}</a>.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
