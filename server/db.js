import 'dotenv/config'
import { neon } from '@neondatabase/serverless'

const url = process.env.DATABASE_URL
if (!url) {
  console.error(
    '\n[db] DATABASE_URL is not set.\n' +
    '    1. Create a project at https://neon.tech (or use an existing one)\n' +
    '    2. Copy the "Pooled" connection string from the Neon dashboard\n' +
    '    3. Put it in a .env file at the project root:\n' +
    '       DATABASE_URL="postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/dbname?sslmode=require"\n',
  )
}

// Neon serverless HTTP driver. `sql` is a tagged-template function that
// parameterises every interpolated value automatically (SQL-injection safe).
export const sql = url ? neon(url) : null

export function assertDb() {
  if (!sql) {
    const err = new Error('Database not configured (DATABASE_URL missing).')
    err.status = 503
    throw err
  }
}
