# Backend - Supabase Infrastructure

This folder contains all backend/database infrastructure for AI LifeSaver.
It was previously named supabase/ and follows the Supabase project layout exactly.

## Contents

| Path | Purpose |
|---|---|
| config.toml | Supabase CLI project config |
| schema.sql | Database schema - conditions table and RLS policies |
| seed.sql | Seed data - first-aid conditions in English and Urdu |
| functions/ai-first-aid/index.ts | Edge Function - Gemini API proxy for AI chat |

## Supabase CLI Usage

This folder is named backend/ not supabase/, so pass --workdir backend:

    npx supabase --workdir backend db push
    npx supabase --workdir backend functions deploy ai-first-aid
    npx supabase --workdir backend secrets set GEMINI_API_KEY=your_key

## Environment Variables

Set in root .env (never commit):

    VITE_SUPABASE_URL=https://your-project-ref.supabase.co
    VITE_SUPABASE_ANON_KEY=your-anon-key-here
