import { Router } from 'express'
import { sql, assertDb } from '../db.js'
import { requireAdmin } from '../auth.js'
import { wrap, str, asBool, asInt } from '../helpers.js'

const router = Router()

// GET /api/ai-chips (public, active)
router.get('/', wrap(async (req, res) => {
  assertDb()
  const rows = await sql`
    SELECT id, label, hot, sort_order FROM ai_chips WHERE active = TRUE
    ORDER BY sort_order ASC, id ASC`
  res.json(rows)
}))

router.get('/admin', requireAdmin, wrap(async (req, res) => {
  assertDb()
  const rows = await sql`SELECT * FROM ai_chips ORDER BY sort_order ASC, id ASC`
  res.json(rows)
}))

router.post('/admin', requireAdmin, wrap(async (req, res) => {
  assertDb()
  const b = req.body || {}
  const rows = await sql`
    INSERT INTO ai_chips (label, hot, sort_order, active)
    VALUES (${str(b.label)}, ${asBool(b.hot, false)}, ${asInt(b.sort_order, 0)}, ${asBool(b.active, true)})
    RETURNING *`
  res.status(201).json(rows[0])
}))

router.patch('/admin/:id', requireAdmin, wrap(async (req, res) => {
  assertDb()
  const id = asInt(req.params.id)
  const b = req.body || {}
  const rows = await sql`
    UPDATE ai_chips SET
      label = ${str(b.label)},
      hot = ${asBool(b.hot, false)},
      sort_order = ${asInt(b.sort_order, 0)},
      active = ${asBool(b.active, true)}
    WHERE id = ${id} RETURNING *`
  if (!rows.length) return res.status(404).json({ error: 'Not found' })
  res.json(rows[0])
}))

router.delete('/admin/:id', requireAdmin, wrap(async (req, res) => {
  assertDb()
  const id = asInt(req.params.id)
  const rows = await sql`DELETE FROM ai_chips WHERE id = ${id} RETURNING id`
  if (!rows.length) return res.status(404).json({ error: 'Not found' })
  res.json({ ok: true })
}))

export default router
