import { Router } from 'express'
import { sql, assertDb } from '../db.js'
import { requireAdmin } from '../auth.js'
import { wrap, str, strArray, asBool, asInt } from '../helpers.js'

const router = Router()

// GET /api/projects  (public, active only)
router.get('/', wrap(async (req, res) => {
  assertDb()
  const rows = await sql`
    SELECT id, title, image, url, categories, sort_order
    FROM projects WHERE active = TRUE
    ORDER BY sort_order ASC, id ASC`
  res.json(rows)
}))

// GET /api/admin/projects  (all)
router.get('/admin', requireAdmin, wrap(async (req, res) => {
  assertDb()
  const rows = await sql`SELECT * FROM projects ORDER BY sort_order ASC, id ASC`
  res.json(rows)
}))

router.post('/admin', requireAdmin, wrap(async (req, res) => {
  assertDb()
  const b = req.body || {}
  const rows = await sql`
    INSERT INTO projects (title, image, url, categories, sort_order, active)
    VALUES (
      ${str(b.title)},
      ${str(b.image) || null},
      ${str(b.url) || null},
      ${JSON.stringify(strArray(b.categories))}::jsonb,
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
    UPDATE projects SET
      title       = ${str(b.title)},
      image       = ${str(b.image) || null},
      url         = ${str(b.url) || null},
      categories  = ${JSON.stringify(strArray(b.categories))}::jsonb,
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
  const rows = await sql`DELETE FROM projects WHERE id = ${id} RETURNING id`
  if (!rows.length) return res.status(404).json({ error: 'Not found' })
  res.json({ ok: true })
}))

export default router
