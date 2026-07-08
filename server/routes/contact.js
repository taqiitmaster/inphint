import { Router } from 'express'
import { sql, assertDb } from '../db.js'
import { requireAdmin } from '../auth.js'
import { notifyNewEnquiry } from '../mailer.js'
import { wrap, str, emailOk, asInt } from '../helpers.js'

const router = Router()

// ── Public: submit the contact form ─────────────────────────
// POST /api/contact
router.post('/', wrap(async (req, res) => {
  assertDb()
  const name = str(req.body?.name)
  const email = str(req.body?.email)
  const phone = str(req.body?.phone)
  const service = str(req.body?.service)
  const budget = str(req.body?.budget)
  const message = str(req.body?.msg ?? req.body?.message)

  const errors = {}
  if (!name) errors.name = 'Please add your name'
  if (!emailOk(email)) errors.email = 'Enter a valid email'
  if (!service) errors.service = 'Pick a service'
  if (!budget) errors.budget = 'Pick an option'
  if (!message) errors.msg = 'A sentence or two helps'
  if (Object.keys(errors).length) {
    return res.status(422).json({ error: 'Validation failed', errors })
  }

  const rows = await sql`
    INSERT INTO contact_submissions (name, email, phone, service, budget, message)
    VALUES (${name}, ${email}, ${phone || null}, ${service}, ${budget}, ${message})
    RETURNING id, created_at`

  // Best-effort email — never blocks the response.
  notifyNewEnquiry({ name, email, phone, service, budget, message })

  res.status(201).json({ ok: true, id: rows[0].id })
}))

// ── Admin: list submissions ─────────────────────────────────
// GET /api/admin/contacts?status=new
router.get('/admin', requireAdmin, wrap(async (req, res) => {
  assertDb()
  const status = str(req.query.status)
  const rows = status
    ? await sql`SELECT * FROM contact_submissions WHERE status = ${status} ORDER BY created_at DESC`
    : await sql`SELECT * FROM contact_submissions ORDER BY created_at DESC`
  res.json(rows)
}))

// PATCH /api/admin/contacts/:id   { status }
router.patch('/admin/:id', requireAdmin, wrap(async (req, res) => {
  assertDb()
  const id = asInt(req.params.id)
  const status = str(req.body?.status)
  if (!['new', 'read', 'archived'].includes(status)) {
    return res.status(422).json({ error: 'Invalid status' })
  }
  const rows = await sql`
    UPDATE contact_submissions SET status = ${status} WHERE id = ${id} RETURNING *`
  if (!rows.length) return res.status(404).json({ error: 'Not found' })
  res.json(rows[0])
}))

// DELETE /api/admin/contacts/:id
router.delete('/admin/:id', requireAdmin, wrap(async (req, res) => {
  assertDb()
  const id = asInt(req.params.id)
  const rows = await sql`DELETE FROM contact_submissions WHERE id = ${id} RETURNING id`
  if (!rows.length) return res.status(404).json({ error: 'Not found' })
  res.json({ ok: true })
}))

export default router
