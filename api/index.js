// Vercel serverless entry point.
// Vercel routes every /api/* request here (see vercel.json) and runs the
// Express app as a serverless function. Local dev / other hosts use
// server/index.js instead.
import app from '../server/app.js'

export default app
