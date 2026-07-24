-- ============================================================================
-- PHASE 28: PORTFOLIOS TABLE RLS ANON READ PATCH
-- ============================================================================

-- Allow unauthenticated visitors to read from portfolios table if it's deployed
DROP POLICY IF EXISTS "Anyone can read deployed portfolios" ON public.portfolios;
CREATE POLICY "Anyone can read deployed portfolios"
  ON public.portfolios FOR SELECT
  USING (deployed_url IS NOT NULL);
