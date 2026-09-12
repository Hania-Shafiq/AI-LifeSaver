# AI LifeSaver

A bilingual (Urdu & English) AI-powered first aid app built with React + Vite.  
Get instant, step-by-step emergency guidance — including voice input/output, PDF export, and an AI chat assistant.

## Project Structure

```
ai-life-saver/
├── .env                   # Local env vars (never commit) — see .env.example
├── .env.example           # Template for required env vars
├── index.html             # Vite entry HTML
├── vite.config.js         # Vite build config
├── tailwind.config.js     # Tailwind CSS config
├── package.json
│
├── src/                   # ── FRONTEND (React / Vite) ──────────────────────
│   ├── main.jsx           # React entry point
│   ├── App.jsx            # Router + language state
│   ├── index.css          # Global styles
│   ├── assets/            # Images and static assets
│   ├── components/        # Shared UI components (Navbar, Footer, AiChat…)
│   ├── data/              # Static JSON data (firstAid.json, texts.json)
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # supabaseClient.js
│   ├── pages/             # Route-level pages (Home, Emergency, Contacts, About)
│   └── utils/             # speechUtils.js
│
└── backend/               # ── BACKEND (Supabase) ───────────────────────────
    ├── README.md          # Backend setup + Supabase CLI usage notes
    ├── config.toml        # Supabase project config
    ├── schema.sql         # Database schema + RLS policies
    ├── seed.sql           # Seed data (first-aid conditions EN + UR)
    └── functions/
        └── ai-first-aid/  # Supabase Edge Function (Gemini API proxy)
```

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Copy and fill in environment variables
cp .env.example .env

# 3. Start the dev server
npm run dev
```

## Backend / Supabase

See [`backend/README.md`](./backend/README.md) for database setup and Edge Function deployment instructions.

