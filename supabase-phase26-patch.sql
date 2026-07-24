-- ============================================================================
-- PHASE 26: CVS TABLE SCHEMA + RLS ANON READ PATCH
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================================

-- ── 1. Create (or ensure) the `cvs` table ───────────────────────────────────
-- Stores CV Studio data and publish metadata per user.
-- cv_data_json contains the full PortfolioData + publishMeta sub-object.

CREATE TABLE IF NOT EXISTS public.cvs (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cv_data_json JSONB       NOT NULL DEFAULT '{}',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-update updated_at on every write
CREATE OR REPLACE TRIGGER trg_cvs_updated_at
  BEFORE UPDATE ON public.cvs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Unique constraint: one CV record per user (upsert uses onConflict: "user_id")
ALTER TABLE public.cvs
  DROP CONSTRAINT IF EXISTS cvs_user_id_key;

ALTER TABLE public.cvs
  ADD CONSTRAINT cvs_user_id_key UNIQUE (user_id);

-- GIN index for fast JSONB slug lookups used by the /p/$slug route
CREATE INDEX IF NOT EXISTS idx_cvs_slug
  ON public.cvs USING GIN (cv_data_json jsonb_path_ops);


-- ── 2. Enable RLS ─────────────────────────────────────────────────────────────
ALTER TABLE public.cvs ENABLE ROW LEVEL SECURITY;


-- ── 3. Owner policies (authenticated users can CRUD their own rows) ───────────
DROP POLICY IF EXISTS "Users can read own CV" ON public.cvs;
CREATE POLICY "Users can read own CV"
  ON public.cvs FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own CV" ON public.cvs;
CREATE POLICY "Users can insert own CV"
  ON public.cvs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own CV" ON public.cvs;
CREATE POLICY "Users can update own CV"
  ON public.cvs FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own CV" ON public.cvs;
CREATE POLICY "Users can delete own CV"
  ON public.cvs FOR DELETE
  USING (auth.uid() = user_id);


-- ── 4. CRITICAL: Anon read policy for published portfolios ───────────────────
-- Without this, any visitor hitting /p/$slug will get a 403 from Supabase
-- when the route tries to fetch the cv_data_json. This policy allows anyone
-- (including unauthenticated visitors) to READ a CV row — but ONLY if it
-- has been published (i.e., publishMeta.slug is present in cv_data_json).

DROP POLICY IF EXISTS "Anyone can read published portfolios" ON public.cvs;
CREATE POLICY "Anyone can read published portfolios"
  ON public.cvs FOR SELECT
  USING (
    (cv_data_json -> 'publishMeta' ->> 'slug') IS NOT NULL
  );


-- ── 5. Create (or ensure) the `portfolios` table ────────────────────────────
-- Used by the Portfolio Builder wizard (portfolio-builder.tsx).

CREATE TABLE IF NOT EXISTS public.portfolios (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id  TEXT        NOT NULL DEFAULT '',
  content_json JSONB       NOT NULL DEFAULT '{}',
  deployed_url TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE TRIGGER trg_portfolios_updated_at
  BEFORE UPDATE ON public.portfolios
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own portfolios" ON public.portfolios;
CREATE POLICY "Users can manage own portfolios"
  ON public.portfolios FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- HOW THE DATA IS STORED (DIAGNOSTIC SUMMARY)
-- ============================================================================
--
-- Table: public.cvs
--   id            → UUID primary key
--   user_id       → links to auth.users (one row per user via UNIQUE constraint)
--   cv_data_json  → JSONB blob with this shape:
--     {
--       "personalInfo": { "name": "...", "role": "...", ... },
--       "experience":   [...],
--       "projects":     [...],
--       "education":    [...],
--       "skills":       [...],
--       "publishMeta": {
--         "slug":        "montassar-zarai-4f9a",
--         "url":         "/p/montassar-zarai-4f9a",
--         "templateId":  "blueprint-sphere-main",
--         "publishedAt": "2026-07-24T..."
--       }
--     }
--   updated_at    → auto-updated on every save/publish
--
-- Route /p/$slug fetches via:
--   supabase.from("cvs")
--     .contains("cv_data_json", { publishMeta: { slug: params.slug } })
--     .single()
--
-- This requires the GIN index (idx_cvs_slug) + the anon SELECT policy above.
--
-- ============================================================================
