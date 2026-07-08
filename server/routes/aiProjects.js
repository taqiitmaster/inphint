import { Router } from 'express'
import { sql, assertDb } from '../db.js'
import { requireAdmin } from '../auth.js'
import { wrap, str, strArray, asBool, asInt } from '../helpers.js'

const router = Router()

// GET /api/ai-projects (public, active)
router.get('/', wrap(async (req, res) => {
  assertDb()
  const rows = await sql`
    SELECT id, title, tag, demo, features, sort_order
    FROM ai_projects WHERE active = TRUE
    ORDER BY sort_order ASC, id ASC`
  res.json(rows)
}))

router.get('/admin', requireAdmin, wrap(async (req, res) => {
  assertDb()
  const rows = await sql`SELECT * FROM ai_projects ORDER BY sort_order ASC, id ASC`
  res.json(rows)
}))

router.post('/admin', requireAdmin, wrap(async (req, res) => {
  assertDb()
  const b = req.body || {}
  const rows = await sql`
    INSERT INTO ai_projects (title, tag, demo, features, sort_order, active)
    VALUES (
      ${str(b.title)},
      ${str(b.tag) || null},
      ${str(b.demo) || null},
      ${JSON.stringify(strArray(b.features))}::jsonb,
      ${asInt(b.sort_order, 0)},
      ${asBool(b.active, true)}
    ) RETURNING *`
  res.status(201).json(rows[0])
}))

router.patch('/admin/:id', requireAdmin, wrap(async (req, res) => {
  assertDb()
  const id = asInt(req.params.id)
  const b = req.body || {}
  const rows = await sql`
    UPDATE ai_projects SET
      title       = ${str(b.title)},
      tag         = ${str(b.tag) || null},
      demo        = ${str(b.demo) || null},
      features    = ${JSON.stringify(strArray(b.features))}::jsonb,
      sort_order  = ${asInt(b.sort_order, 0)},
      active      = ${asBool(b.active, true)},
      updated_at  = now()
    WHERE id = ${id} RETURNING *`
  if (!rows.length) return res.status(404).json({ error: 'Not found' })
  res.json(rows[0])
}))

router.delete('/admin/:id', requireAdmin, wrap(async (req, res) => {
  assertDb()
  const id = asInt(req.params.id)
  const rows = await sql`DELETE FROM ai_projects WHERE id = ${id} RETURNING id`
  if (!rows.length) return res.status(404).json({ error: 'Not found' })
  res.json({ ok: true })
}))

export default router
