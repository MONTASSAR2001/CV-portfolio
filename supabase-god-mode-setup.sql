-- ============================================================================
-- NEXUS / INFINITY BUGS — GOD-MODE CONTROL DATABASE
-- Run this entire file in: Supabase Dashboard → SQL Editor
-- ============================================================================

-- ── 1. site_settings ────────────────────────────────────────────────────────
-- Holds all dynamic marketing and configuration key/value pairs.
-- Values are JSONB so they can store strings, numbers, arrays, or objects.

CREATE TABLE IF NOT EXISTS public.site_settings (
  key        TEXT        PRIMARY KEY,
  value      JSONB       NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed default values
INSERT INTO public.site_settings (key, value) VALUES
  ('site_name',       '"Nexus AI"'),
  ('site_tagline',    '"Build a portfolio that gets you hired — in minutes."'),
  ('active_promo',    '{"enabled": false, "label": "Happy Week", "discount_pct": 30, "expires_at": null}'),
  ('pricing_tiers',   '[{"id":"free","name":"Starter","price_monthly":0,"price_annual":0,"features":["3 CV exports","1 portfolio","Community support"]},{"id":"pro","name":"Pro","price_monthly":19,"price_annual":149,"features":["Unlimited exports","5 live portfolios","AI auto-fill","Priority support"]},{"id":"enterprise","name":"Enterprise","price_monthly":49,"price_annual":399,"features":["Everything in Pro","Custom domain","SSO","Dedicated manager"]}]'),
  ('maintenance_mode','false'),
  ('announcement_bar','{"enabled": false, "message": "", "color": "emerald"}')
ON CONFLICT (key) DO NOTHING;

-- RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read site_settings"
  ON public.site_settings FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can write site_settings"
  ON public.site_settings FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');


-- ── 2. dynamic_templates ────────────────────────────────────────────────────
-- Admin can enable/disable templates and mark them as premium on the fly.

CREATE TABLE IF NOT EXISTS public.dynamic_templates (
  id           TEXT        PRIMARY KEY,               -- e.g. "minimalist"
  name         TEXT        NOT NULL,
  category     TEXT        NOT NULL DEFAULT 'CV',     -- 'CV' | 'Portfolio'
  status       BOOLEAN     NOT NULL DEFAULT true,     -- active / disabled
  is_premium   BOOLEAN     NOT NULL DEFAULT false,
  sort_order   INTEGER     NOT NULL DEFAULT 0,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed all 13 current CV templates + 5 portfolio templates
INSERT INTO public.dynamic_templates (id, name, category, status, is_premium, sort_order) VALUES
  -- CV templates
  ('minimalist',      'Minimalist',       'CV',        true,  false, 1),
  ('corporate',       'Corporate',        'CV',        true,  false, 2),
  ('tech',            'Tech',             'CV',        true,  false, 3),
  ('creative',        'Creative',         'CV',        true,  true,  4),
  ('executive',       'Executive',        'CV',        true,  true,  5),
  ('startup',         'Startup',          'CV',        true,  false, 6),
  ('academic',        'Academic',         'CV',        true,  false, 7),
  ('editorial',       'Editorial',        'CV',        true,  true,  8),
  ('darkbold',        'Dark Bold',        'CV',        true,  true,  9),
  ('visual',          'Visual',           'CV',        true,  true,  10),
  ('atsclassic',      'ATS Classic',      'CV',        true,  false, 11),
  ('atsmodern',       'ATS Modern',       'CV',        true,  false, 12),
  ('harvardstandard', 'Harvard Standard', 'CV',        true,  false, 13),
  -- Portfolio templates
  ('vogue',           'Vogue',            'Portfolio', true,  true,  14),
  ('architect',       'Architect',        'Portfolio', true,  false, 15),
  ('biotech',         'Biotech',          'Portfolio', true,  true,  16),
  ('lumina',          'Lumina',           'Portfolio', true,  true,  17),
  ('sterling',        'Sterling',         'Portfolio', true,  true,  18)
ON CONFLICT (id) DO NOTHING;

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_dynamic_templates_updated_at
  BEFORE UPDATE ON public.dynamic_templates
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.dynamic_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read dynamic_templates"
  ON public.dynamic_templates FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can write dynamic_templates"
  ON public.dynamic_templates FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');


-- ── 3. Useful views for the Admin Overview ──────────────────────────────────

-- Signup count per day (last 30 days) — wire to traffic chart
CREATE OR REPLACE VIEW public.admin_signups_per_day AS
SELECT
  date_trunc('day', created_at)::date AS day,
  COUNT(*)                            AS signups
FROM auth.users
WHERE created_at >= now() - INTERVAL '30 days'
GROUP BY 1
ORDER BY 1;

-- CV count per day (last 30 days)
CREATE OR REPLACE VIEW public.admin_cvs_per_day AS
SELECT
  date_trunc('day', created_at)::date AS day,
  COUNT(*)                            AS cvs_saved
FROM public.cvs
WHERE created_at >= now() - INTERVAL '30 days'
GROUP BY 1
ORDER BY 1;

-- Portfolio deployments per day (last 30 days)
CREATE OR REPLACE VIEW public.admin_portfolios_per_day AS
SELECT
  date_trunc('day', created_at)::date AS day,
  COUNT(*)                            AS portfolios_deployed
FROM public.portfolios
WHERE created_at >= now() - INTERVAL '30 days'
GROUP BY 1
ORDER BY 1;

-- ============================================================================
-- END OF GOD-MODE SETUP
-- ============================================================================
