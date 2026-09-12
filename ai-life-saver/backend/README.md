# 🗄️ Backend – Supabase Infrastructure & AI Services

This directory contains the database schema, seed data, and serverless Edge Functions for **AI LifeSaver**.

---

## 📂 Contents

| File / Folder | Purpose |
|---|---|
| `config.toml` | Supabase CLI project configuration |
| `schema.sql` | PostgreSQL database schema (`conditions` table, Row Level Security policies, and GIN synonym index) |
| `seed.sql` | Seed dataset containing verified bilingual first-aid procedures (English + Urdu) |
| `functions/ai-first-aid/` | Serverless Deno Edge Function acting as a secure AI proxy (supporting **Groq API** and **Google Gemini**) |

---

## 🚀 Setup & Deployment Guide

### 1. Link Your Supabase Project
```bash
npx supabase --workdir backend link --project-ref <your-project-ref>
```

### 2. Run Database Schema & Seeds
You can push the schema and seed data via the Supabase CLI or execute them directly in the **Supabase Dashboard → SQL Editor**:
```bash
npx supabase --workdir backend db push
```

### 3. Configure AI API Secrets
Set your AI API key as a secure secret in Supabase Edge Functions (never expose these keys to the frontend):

**For Groq API:**
```bash
npx supabase --workdir backend secrets set GROQ_API_KEY=gsk_your_groq_api_key
npx supabase --workdir backend secrets set GROQ_MODEL=llama-3.3-70b-versatile  # optional
```

**For Google Gemini API:**
```bash
npx supabase --workdir backend secrets set GEMINI_API_KEY=your_gemini_api_key
npx supabase --workdir backend secrets set GEMINI_MODEL=gemini-1.5-flash        # optional
```

### 4. Deploy the Edge Function
```bash
npx supabase --workdir backend functions deploy ai-first-aid
```

---

## 🔐 Environment Variables for Frontend

Set these in your frontend `.env.local` file:
```env
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-public-anon-key>
```
