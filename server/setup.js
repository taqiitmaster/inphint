import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { sql } from './db.js'
import { SERVICES, AI_CHIPS, AI_PROJECTS, PROJECTS } from '../src/data.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

if (!sql) {
  console.error('Cannot run setup: DATABASE_URL is not set. Add it to .env first.')
  process.exit(1)
}

// Run a raw (non-parameterised) SQL string through the Neon HTTP driver.
function raw(text) {
  const a = [text]; a.raw = [text]
  return sql(a)
}

async function createTables() {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8')
  const statements = schema
    .split(';')
    .map((s) => s.replace(/--.*$/gm, '').trim())   // strip line comments
    .filter(Boolean)
  for (const stmt of statements) await raw(stmt)
  console.log(`✓ Schema ready (${statements.length} statements executed)`)
}

async function seed() {
  // Only seed tables that are currently empty, so re-running is safe.
  const [{ count: sCount }] = await sql`SELECT count(*)::int AS count FROM services`
  if (sCount === 0) {
    let i = 0
    for (const s of SERVICES) {
      await sql`
        INSERT INTO services (label, title, description, sub, icon, sort_order)
        VALUES (${s.lab || null}, ${s.t}, ${s.d || null},
                ${JSON.stringify(s.sub || [])}::jsonb, ${s.icon || null}, ${i++})`
    }
    console.log(`✓ Seeded ${SERVICES.length} services`)
  } else console.log('• services already has rows — skipped')

  const [{ count: cCount }] = await sql`SELECT count(*)::int AS count FROM ai_chips`
  if (cCount === 0) {
    let i = 0
    for (const label of AI_CHIPS) {
      await sql`INSERT INTO ai_chips (label, hot, sort_order) VALUES (${label}, FALSE, ${i++})`
    }
    // the highlighted flagship chip shown in the design
    await sql`INSERT INTO ai_chips (label, hot, sort_order) VALUES ('Custom AI automation', TRUE, ${i})`
    console.log(`✓ Seeded ${AI_CHIPS.length + 1} AI chips`)
  } else console.log('• ai_chips already has rows — skipped')

  const [{ count: pCount }] = await sql`SELECT count(*)::int AS count FROM projects`
  if (pCount === 0) {
    let i = 0
    for (const p of PROJECTS) {
      await sql`
        INSERT INTO projects (title, image, url, categories, sort_order)
        VALUES (${p.t}, ${p.img || null}, ${p.url || null},
                ${JSON.stringify(p.cats || [])}::jsonb, ${i++})`
    }
    console.log(`✓ Seeded ${PROJECTS.length} projects`)
  } else console.log('• projects already has rows — skipped')

  const [{ count: aCount }] = await sql`SELECT count(*)::int AS count FROM ai_projects`
  if (aCount === 0) {
    let i = 0
    for (const a of AI_PROJECTS) {
      await sql`
        INSERT INTO ai_projects (title, tag, demo, features, sort_order)
        VALUES (${a.title}, ${a.tag || null}, ${a.demo || null},
                ${JSON.stringify(a.features || [])}::jsonb, ${i++})`
    }
    console.log(`✓ Seeded ${AI_PROJECTS.length} AI projects`)
  } else console.log('• ai_projects already has rows — skipped')
}

async function main() {
  const doSeed = process.argv.includes('--seed')
  console.log('Setting up Inphint database…\n')
  await createTables()
  if (doSeed) { console.log(''); await seed() }
  console.log('\nDone.')
  process.exit(0)
}

main().catch((err) => {
  console.error('\nSetup failed:', err.message)
  process.exit(1)
})
