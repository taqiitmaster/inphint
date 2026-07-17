# Inphint — React (Vite) + Neon backend

The Inphint marketing site, now a full-stack app:

- **Frontend** — the same React (Vite) site, with the **Services** and **Selected work** sections loaded dynamically from the database.
- **Backend** — a small Express API backed by **Neon** (serverless Postgres) that stores contact-form enquiries and powers the dynamic content.
- **Admin panel** at **`/admin`** — a password-protected dashboard where the client manages enquiries, services, AI chips, projects and AI projects on their own.

---

## 1. Prerequisites

- Node 18+ (tested on Node 22)
- A free Neon database — https://neon.tech

## 2. Install

```bash
npm install
```

## 3. Configure environment

```bash
cp .env.example .env
```

Then edit `.env`:

- **`DATABASE_URL`** — paste the **Pooled** connection string from your Neon dashboard
  (Connection Details → the host contains `-pooler`). Keep `?sslmode=require`.
- **`ADMIN_USERNAME` / `ADMIN_PASSWORD`** — the login for `/admin`.
- **`JWT_SECRET`** — any long random string (signs admin login tokens).
- **SMTP_* / NOTIFY_TO** *(optional)* — set these to also get an email on every new enquiry.
  If left blank, enquiries are still saved to the database.
- **`GEMINI_API_KEY`** *(optional but recommended)* — powers the real-time Inphox chatbot.
  Get a free key at https://aistudio.google.com/apikey. Without it, Inphox still replies using
  its built-in keyword fallback, so the widget never breaks — it's just less conversational.

## 4. Create tables + seed initial content

```bash
npm run db:setup      # creates the tables
npm run db:seed       # creates tables AND seeds current services/projects/etc.
```

`db:seed` only fills tables that are empty, so it is safe to re-run.

## 5. Run

**Development** (frontend + API together, with hot reload):

```bash
npm run dev:all       # site on http://localhost:5173, API on http://localhost:3001
```

Vite proxies `/api` to the API automatically, so everything is same-origin.

You can also run them separately: `npm run dev` (site) and `npm run dev:server` (API).

**Production** (one server serves the built site *and* the API):

```bash
npm run build         # builds the site into dist/
npm start             # serves dist/ + the API on http://localhost:3001
```

---

## Admin panel

Open **`/admin`** (e.g. `http://localhost:5173/admin` in dev, or `/admin` on your deployed site)
and sign in with the credentials from `.env`. Tabs:

- **Enquiries** — every contact-form submission. Mark read / archive / delete, filter by status.
- **Services** — the cards in the “What we do” grid (title, description, tags, icon, order, show/hide).
- **AI chips** — the capability pills inside the flagship AI-automation block.
- **Projects** — the client-work grid. Image can be an existing asset name (e.g. `tycoon`) or a full
  `https://` image URL; pick categories, set a website link, reorder, or hide.
- **AI projects** — the AI showcase cards above the work grid.

Changes are live on the site immediately (the site fetches this content from the API on load).
If the API/database is ever unreachable, the site falls back to the built-in content in `src/data.js`,
so it never renders empty.

---

## API reference

Public:

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/contact` | Submit the contact form |
| POST | `/api/chat` | Send a message to Inphox (Gemini-powered) |
| GET | `/api/services` | Active services |
| GET | `/api/ai-chips` | Active AI chips |
| GET | `/api/projects` | Active projects |
| GET | `/api/ai-projects` | Active AI projects |

Auth:

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/auth/login` | `{username,password}` → `{token}` |
| GET | `/api/auth/me` | Verify a token |

Admin (all require `Authorization: Bearer <token>`):

| Method | Path |
|--------|------|
| GET / PATCH / DELETE | `/api/contact/admin`, `/api/contact/admin/:id` |
| GET / POST / PATCH / DELETE | `/api/services/admin`, `/api/services/admin/:id` |
| GET / POST / PATCH / DELETE | `/api/ai-chips/admin`, `/api/ai-chips/admin/:id` |
| GET / POST / PATCH / DELETE | `/api/projects/admin`, `/api/projects/admin/:id` |
| GET / POST / PATCH / DELETE | `/api/ai-projects/admin`, `/api/ai-projects/admin/:id` |

---

## Structure

```
index.html
.env.example               – copy to .env and fill in
server/                    – Express API
  index.js                 – app entry (routes + serves dist in prod)
  db.js                    – Neon connection
  schema.sql               – table definitions
  setup.js                 – `db:setup` / `db:seed` runner
  auth.js                  – admin login (JWT) + middleware
  mailer.js                – optional email notification
  helpers.js               – validation helpers
  routes/                  – contact, auth, services, projects, aiProjects, aiChips
src/
  main.jsx                 – entry; routes /admin → admin app, else the site
  api.js                   – frontend API client
  data.js                  – fallback content + chatbot brain
  components/              – site sections (Contact/Services/Work now dynamic)
  admin/                   – admin panel (AdminApp + per-resource screens + admin.css)
public/assets/             – logo, avatar, project thumbnails (.webp)
```

## Editing content

The client edits everything from **`/admin`** — no code changes needed.
The arrays in `src/data.js` remain as the offline fallback and the seed source.

## Deploying

Any Node host works (Render, Railway, Fly, a VPS, etc.):

1. Set the same environment variables from `.env`.
2. Build step: `npm install && npm run build`
3. Start command: `npm start`
4. Run `npm run db:setup` once (and `npm run db:seed` if you want the starter content).

## Inphox chatbot

`Chatbot.jsx` sends messages to `POST /api/chat`, which the server forwards to the Gemini API
(`server/routes/chat.js`) using `GEMINI_API_KEY` from your environment — the key never reaches the
browser. If the key isn't set, or Gemini is briefly unavailable, the widget automatically falls
back to the built-in keyword replies in `src/data.js`, so it's never broken for a visitor. The
route also rate-limits each visitor (15 messages/minute) to protect your API key from abuse.

To change the model, set `GEMINI_MODEL` in `.env` (defaults to `gemini-2.0-flash`).
To change what Inphox knows/says, edit the `SYSTEM` prompt in `src/data.js`.
