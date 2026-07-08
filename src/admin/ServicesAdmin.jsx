import { useState } from 'react'
import { adminApi } from '../api'
import { useResource, Modal, Field, Text, TextArea, TagInput, NumberInput, Toggle, EmptyState } from './ui'

const blank = { label: '', title: '', description: '', sub: [], icon: '', sort_order: 0, active: true }

export default function ServicesAdmin() {
  const { items, loading, error, save, remove } = useResource(adminApi.services)
  const [editing, setEditing] = useState(null) // object being edited/created
  const [saving, setSaving] = useState(false)
  const [formErr, setFormErr] = useState('')

  const open = (item) => { setFormErr(''); setEditing(item ? { ...item, sub: item.sub || [] } : { ...blank }) }

  const submit = async () => {
    if (!editing.title?.trim()) { setFormErr('Title is required'); return }
    setSaving(true); setFormErr('')
    try { await save(editing.id, editing); setEditing(null) }
    catch (e) { setFormErr(e.message) }
    finally { setSaving(false) }
  }
  const del = async (id) => { if (window.confirm('Delete this service?')) await remove(id) }

  return (
    <div>
      <div className="a-panel-head">
        <div>
          <h2>Services</h2>
          <p className="a-muted">The cards shown in the “What we do” grid.</p>
        </div>
        <button className="a-btn a-btn-primary" onClick={() => open(null)}>+ Add service</button>
      </div>

      {error && <div className="a-error">{error}</div>}
      {loading ? <div className="a-muted">Loading…</div>
        : items.length === 0 ? <EmptyState>No services yet. Add your first one.</EmptyState>
          : (
            <div className="a-cards">
              {items.map((s) => (
                <div className={`a-card${s.active ? '' : ' inactive'}`} key={s.id}>
                  <div className="a-card-top">
                    <div>
                      {s.label && <span className="a-kicker">{s.label}</span>}
                      <h4>{s.title}</h4>
                    </div>
                    {!s.active && <span className="a-pill p-off">hidden</span>}
                  </div>
                  <p className="a-card-desc">{s.description}</p>
                  <div className="a-chips-mini">{(s.sub || []).map((x) => <span key={x}>{x}</span>)}</div>
                  <div className="a-card-actions">
                    <span className="a-order">#{s.sort_order}</span>
                    <button className="a-btn a-btn-ghost" onClick={() => open(s)}>Edit</button>
                    <button className="a-btn a-btn-danger" onClick={() => del(s.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}

      {editing && (
        <Modal
          title={editing.id ? 'Edit service' : 'Add service'}
          onClose={() => setEditing(null)}
          footer={
            <>
              {formErr && <span className="a-error inline">{formErr}</span>}
              <button className="a-btn a-btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
              <button className="a-btn a-btn-primary" onClick={submit} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
            </>
          }
        >
          <Field label="Kicker / label" hint="Small word above the title, e.g. “Build”.">
            <Text value={editing.label} onChange={(v) => setEditing({ ...editing, label: v })} />
          </Field>
          <Field label="Title">
            <Text value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} />
          </Field>
          <Field label="Description">
            <TextArea value={editing.description} onChange={(v) => setEditing({ ...editing, description: v })} />
          </Field>
          <Field label="Tags" hint="Small pills under the description.">
            <TagInput value={editing.sub} onChange={(v) => setEditing({ ...editing, sub: v })} placeholder="Add a tag, press Enter" />
          </Field>
          <Field label="Icon (SVG inner markup)" hint="Optional. Paths inside a 24×24 viewBox, e.g. <path d='…'/>.">
            <TextArea value={editing.icon} onChange={(v) => setEditing({ ...editing, icon: v })} rows={2} />
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
