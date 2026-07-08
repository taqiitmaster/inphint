-- ============================================================
--  Inphint — database schema (PostgreSQL / Neon)
--  Safe to run multiple times (IF NOT EXISTS everywhere).
-- ============================================================

-- Contact form submissions -----------------------------------
CREATE TABLE IF NOT EXISTS contact_submissions (
  id          SERIAL PRIMARY KEY,
  name        TEXT        NOT NULL,
  email       TEXT        NOT NULL,
  phone       TEXT,
  service     TEXT,
  budget      TEXT,
  message     TEXT        NOT NULL,
  status      TEXT        NOT NULL DEFAULT 'new',   -- new | read | archived
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_submissions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_status  ON contact_submissions (status);

-- Services grid (the "What we do" section) -------------------
CREATE TABLE IF NOT EXISTS services (
  id          SERIAL PRIMARY KEY,
  label       TEXT,                                 -- small kicker e.g. "Build"
  title       TEXT        NOT NULL,                  -- e.g. "Web development"
  description TEXT,
  sub         JSONB       NOT NULL DEFAULT '[]',     -- array of tag strings
  icon        TEXT,                                  -- inner SVG markup (paths)
  sort_order  INT         NOT NULL DEFAULT 0,
  active      BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- AI-automation flagship chips -------------------------------
CREATE TABLE IF NOT EXISTS ai_chips (
  id          SERIAL PRIMARY KEY,
  label       TEXT        NOT NULL,
  hot         BOOLEAN     NOT NULL DEFAULT FALSE,    -- highlighted chip
  sort_order  INT         NOT NULL DEFAULT 0,
  active      BOOLEAN     NOT NULL DEFAULT TRUE
);

-- Client project grid (Selected work) -----------------------
CREATE TABLE IF NOT EXISTS projects (
  id          SERIAL PRIMARY KEY,
  title       TEXT        NOT NULL,
  image       TEXT,                                  -- asset name ("tycoon") or full URL
  url         TEXT,                                  -- external site link (optional)
  categories  JSONB       NOT NULL DEFAULT '[]',     -- e.g. ["web","brand"]
  sort_order  INT         NOT NULL DEFAULT 0,
  active      BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- AI project showcase cards ---------------------------------
CREATE TABLE IF NOT EXISTS ai_projects (
  id          SERIAL PRIMARY KEY,
  title       TEXT        NOT NULL,
  tag         TEXT,
  demo        TEXT,                                  -- demo / request link
  features    JSONB       NOT NULL DEFAULT '[]',     -- array of feature strings
  sort_order  INT         NOT NULL DEFAULT 0,
  active      BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
