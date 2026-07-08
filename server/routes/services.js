import { Router } from 'express'
import { sql, assertDb } from '../db.js'
import { requireAdmin } from '../auth.js'
import { wrap, str, strArray, asBool, asInt } from '../helpers.js'

const router = Router()

// ── Public: active services for the site ────────────────────
// GET /api/services
router.get('/', wrap(async (req, res) => {
  assertDb()
  const rows = await sql`
    SELECT id, label, title, description, sub, icon, sort_order
    FROM services WHERE active = TRUE
    ORDER BY sort_order ASC, id ASC`
  res.json(rows)
}))

// ── Admin: full list (incl. inactive) ───────────────────────
router.get('/admin', requireAdmin, wrap(async (req, res) => {
  assertDb()
  const rows = await sql`SELECT * FROM services ORDER BY sort_order ASC, id ASC`
  res.json(rows)
}))

// Create
router.post('/admin', requireAdmin, wrap(async (req, res) => {
  assertDb()
  const b = req.body || {}
  const rows = await sql`
    INSERT INTO services (label, title, description, sub, icon, sort_order, active)
    VALUES (
      ${str(b.label) || null},
      ${str(b.title)},
      ${str(b.description) || null},
      ${JSON.stringify(strArray(b.sub))}::jsonb,
      ${str(b.icon) || null},
      ${asInt(b.sort_order, 0)},
      ${asBool(b.active, true)}
    ) RETURNING *`
  res.status(201).json(rows[0])
}))

// Update (full row)
router.patch('/admin/:id', requireAdmin, wrap(async (req, res) => {
  assertDb()
  const id = asInt(req.params.id)
  const b = req.body || {}
  const rows = await sql`
    UPDATE services SET
      label       = ${str(b.label) || null},
      title       = ${str(b.title)},
      description  = ${str(b.description) || null},
      sub         = ${JSON.stringify(strArray(b.sub))}::jsonb,
      icon        = ${str(b.icon) || null},
      sort_order  = ${asInt(b.sort_order, 0)},
      active      = ${asBool(b.active, true)},
      updated_at  = now()
    WHERE id = ${id} RETURNING *`
  if (!rows.length) return res.status(404).json({ error: 'Not found' })
  res.json(rows[0])
}))

// Delete
router.delete('/admin/:id', requireAdmin, wrap(async (req, res) => {
  assertDb()
  const id = asInt(req.params.id)
  const rows = await sql`DELETE FROM services WHERE id = ${id} RETURNING id`
  if (!rows.length) return res.status(404).json({ error: 'Not found' })
  res.json({ ok: true })
}))

export default router
