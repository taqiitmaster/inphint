import { useState } from 'react'
import { adminApi } from '../api'
import { useResource, Modal, Field, Text, TagInput, NumberInput, Toggle, EmptyState } from './ui'

const blank = { title: '', tag: '', demo: '', features: [], sort_order: 0, active: true }

export default function AiProjectsAdmin() {
  const { items, loading, error, save, remove } = useResource(adminApi.aiProjects)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [formErr, setFormErr] = useState('')

  const open = (item) => { setFormErr(''); setEditing(item ? { ...item, features: item.features || [] } : { ...blank }) }
  const submit = async () => {
    if (!editing.title?.trim()) { setFormErr('Title is required'); return }
    setSaving(true); setFormErr('')
    try { await save(editing.id, editing); setEditing(null) }
    catch (e) { setFormErr(e.message) }
    finally { setSaving(false) }
  }
  const del = async (id) => { if (window.confirm('Delete this AI project?')) await remove(id) }

  return (
    <div>
      <div className="a-panel-head">
        <div>
          <h2>AI projects</h2>
          <p className="a-muted">Showcase cards shown above the work grid (All / AI automation filters).</p>
        </div>
        <button className="a-btn a-btn-primary" onClick={() => open(null)}>+ Add AI project</button>
      </div>

      {error && <div className="a-error">{error}</div>}
      {loading ? <div className="a-muted">Loading…</div>
        : items.length === 0 ? <EmptyState>No AI projects yet.</EmptyState>
          : (
            <div className="a-cards">
              {items.map((a) => (
                <div className={`a-card${a.active ? '' : ' inactive'}`} key={a.id}>
                  <div className="a-card-top">
                    <div>
                      {a.tag && <span className="a-kicker">{a.tag}</span>}
                      <h4>{a.title}</h4>
                    </div>
                    {!a.active && <span className="a-pill p-off">hidden</span>}
                  </div>
                  <div className="a-chips-mini">{(a.features || []).slice(0, 8).map((f) => <span key={f}>{f}</span>)}
                    {(a.features || []).length > 8 && <span>+{a.features.length - 8} more</span>}
                  </div>
                  <div className="a-card-actions">
                    <span className="a-order">#{a.sort_order}</span>
                    <button className="a-btn a-btn-ghost" onClick={() => open(a)}>Edit</button>
                    <button className="a-btn a-btn-danger" onClick={() => del(a.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}

      {editing && (
        <Modal
          title={editing.id ? 'Edit AI project' : 'Add AI project'}
          onClose={() => setEditing(null)}
          footer={
            <>
              {formErr && <span className="a-error inline">{formErr}</span>}
              <button className="a-btn a-btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
              <button className="a-btn a-btn-primary" onClick={submit} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
            </>
          }
        >
          <Field label="Title"><Text value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} /></Field>
          <Field label="Tag" hint="Small label above the title, e.g. “AI automation · live project”.">
            <Text value={editing.tag} onChange={(v) => setEditing({ ...editing, tag: v })} />
          </Field>
          <Field label="Demo / request link" hint="Optional. The “Request a demo” button links here.">
            <Text value={editing.demo} onChange={(v) => setEditing({ ...editing, demo: v })} placeholder="https://…" />
          </Field>
          <Field label="Features">
            <TagInput value={editing.features} onChange={(v) => setEditing({ ...editing, features: v })} placeholder="Add a feature, press Enter" />
          </Field>
          <div className="a-form-row">
            <Field label="Sort order"><NumberInput value={editing.sort_order} onChange={(v) => setEditing({ ...editing, sort_order: v })} /></Field>
            <Field label="Visible"><Toggle checked={editing.active} onChange={(v) => setEditing({ ...editing, active: v })} label={editing.active ? 'Shown' : 'Hidden'} /></Field>
          </div>
        </Modal>
      )}
    </div>
  )
}
