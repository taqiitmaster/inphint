import { useState } from 'react'
import { adminApi } from '../api'
import { useResource, Modal, Field, Text, NumberInput, Toggle, EmptyState } from './ui'

const blank = { label: '', hot: false, sort_order: 0, active: true }

export default function ChipsAdmin() {
  const { items, loading, error, save, remove } = useResource(adminApi.aiChips)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [formErr, setFormErr] = useState('')

  const open = (item) => { setFormErr(''); setEditing(item ? { ...item } : { ...blank }) }
  const submit = async () => {
    if (!editing.label?.trim()) { setFormErr('Label is required'); return }
    setSaving(true); setFormErr('')
    try { await save(editing.id, editing); setEditing(null) }
    catch (e) { setFormErr(e.message) }
    finally { setSaving(false) }
  }
  const del = async (id) => { if (window.confirm('Delete this chip?')) await remove(id) }

  return (
    <div>
      <div className="a-panel-head">
        <div>
          <h2>AI automation chips</h2>
          <p className="a-muted">The capability pills inside the flagship AI block.</p>
        </div>
        <button className="a-btn a-btn-primary" onClick={() => open(null)}>+ Add chip</button>
      </div>

      {error && <div className="a-error">{error}</div>}
      {loading ? <div className="a-muted">Loading…</div>
        : items.length === 0 ? <EmptyState>No chips yet.</EmptyState>
          : (
            <div className="a-chip-rows">
              {items.map((c) => (
                <div className={`a-chip-row${c.active ? '' : ' inactive'}`} key={c.id}>
                  <span className={`a-chip-pill${c.hot ? ' hot' : ''}`}>{c.label}</span>
                  <span className="a-order">#{c.sort_order}</span>
                  {c.hot && <span className="a-pill p-hot">highlighted</span>}
                  {!c.active && <span className="a-pill p-off">hidden</span>}
                  <div className="a-spacer" />
                  <button className="a-btn a-btn-ghost" onClick={() => open(c)}>Edit</button>
                  <button className="a-btn a-btn-danger" onClick={() => del(c.id)}>Delete</button>
                </div>
              ))}
            </div>
          )}

      {editing && (
        <Modal
          title={editing.id ? 'Edit chip' : 'Add chip'}
          onClose={() => setEditing(null)}
          footer={
            <>
              {formErr && <span className="a-error inline">{formErr}</span>}
              <button className="a-btn a-btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
              <button className="a-btn a-btn-primary" onClick={submit} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
            </>
          }
        >
          <Field label="Label"><Text value={editing.label} onChange={(v) => setEditing({ ...editing, label: v })} /></Field>
          <div className="a-form-row">
            <Field label="Sort order"><NumberInput value={editing.sort_order} onChange={(v) => setEditing({ ...editing, sort_order: v })} /></Field>
            <Field label="Highlighted"><Toggle checked={editing.hot} onChange={(v) => setEditing({ ...editing, hot: v })} label={editing.hot ? 'Yes' : 'No'} /></Field>
            <Field label="Visible"><Toggle checked={editing.active} onChange={(v) => setEditing({ ...editing, active: v })} label={editing.active ? 'Shown' : 'Hidden'} /></Field>
          </div>
        </Modal>
      )}
    </div>
  )
}
