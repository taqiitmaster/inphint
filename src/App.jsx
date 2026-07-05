import { useReveal } from './hooks'
import Nav from './components/Nav'
import Hero from './components/Hero'
import { Marquee, Stats } from './components/Strip'
import Services from './components/Services'
import Process from './components/Process'
import Work from './components/Work'
import { About, FinalCta } from './components/AboutCta'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Chatbot from './components/Chatbot'

export default function App() {
  useReveal()
  return (
    <>
      <Nav />
      <span id="top" />
      <Hero />
      <Marquee />
      <Stats />
      <Services />
      <Process />
      <Work />
      <About />
      <FinalCta />
      <Contact />
      <Footer />
      <Chatbot />
    </>
  )
}
