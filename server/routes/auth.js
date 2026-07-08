import { Router } from 'express'
import { checkCredentials, signToken, requireAdmin } from '../auth.js'
import { wrap, str } from '../helpers.js'

const router = Router()

// POST /api/auth/login  { username, password } -> { token }
router.post('/login', wrap(async (req, res) => {
  const username = str(req.body?.username)
  const password = String(req.body?.password ?? '')
  if (!checkCredentials(username, password)) {
    return res.status(401).json({ error: 'Invalid username or password' })
  }
  res.json({ token: signToken(username), username })
}))

// GET /api/auth/me  (verify a token is still valid)
router.get('/me', requireAdmin, (req, res) => {
  res.json({ username: req.admin.sub, role: req.admin.role })
})

export default router
