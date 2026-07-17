import { useEffect, useState } from 'react'
import { api, getToken, clearToken } from '../api'
import Login from './Login'
import Contacts from './Contacts'
import Conversations from './Conversations'
import ServicesAdmin from './ServicesAdmin'
import ChipsAdmin from './ChipsAdmin'
import ProjectsAdmin from './ProjectsAdmin'
import AiProjectsAdmin from './AiProjectsAdmin'
import './admin.css'

const TABS = [
  ['enquiries', 'Enquiries', Contacts],
  ['conversations', 'Conversations', Conversations],
  ['services', 'Services', ServicesAdmin],
  ['chips', 'AI chips', ChipsAdmin],
  ['projects', 'Projects', ProjectsAdmin],
  ['ai', 'AI projects', AiProjectsAdmin],
]

export default function AdminApp() {
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)
  const [tab, setTab] = useState('enquiries')

  useEffect(() => {
    if (!getToken()) { setChecking(false); return }
    api.me().then(() => setAuthed(true)).catch(() => clearToken()).finally(() => setChecking(false))
  }, [])

  if (checking) return <div className="a-boot">Loading…</div>
  if (!authed) return <Login onLoggedIn={() => setAuthed(true)} />

  const Active = TABS.find(([k]) => k === tab)[2]
  const logout = () => { clearToken(); setAuthed(false) }

  return (
    <div className="a-shell">
      <aside className="a-side">
        <a className="a-logo" href="/"><img src="/assets/logo.webp" alt="Inphint" /></a>
        <nav className="a-nav">
          {TABS.map(([k, label]) => (
            <button key={k} className={`a-navbtn${tab === k ? ' on' : ''}`} onClick={() => setTab(k)}>{label}</button>
          ))}
        </nav>
        <div className="a-side-foot">
          <a className="a-navbtn" href="/" target="_blank" rel="noreferrer">View site ↗</a>
          <button className="a-navbtn" onClick={logout}>Sign out</button>
        </div>
      </aside>
      <main className="a-main">
        <Active />
      </main>
    </div>
  )
}
