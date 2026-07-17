import { useEffect, useRef, useState } from 'react'
import { fallback } from '../data'
import { api } from '../api'

const AV = { backgroundImage: "url('/assets/fox-avatar.webp')" }
const QUICKS = ['What does Inphint do?', 'Tell me about AI automation', 'How do I get started?']
const GREETING = "Hi, I'm Inphox — Inphint's AI assistant. Ask me about AI automation, websites, branding, marketing or how to get started."
const SESSION_KEY = 'inphint_chat_session'

// One id per visitor per browser, so their whole conversation (across
// messages, and across visits until they clear storage) groups together
// under a single row in the admin "Conversations" tab.
function getSessionId() {
  let id = localStorage.getItem(SESSION_KEY)
  if (!id) {
    id = (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`)
    localStorage.setItem(SESSION_KEY, id)
  }
  return id
}

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState([])       // {role:'me'|'bot', text}
  const [typing, setTyping] = useState(false)
  const [text, setText] = useState('')
  const busy = useRef(false)
  const history = useRef([])                 // API history {role:'user'|'assistant', content}
  const sessionId = useRef(getSessionId())
  const bodyRef = useRef(null)
  const greeted = useRef(false)

  useEffect(() => {
    if (open && !greeted.current) {
      greeted.current = true
      setMsgs([{ role: 'bot', text: GREETING }])
    }
  }, [open])

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [msgs, typing])

  async function ask(q) {
    if (busy.current || !q.trim()) return
    busy.current = true
    setMsgs((m) => [...m, { role: 'me', text: q }])
    history.current.push({ role: 'user', content: q })
    setTyping(true)
    let reply
    try {
      const { reply: r, sessionId: sid } = await api.sendChat(history.current, sessionId.current)
      reply = r
      if (sid) sessionId.current = sid
    } catch {
      // Backend/Gemini unavailable — fall back to the built-in keyword replies
      // so the widget still feels responsive instead of erroring out.
      await new Promise((r) => setTimeout(r, 400))
      reply = fallback(q)
    }
    setTyping(false)
    setMsgs((m) => [...m, { role: 'bot', text: reply }])
    history.current.push({ role: 'assistant', content: reply })
    busy.current = false
  }

  const onSend = () => { const v = text; setText(''); ask(v) }

  return (
    <>
      {!open && (
        <button className="chat-fab" aria-label="Chat with Inphox" onClick={() => setOpen(true)}>
          <span className="av" style={AV} />
          <span className="lbl">Ask Inphox<small>AI assistant · online</small></span>
        </button>
      )}
      <div className={`chat-panel${open ? ' open' : ''}`} role="dialog" aria-label="Chat with Inphox">
        <div className="chat-head">
          <span className="av" style={AV} />
          <div><div className="nm">Inphox</div><div className="st"><i /> Online</div></div>
          <button className="x" aria-label="Close chat" onClick={() => setOpen(false)}>✕</button>
        </div>
        <div className="chat-body" ref={bodyRef}>
          {msgs.map((m, i) => <div key={i} className={`msg ${m.role}`}>{m.text}</div>)}
          {typing && <div className="typing"><i /><i /><i /></div>}
        </div>
        <div className="quicks">
          {QUICKS.map((q) => <button key={q} onClick={() => ask(q)}>{q}</button>)}
        </div>
        <div className="chat-input">
          <input
            type="text" placeholder="Ask Inphox anything…" autoComplete="off"
            value={text} onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') onSend() }}
          />
          <button aria-label="Send" disabled={busy.current} onClick={onSend}>↑</button>
        </div>
      </div>
    </>
  )
}
