// Shared helpers for request validation & normalisation.

export const emailOk = (v) =>
  typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

export const str = (v) => (v == null ? '' : String(v)).trim()

// Coerce anything into a clean array of non-empty strings.
export const strArray = (v) => {
  if (Array.isArray(v)) return v.map((x) => str(x)).filter(Boolean)
  if (typeof v === 'string') {
    // accept comma / newline separated input from simple text fields
    return v.split(/[\n,]/).map((x) => x.trim()).filter(Boolean)
  }
  return []
}

export const asBool = (v, fallback = true) =>
  (v === undefined || v === null ? fallback : Boolean(v))

export const asInt = (v, fallback = 0) => {
  const n = Number(v)
  return Number.isFinite(n) ? Math.trunc(n) : fallback
}

// Wrap async route handlers so thrown errors reach the error middleware.
export const wrap = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)
