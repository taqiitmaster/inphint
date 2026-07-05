import { useEffect, useRef, useState } from 'react'
import { SYSTEM, fallback } from '../data'

const AV = { backgroundImage: "url('/assets/fox-avatar.webp')" }
const QUICKS = ['What does Inphint do?', 'Tell me about AI automation', 'How do I get started?']
const GREETING = "Hi, I'm Inphox — Inphint's AI assistant. Ask me about AI automation, websites, branding, marketing or how to get started."

async function callAPI(history) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 1000, system: SYSTEM, messages: history.slice(-12) }),
  })
  if (!res.ok) throw new Error('HTTP ' + res.status)
  const data = await res.json()
  const text = (data.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('\n').trim()
  if (!text) throw new Error('empty')
  return text
}

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState([])       // {role:'me'|'bot', text}
  const [typing, setTyping] = useState(false)
  const [text, setText] = useState('')
  const busy = useRef(false)
  const history = useRef([])                 // API history {role, content}
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
    try { reply = await callAPI(history.current) }
    catch { await new Promise((r) => setTimeout(r, 500)); reply = fallback(q) }
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
