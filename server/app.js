import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'

import { sql } from './db.js'
import { mailerEnabled } from './mailer.js'
import authRouter from './routes/auth.js'
import contactRouter from './routes/contact.js'
import servicesRouter from './routes/services.js'
import projectsRouter from './routes/projects.js'
import aiProjectsRouter from './routes/aiProjects.js'
import aiChipsRouter from './routes/aiChips.js'
import chatRouter from './routes/chat.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const app = express()
app.use(cors())
app.use(express.json({ limit: '1mb' }))

// ── Health check ────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ ok: true, db: Boolean(sql), email: mailerEnabled() })
})

// ── API routes ──────────────────────────────────────────────
app.use('/api/auth', authRouter)
app.use('/api/contact', contactRouter)
app.use('/api/services', servicesRouter)
app.use('/api/projects', projectsRouter)
app.use('/api/ai-projects', aiProjectsRouter)
app.use('/api/ai-chips', aiChipsRouter)
app.use('/api/chat', chatRouter)

// Unknown API route -> JSON 404 (so the SPA fallback never swallows it)
app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }))

// ── Serve the built frontend (local / Node hosts like Render) ───
// On Vercel the static site + SPA routing are handled by vercel.json, and this
// function only ever receives /api/* requests, so we skip static serving there.
if (!process.env.VERCEL) {
  const dist = path.join(ROOT, 'dist')
  if (fs.existsSync(dist)) {
    app.use(express.static(dist))
    app.get('*', (req, res) => res.sendFile(path.join(dist, 'index.html')))
  } else {
    app.get('/', (req, res) =>
      res.type('text').send('API is running. Run `npm run build` then `npm start`, or use `npm run dev:all` for development.'))
  }
}

// ── Error handler ───────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || 500
  if (status >= 500) console.error('[error]', err)
  res.status(status).json({ error: err.message || 'Server error' })
})

export default app
