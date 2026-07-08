import 'dotenv/config'
import { sql } from './db.js'
import { mailerEnabled } from './mailer.js'
import app from './app.js'

// Local development and traditional Node hosts (Render, Railway, a VPS, …).
// On Vercel this file is NOT used — see api/index.js.
const PORT = Number(process.env.PORT) || 3001

app.listen(PORT, () => {
  console.log(`\n  Inphint API  →  http://localhost:${PORT}`)
  console.log(`  Database     →  ${sql ? 'connected via DATABASE_URL' : 'NOT configured (set DATABASE_URL in .env)'}`)
  console.log(`  Email notify →  ${mailerEnabled() ? 'enabled' : 'disabled (optional)'}\n`)
})
