import 'dotenv/config'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const SECRET = process.env.JWT_SECRET || 'change-me-in-production'
const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASS = process.env.ADMIN_PASSWORD || ''            // plain (dev)
const ADMIN_HASH = process.env.ADMIN_PASSWORD_HASH || ''       // bcrypt (preferred)

if (!ADMIN_PASS && !ADMIN_HASH) {
  console.warn('[auth] No ADMIN_PASSWORD or ADMIN_PASSWORD_HASH set — admin login is disabled until you set one in .env')
}

// Verify a submitted username/password against the configured admin credentials.
export function checkCredentials(username, password) {
  if (username !== ADMIN_USER) return false
  if (ADMIN_HASH) return bcrypt.compareSync(password || '', ADMIN_HASH)
  if (ADMIN_PASS) return password === ADMIN_PASS
  return false
}

export function signToken(username) {
  return jwt.sign({ sub: username, role: 'admin' }, SECRET, { expiresIn: '7d' })
}

export function verifyToken(token) {
  try { return jwt.verify(token, SECRET) } catch { return null }
}

// Express middleware — protects admin routes.
export function requireAdmin(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  const payload = token && verifyToken(token)
  if (!payload || payload.role !== 'admin') {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  req.admin = payload
  next()
}
