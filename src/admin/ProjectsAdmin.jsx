import { useState } from 'react'
import { adminApi } from '../api'
import { useResource, Modal, Field, Text, NumberInput, Toggle, EmptyState } from './ui'

const CATS = [['ai', 'AI automation'], ['web', 'Web'], ['brand', 'Branding'], ['mktg', 'Marketing']]
const blank = { title: '', image: '', url: '', categories: [], sort_order: 0, active: true }

const imgSrc = (image) => {
  if (!image) return ''
  if (/^https?:\/\//i.test(image) || image.startsWith('/')) return image
  return `/assets/${image}.webp`
}

export default function ProjectsAdmin() {
  const { items, loading, error, save, remove } = useResource(adminApi.projects)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [formErr, setFormErr] = useState('')

  const open = (item) => { setFormErr(''); setEditing(item ? { ...item, categories: item.categories || [] } : { ...blank }) }
  const toggleCat = (key) => {
    const has = editing.categories.includes(key)
    setEditing({ ...editing, categories: has ? editing.categories.filter((c) => c !== key) : [...editing.categories, key] })
  }
  const submit = async () => {
    if (!editing.title?.trim()) { setFormErr('Title is required'); return }
    setSaving(true); setFormErr('')
    try { await save(editing.id, editing); setEditing(null) }
    catch (e) { setFormErr(e.message) }
    finally { setSaving(false) }
  }
  const del = async (id) => { if (window.confirm('Delete this project?')) await remove(id) }

  return (
    <div>
      <div className="a-panel-head">
        <div>
          <h2>Projects</h2>
          <p className="a-muted">The client work grid in the “Selected work” section.</p>
        </div>
        <button className="a-btn a-btn-primary" onClick={() => open(null)}>+ Add project</button>
      </div>

      {error && <div className="a-error">{error}</div>}
      {loading ? <div className="a-muted">Loading…</div>
        : items.length === 0 ? <EmptyState>No projects yet.</EmptyState>
          : (
            <div className="a-proj-grid">
              {items.map((p) => (
                <div className={`a-proj${p.active ? '' : ' inactive'}`} key={p.id}>
                  <div className="a-proj-thumb">
                    {p.image ? <img src={imgSrc(p.image)} alt={p.title} loading="lazy" /> : <span className="a-noimg">No image</span>}
                    {!p.active && <span className="a-pill p-off">hidden</span>}
                  </div>
                  <div className="a-proj-body">
                    <h4>{p.title}</h4>
                    <div className="a-chips-mini">{(p.categories || []).map((c) => <span key={c}>{c}</span>)}</div>
                    <div className="a-card-actions">
                      <span className="a-order">#{p.sort_order}</span>
                      <button className="a-btn a-btn-ghost" onClick={() => open(p)}>Edit</button>
                      <button className="a-btn a-btn-danger" onClick={() => del(p.id)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

      {editing && (
        <Modal
          title={editing.id ? 'Edit project' : 'Add project'}
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
          <Field label="Image" hint="An asset name (e.g. “tycoon” → /assets/tycoon.webp) or a full https:// image URL.">
            <Text value={editing.image} onChange={(v) => setEditing({ ...editing, image: v })} placeholder="tycoon  or  https://…" />
          </Field>
          {editing.image && (
            <div className="a-preview"><img src={imgSrc(editing.image)} alt="preview" onError={(e) => { e.currentTarget.style.display = 'none' }} /></div>
          )}
          <Field label="Website URL" hint="Optional. Leave blank for branding-only projects.">
            <Text value={editing.url} onChange={(v) => setEditing({ ...editing, url: v })} placeholder="https://…" />
          </Field>
          <Field label="Categories">
            <div className="a-cat-picker">
              {CATS.map(([key, label]) => (
                <button type="button" key={key} className={`a-cat${editing.categories.includes(key) ? ' on' : ''}`} onClick={() => toggleCat(key)}>{label}</button>
              ))}
            </div>
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
