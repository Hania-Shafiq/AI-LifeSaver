-- ============================================================
-- AI LifeSaver – conditions table schema
-- Run this once in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.conditions (
  id          TEXT        PRIMARY KEY,          -- e.g. 'fainting', 'cardiac_arrest'
  name_en     TEXT        NOT NULL,             -- Human-readable English title
  name_ur     TEXT        NOT NULL,             -- Human-readable Urdu title
  synonyms    TEXT[]      NOT NULL DEFAULT '{}',-- Search keywords (en + ur + Roman Urdu)
  risk_level  TEXT        NOT NULL DEFAULT '',  -- e.g. 'high', 'medium to high', 'low to medium'
  steps_en    TEXT[]      NOT NULL DEFAULT '{}',-- Step-by-step first-aid in English
  steps_ur    TEXT[]      NOT NULL DEFAULT '{}'  -- Step-by-step first-aid in Urdu
);

-- ----------------------------------------------------------
-- Row Level Security
-- ----------------------------------------------------------
ALTER TABLE public.conditions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous (unauthenticated) reads – required for the
-- frontend Supabase client (anon key) to SELECT all rows.
DROP POLICY IF EXISTS "Allow public read access" ON public.conditions;
CREATE POLICY "Allow public read access"
  ON public.conditions
  FOR SELECT
  TO anon
  USING (true);

-- Optionally allow authenticated users to read too
DROP POLICY IF EXISTS "Allow authenticated read access" ON public.conditions;
CREATE POLICY "Allow authenticated read access"
  ON public.conditions
  FOR SELECT
  TO authenticated
  USING (true);

-- ----------------------------------------------------------
-- Helpful index on synonyms for future server-side filtering
-- ----------------------------------------------------------
CREATE INDEX IF NOT EXISTS conditions_synonyms_gin
  ON public.conditions
  USING GIN (synonyms);
