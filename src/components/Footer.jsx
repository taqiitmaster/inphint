import { CONTACT } from '../data'

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <img className="logo" src="/assets/logo.webp" alt="Inphint" />
            <p>AI automation, websites, brands and marketing systems — built to grow your business.</p>
          </div>
          <div className="foot-col">
            <h5>Services</h5>
            <a href="#services">AI automation</a><a href="#services">Web development</a>
            <a href="#services">Branding</a><a href="#services">Marketing</a><a href="#services">SEO</a>
          </div>
          <div className="foot-col">
            <h5>Studio</h5>
            <a href="#about">About</a><a href="#work">Work</a>
            <a href="#process">Process</a><a href="#contact">Contact</a>
          </div>
          <div className="foot-col">
            <h5>Connect</h5>
            <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href={CONTACT.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href={CONTACT.whatsappLink} target="_blank" rel="noopener noreferrer">WhatsApp</a>
            <a href={`mailto:${CONTACT.email}`}>Email</a>
          </div>
        </div>
        <div className="foot-bot">
          <span>© 2026 Inphint. All rights reserved.</span>
          <span>USA · Canada · Europe · Australia</span>
        </div>
      </div>
    </footer>
  )
}
