import { useEffect, useState } from 'react'
import { adminApi } from '../api'
import { EmptyState } from './ui'

const STATUSES = [['', 'All'], ['new', 'New'], ['read', 'Read'], ['archived', 'Archived']]
const fmt = (d) => new Date(d).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })

export default function Contacts() {
  const [filter, setFilter] = useState('')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async (status = filter) => {
    setLoading(true); setError('')
    try { setItems(await adminApi.contacts.list(status)) }
    catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }
  useEffect(() => { load(filter) /* eslint-disable-next-line */ }, [filter])

  const setStatus = async (id, status) => {
    await adminApi.contacts.setStatus(id, status)
    load()
  }
  const remove = async (id) => {
    if (!window.confirm('Delete this enquiry permanently?')) return
    await adminApi.contacts.remove(id)
    load()
  }

  return (
    <div>
      <div className="a-panel-head">
        <div>
          <h2>Enquiries</h2>
          <p className="a-muted">Submissions from the website contact form.</p>
        </div>
        <div className="a-seg">
          {STATUSES.map(([v, l]) => (
            <button key={v} className={`a-seg-btn${filter === v ? ' on' : ''}`} onClick={() => setFilter(v)}>{l}</button>
          ))}
        </div>
      </div>

      {error && <div className="a-error">{error}</div>}
      {loading ? <div className="a-muted">Loading…</div>
        : items.length === 0 ? <EmptyState>No enquiries here yet.</EmptyState>
          : (
            <div className="a-enq-list">
              {items.map((c) => (
                <div className={`a-enq status-${c.status}`} key={c.id}>
                  <div className="a-enq-top">
                    <div>
                      <strong>{c.name}</strong>
                      <span className={`a-pill p-${c.status}`}>{c.status}</span>
                    </div>
                    <span className="a-muted a-date">{fmt(c.created_at)}</span>
                  </div>
                  <div className="a-enq-meta">
                    <a href={`mailto:${c.email}`}>{c.email}</a>
                    {c.phone && <span>· {c.phone}</span>}
                    {c.service && <span>· {c.service}</span>}
                    {c.budget && <span>· {c.budget}</span>}
                  </div>
                  <p className="a-enq-msg">{c.message}</p>
                  <div className="a-enq-actions">
                    {c.status !== 'read' && <button className="a-btn a-btn-ghost" onClick={() => setStatus(c.id, 'read')}>Mark read</button>}
                    {c.status !== 'new' && <button className="a-btn a-btn-ghost" onClick={() => setStatus(c.id, 'new')}>Mark new</button>}
                    {c.status !== 'archived' && <button className="a-btn a-btn-ghost" onClick={() => setStatus(c.id, 'archived')}>Archive</button>}
                    <button className="a-btn a-btn-danger" onClick={() => remove(c.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
    </div>
  )
}
