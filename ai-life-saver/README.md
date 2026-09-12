# 🩺 AI LifeSaver – Frontend & Backend Overview

A bilingual (**English / اردو**) emergency first-aid web platform built with **React 19**, **Vite 7**, **Tailwind CSS v4**, and **Supabase**. Integrated with **Groq API** and **Google Gemini** for high-speed first-aid conversational assistance, voice input/output, interactive hospital mapping, and offline resilience.

---

## 📂 Project Structure

`
ai-life-saver/
├── .env.example               # Template for required environment variables
├── .env.local                 # Local Supabase credentials (gitignored)
├── index.html                 # Main HTML entry point
├── package.json               # Frontend dependencies & scripts
├── vite.config.js             # Vite build configuration
├── tailwind.config.js         # Tailwind CSS styling configuration
│
├── src/                       # ── FRONTEND (React 19 / Vite) ──────────────────────
│   ├── main.jsx               # React entry point
│   ├── App.jsx                # Router & bilingual language state management
│   ├── index.css              # Global styles & Tailwind directives
│   ├── assets/                # Visual assets, illustrations & icons
│   ├── components/            # Reusable UI components
│   │   ├── AiChat.jsx         # AI First-Aid Assistant widget
│   │   ├── Navbar.jsx         # Navigation bar with language toggle
│   │   ├── Footer.jsx         # Footer with helpline numbers
│   │   ├── LanguageToggle.jsx # English / Urdu switch
│   │   └── ResultCard.jsx     # Card rendering first-aid steps & risk levels
│   ├── data/                  # Static & fallback datasets
│   │   ├── firstAid.json      # Offline first-aid procedures & guidelines
│   │   └── texts.json         # Localization strings (EN & UR)
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Supabase client (supabaseClient.js)
│   ├── pages/                 # Main route pages
│   │   ├── Home.jsx           # Emergency search, quick categories & voice input
│   │   ├── Emergency.jsx      # Step-by-step guidance, audio TTS & PDF export
│   │   ├── Contacts.jsx       # Interactive hospital/blood bank map & 1122 dialer
│   │   └── About.jsx          # About mission & emergency safety guidelines
│   └── utils/                 # Utilities (speech recognition/TTS, PDF exporter)
│
└── backend/                   # ── BACKEND (Supabase) ───────────────────────────
    ├── README.md              # Backend setup, database schema & CLI guide
    ├── config.toml            # Supabase CLI project configuration
    ├── schema.sql             # PostgreSQL schema, conditions table & RLS policies
    ├── seed.sql               # Seed dataset of first-aid procedures (EN + UR)
    └── functions/             # Supabase Edge Functions (Deno / TypeScript)
        └── ai-first-aid/      # AI First-Aid Edge Function (Groq/Gemini LLM integration)
`

---

## 🚀 Getting Started

### 1. Install Dependencies
`ash
npm install
`

### 2. Configure Environment Variables
Copy the template file to .env.local:
`ash
cp .env.example .env.local
`

Set your Supabase credentials in .env.local:
`env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
`

### 3. Start Development Server
`ash
npm run dev
`

The application will be available at http://localhost:5173.

---

## 🛠️ Key Technologies & Features

- **AI Inference (Groq / Gemini)**: Ultra-fast emergency assistance with medical safety guardrails deployed on Supabase Edge Functions.
- **Multimodal Search**: Voice-driven input (Web Speech API) + instant keyword matching in English, Urdu, and Roman Urdu.
- **Hands-Free Audio Steps**: Step-by-step Text-to-Speech (TTS) narration.
- **Interactive Mapping**: Hospital, emergency center, and blood bank locator using Leaflet.
- **Offline Readiness**: Downloadable PDF emergency guides (jsPDF) and local JSON fallback when offline.

---

## 🗄️ Backend Deployment & Management

For instructions on database migration, seed data, and deploying the Edge Function with Groq/Gemini API keys, check out [ackend/README.md](./backend/README.md).
