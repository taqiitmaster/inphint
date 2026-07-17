import { Router } from 'express'
import { randomUUID } from 'node:crypto'
import { wrap, str, asInt } from '../helpers.js'
import { sql } from '../db.js'
import { requireAdmin } from '../auth.js'
import { SYSTEM } from '../../src/data.js'

const router = Router()

const GEMINI_KEY = process.env.GEMINI_API_KEY
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash'
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

if (!GEMINI_KEY) {
  console.warn('[chat] GEMINI_API_KEY is not set — the Inphox chatbot will use its offline fallback replies only.')
}

// ── Very small per-IP rate limit (protects the API key from abuse) ──
const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 15
const hits = new Map() // ip -> [timestamps]

function rateLimited(ip) {
  const now = Date.now()
  const arr = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS)
  arr.push(now)
  hits.set(ip, arr)
  return arr.length > MAX_PER_WINDOW
}

// Best-effort save of the full conversation so far. Never throws —
// a storage hiccup should never block a reply reaching the visitor.
async function saveConversation(sessionId, messages) {
  if (!sql || !sessionId) return
  try {
    await sql`
      INSERT INTO chat_conversations (session_id, messages, message_count, updated_at)
      VALUES (${sessionId}, ${JSON.stringify(messages)}::jsonb, ${messages.length}, now())
      ON CONFLICT (session_id) DO UPDATE SET
        messages = ${JSON.stringify(messages)}::jsonb,
        message_count = ${messages.length},
        updated_at = now()`
  } catch (err) {
    console.error('[chat] failed to save conversation:', err.message)
  }
}

// ── Public: send a message, get a reply ─────────────────────
// Body: { sessionId?: string, messages: [{role:'user'|'assistant', content}] }
router.post('/', wrap(async (req, res) => {
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown'
  if (rateLimited(ip)) {
    return res.status(429).json({ error: 'Too many messages — please wait a moment and try again.' })
  }

  const messages = Array.isArray(req.body?.messages) ? req.body.messages : []
  if (!messages.length) {
    return res.status(422).json({ error: 'No message provided.' })
  }
  const sessionId = str(req.body?.sessionId) || randomUUID()

  if (!GEMINI_KEY) {
    const err = new Error('Chat is not configured (GEMINI_API_KEY missing).')
    err.status = 503
    throw err
  }

  // Keep the request to Gemini small: last 12 turns, trimmed.
  const trimmed = messages.slice(-12).map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: str(m.content).slice(0, 4000) }],
  }))

  const body = {
    contents: trimmed,
    systemInstruction: { parts: [{ text: SYSTEM }] },
    generationConfig: { maxOutputTokens: 400, temperature: 0.6 },
  }

  const upstream = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': GEMINI_KEY },
    body: JSON.stringify(body),
  })

  if (!upstream.ok) {
    const detail = await upstream.text().catch(() => '')
    console.error('[chat] Gemini error', upstream.status, detail.slice(0, 300))
    const err = new Error('The assistant is temporarily unavailable.')
    err.status = 502
    throw err
  }

  const data = await upstream.json()
  const reply = data?.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('').trim()

  if (!reply) {
    const err = new Error('The assistant is temporarily unavailable.')
    err.status = 502
    throw err
  }

  // Save the full conversation (fire-and-forget — doesn't delay the reply).
  const fullConvo = [
    ...messages.map((m) => ({ role: m.role, content: str(m.content), at: m.at || new Date().toISOString() })),
    { role: 'assistant', content: reply, at: new Date().toISOString() },
  ]
  saveConversation(sessionId, fullConvo)

  res.json({ reply, sessionId })
}))

// ── Admin: view saved conversations ─────────────────────────
// GET /api/chat/admin  — list, newest first, with a short preview
router.get('/admin', requireAdmin, wrap(async (req, res) => {
  if (!sql) return res.json([])
  const rows = await sql`
    SELECT id, session_id, message_count, created_at, updated_at,
           LEFT(messages->0->>'content', 140) AS preview
    FROM chat_conversations
    ORDER BY updated_at DESC
    LIMIT 200`
  res.json(rows)
}))

// GET /api/chat/admin/:id  — full transcript
router.get('/admin/:id', requireAdmin, wrap(async (req, res) => {
  if (!sql) return res.status(404).json({ error: 'Not found' })
  const id = asInt(req.params.id)
  const rows = await sql`SELECT * FROM chat_conversations WHERE id = ${id}`
  if (!rows.length) return res.status(404).json({ error: 'Not found' })
  res.json(rows[0])
}))

// DELETE /api/chat/admin/:id
router.delete('/admin/:id', requireAdmin, wrap(async (req, res) => {
  if (!sql) return res.status(404).json({ error: 'Not found' })
  const id = asInt(req.params.id)
  const rows = await sql`DELETE FROM chat_conversations WHERE id = ${id} RETURNING id`
  if (!rows.length) return res.status(404).json({ error: 'Not found' })
  res.json({ ok: true })
}))

export default router
