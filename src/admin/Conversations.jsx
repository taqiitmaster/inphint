import { useEffect, useState } from 'react'
import { adminApi } from '../api'
import { Modal, EmptyState } from './ui'

const fmt = (d) => new Date(d).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })

export default function Conversations() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [openId, setOpenId] = useState(null)
  const [detail, setDetail] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)

  const load = async () => {
    setLoading(true); setError('')
    try { setItems(await adminApi.conversations.list()) }
    catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const open = async (id) => {
    setOpenId(id); setDetail(null); setDetailLoading(true)
    try { setDetail(await adminApi.conversations.get(id)) }
    catch (e) { setError(e.message) }
    finally { setDetailLoading(false) }
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this conversation permanently?')) return
    await adminApi.conversations.remove(id)
    if (openId === id) setOpenId(null)
    load()
  }

  return (
    <div>
      <div className="a-panel-head">
        <div>
          <h2>Conversations</h2>
          <p className="a-muted">Every chat a visitor has had with Inphox, grouped by browser session.</p>
        </div>
      </div>

      {error && <div className="a-error">{error}</div>}
      {loading ? <div className="a-muted">Loading…</div>
        : items.length === 0 ? <EmptyState>No conversations yet — they'll appear here once visitors chat with Inphox.</EmptyState>
          : (
            <div className="a-enq-list">
              {items.map((c) => (
                <div className="a-enq" key={c.id}>
                  <div className="a-enq-top">
                    <div><strong>{c.message_count} message{c.message_count === 1 ? '' : 's'}</strong></div>
                    <span className="a-muted a-date">{fmt(c.updated_at)}</span>
                  </div>
                  <p className="a-enq-msg">{c.preview || '(no preview)'}</p>
                  <div className="a-enq-actions">
                    <button className="a-btn a-btn-ghost" onClick={() => open(c.id)}>View transcript</button>
                    <button className="a-btn a-btn-danger" onClick={() => remove(c.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}

      {openId && (
        <Modal
          title={`Conversation${detail ? ` · ${detail.message_count} messages` : ''}`}
          onClose={() => setOpenId(null)}
          footer={<button className="a-btn a-btn-ghost" onClick={() => setOpenId(null)}>Close</button>}
        >
          {detailLoading && <div className="a-muted">Loading…</div>}
          {detail && (
            <div className="a-transcript">
              {(detail.messages || []).map((m, i) => (
                <div key={i} className={`a-tmsg ${m.role === 'user' ? 'user' : 'bot'}`}>
                  <span className="a-tmsg-role">{m.role === 'user' ? 'Visitor' : 'Inphox'}</span>
                  <p>{m.content}</p>
                </div>
              ))}
            </div>
          )}
        </Modal>
      )}
    </div>
  )
}
