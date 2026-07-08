import { useCallback, useEffect, useState } from 'react'

// Generic CRUD state for a resource ({ list, create, update, remove }).
export function useResource(resource) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    setLoading(true); setError('')
    try { setItems(await resource.list()) }
    catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }, [resource])

  useEffect(() => { refresh() }, [refresh])

  const save = async (id, payload) => {
    if (id) await resource.update(id, payload)
    else await resource.create(payload)
    await refresh()
  }
  const remove = async (id) => { await resource.remove(id); await refresh() }

  return { items, loading, error, refresh, save, remove }
}

export function Field({ label, children, hint }) {
  return (
    <label className="af">
      <span className="af-label">{label}</span>
      {children}
      {hint && <span className="af-hint">{hint}</span>}
    </label>
  )
}

export function Text({ value, onChange, ...rest }) {
  return <input className="a-input" value={value ?? ''} onChange={(e) => onChange(e.target.value)} {...rest} />
}

export function TextArea({ value, onChange, ...rest }) {
  return <textarea className="a-input a-textarea" value={value ?? ''} onChange={(e) => onChange(e.target.value)} {...rest} />
}

export function NumberInput({ value, onChange }) {
  return <input type="number" className="a-input" value={value ?? 0} onChange={(e) => onChange(Number(e.target.value))} />
}

export function Toggle({ checked, onChange, label }) {
  return (
    <button type="button" className={`a-toggle${checked ? ' on' : ''}`} onClick={() => onChange(!checked)}>
      <span className="knob" />{label}
    </button>
  )
}

// Tag input: array of strings edited via Enter / comma, with removable pills.
export function TagInput({ value = [], onChange, placeholder }) {
  const [draft, setDraft] = useState('')
  const add = () => {
    const parts = draft.split(',').map((s) => s.trim()).filter(Boolean)
    if (parts.length) onChange([...value, ...parts])
    setDraft('')
  }
  return (
    <div className="a-tags">
      <div className="a-tags-list">
        {value.map((t, i) => (
          <span className="a-tag" key={`${t}-${i}`}>
            {t}
            <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))}>×</button>
          </span>
        ))}
      </div>
      <input
        className="a-input"
        value={draft}
        placeholder={placeholder || 'Type and press Enter'}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add() } }}
        onBlur={add}
      />
    </div>
  )
}

export function Modal({ title, onClose, children, footer }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  return (
    <div className="a-modal-back" onMouseDown={onClose}>
      <div className="a-modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="a-modal-head">
          <h3>{title}</h3>
          <button className="a-x" onClick={onClose}>✕</button>
        </div>
        <div className="a-modal-body">{children}</div>
        {footer && <div className="a-modal-foot">{footer}</div>}
      </div>
    </div>
  )
}

export function EmptyState({ children }) {
  return <div className="a-empty">{children}</div>
}
