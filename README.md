# 🩺 AI LifeSaver – AI-Powered First Aid & Emergency Guidance Platform

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646C9A?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database_%26_Edge_Functions-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Groq](https://img.shields.io/badge/Groq-Fast_LLM_Inference-F55036?logo=groq&logoColor=white)](https://groq.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-AI_Engine-8E75B2?logo=google-gemini&logoColor=white)](https://ai.google.dev/)

**AI LifeSaver** is an intelligent, bilingual (**English / اردو**) emergency first aid assistance platform designed to guide bystanders, responders, and families through the **critical first few minutes of medical emergencies** before professional help arrives.

Equipped with high-speed LLM integration (**Groq API / Google Gemini API** via **Supabase Edge Functions**), voice recognition, audio narration, interactive maps, and offline resilience, AI LifeSaver delivers instant, reliable, and lifesaving medical guidance in high-stress situations.

---

## 🌟 Key Features

### 🤖 1. AI First Aid Assistant (Groq & Gemini Powered)
- **High-Speed Emergency AI Chat**: Interactive conversational assistant powered by ultra-low-latency **Groq API** and **Google Gemini** models via secure Supabase Edge Functions.
- **Strict Medical Guardrails**: Embedded first-aid system instructions prevent hallucinations, refuse non-medical queries, prioritize verified database procedures, and append mandatory emergency service disclaimers.
- **Context-Aware Database Retrieval**: Matches incoming user queries against verified Supabase first-aid condition records before generating responses.

### 🔍 2. Multimodal Emergency Search (Voice & Text)
- **Instant Search & Keyword Matching**: Rapid lookup across conditions (e.g., CPR, Burns, Choking, Severe Bleeding, Heatstroke, Fractures).
- **Voice Commands (Web Speech API)**: Speak symptoms or emergency terms directly for hands-free lookup during critical situations.
- **Risk Level Badges**: Visual risk indicators (**High**, **Medium to High**, **Low to Medium**) for quick triage.

### 🎙️ 3. Step-by-Step Audio Narration (Text-to-Speech)
- Audio playback of emergency steps allows users to listen to instructions while performing first aid hands-free.
- Visual step cards and warning callouts to prevent common first-aid mistakes.

### 🌐 4. Full Bilingual Support (English / Urdu)
- One-tap seamless language switcher across all interface elements, first-aid instructions, chat conversations, and emergency contacts.
- Native RTL support and localized terminology in Urdu.

### 🏥 5. Emergency Services & Geolocation Map
- **One-Tap Emergency Call**: Instant dialing to local emergency hotlines (e.g., **Rescue 1122**).
- **Interactive Hospital & Blood Bank Map**: Built with **Leaflet** & **OpenStreetMap** to locate nearby medical facilities, blood banks, and verified emergency contacts.

### 📄 6. Offline Support & PDF Guide Generation
- **PDF Export**: Generate and download printable first-aid guides using jsPDF.
- **Hybrid Data Architecture**: Automatic fallback to local static JSON data if Supabase or network connectivity is unavailable.

---

## 🏗️ Architecture & Technology Stack

`mermaid
graph TD
    User([👤 User / Bystander]) <-->|Voice / Text / UI| Frontend[⚛️ React 19 + Vite + Tailwind CSS]
    Frontend <-->|Direct Query (Public Data)| SupabaseDB[(🗄️ Supabase PostgreSQL)]
    Frontend <-->|Secure AI Chat Request| EdgeFunction[⚡ Supabase Edge Function: ai-first-aid]
    EdgeFunction <-->|Fetch Condition Steps & Synonyms| SupabaseDB
    EdgeFunction <-->|High-Speed LLM Inference| GroqGemini[🚀 Groq API / Google Gemini API]
    Frontend -->|Offline Fallback| LocalData[📁 Local JSON Datasets]
    Frontend -->|Map Rendering| LeafletMap[🗺️ Leaflet / OpenStreetMap]
`

### Tech Stack Summary
| Area | Technology | Purpose |
|---|---|---|
| **Frontend** | React 19, Vite 7 | Fast, reactive Single Page Application |
| **Styling & Motion** | Tailwind CSS v4, Framer Motion | Modern, accessible styling and fluid animations |
| **Icons & UI** | Lucide React | Clean, scalable vector icons |
| **Maps & Geo** | Leaflet, React-Leaflet, OpenStreetMap | Location lookup for hospitals & blood banks |
| **Speech APIs** | Web Speech API (Recognition & Synthesis) | Hands-free voice input and audio step playback |
| **PDF Generation** | jsPDF | Offline export of first-aid procedure guides |
| **Backend & Database** | Supabase (PostgreSQL, RLS Policies) | Structured conditions, synonym indexes, secure queries |
| **Serverless Compute** | Supabase Edge Functions (Deno / TypeScript) | Secure API proxy, context injection, and stream handling |
| **AI / LLMs** | Groq API / Google Gemini 1.5 Flash | Real-time conversational first-aid guidance |

---

## 📁 Repository Layout

`
AI-LifeSaver/
├── README.md                          # Main project overview & documentation
└── ai-life-saver/
    ├── package.json                   # Frontend dependencies & npm scripts
    ├── vite.config.js                 # Vite build configuration
    ├── tailwind.config.js             # Tailwind CSS configuration
    ├── .env.example                   # Template for frontend & backend variables
    ├── .env.local                     # Local Supabase credentials (gitignored)
    │
    ├── src/                           # Frontend Source Code
    │   ├── App.jsx                    # Root router & bilingual language provider
    │   ├── main.jsx                   # React entrypoint
    │   ├── components/
    │   │   ├── AiChat.jsx             # AI first-aid chat interface (Groq/Gemini via Edge Function)
    │   │   ├── Navbar.jsx             # Header navigation bar with language toggle
    │   │   ├── Footer.jsx             # Footer with emergency hotlines
    │   │   ├── LanguageToggle.jsx     # English / Urdu switch
    │   │   └── ResultCard.jsx         # Card component for first-aid procedures
    │   ├── pages/
    │   │   ├── Home.jsx               # Home search, voice input & emergency grid
    │   │   ├── Emergency.jsx          # Detailed step-by-step procedure viewer
    │   │   ├── Contacts.jsx           # Hospital map, blood banks & helpline directory
    │   │   └── About.jsx              # Mission statement, disclaimers & safety rules
    │   ├── data/
    │   │   ├── firstAid.json          # Offline fallback first-aid dataset
    │   │   └── texts.json             # Localization strings (EN & UR)
    │   ├── lib/
    │   │   └── supabaseClient.js      # Supabase JavaScript client initializer
    │   └── utils/                     # Utility functions (speech, PDF generation)
    │
    └── backend/                       # Backend & Supabase Infrastructure
        ├── README.md                  # Backend deployment & CLI guide
        ├── config.toml                # Supabase CLI project configuration
        ├── schema.sql                 # PostgreSQL schema with RLS & GIN indexes
        ├── seed.sql                   # Bilingual seed conditions dataset
        └── functions/
            └── ai-first-aid/          # Supabase Edge Function (Groq/Gemini API integration)
                └── index.ts
`

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18 or higher
- **npm** or **yarn**
- *(Optional for Backend)*: Supabase CLI & API key for **Groq** or **Google Gemini**

### 2. Frontend Installation & Setup

`ash
# Clone repository
git clone https://github.com/Hania-Shafiq/AI-LifeSaver.git

# Navigate to application folder
cd AI-LifeSaver/ai-life-saver

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
`

Edit .env.local with your Supabase credentials:
`env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
`

### 3. Run Development Server

`ash
npm run dev
`

Visit http://localhost:5173 in your browser.

---

## ⚙️ Backend & AI Setup (Supabase + Groq / Gemini)

1. **Database Schema & Data**:
   Execute ackend/schema.sql and ackend/seed.sql in your Supabase SQL Editor.

2. **Configure AI Secrets in Supabase**:
   `ash
   # Link Supabase project
   npx supabase --workdir backend link --project-ref your-project-ref

   # Set Groq API or Gemini API key secret
   npx supabase --workdir backend secrets set GROQ_API_KEY=your_groq_api_key
   # OR
   npx supabase --workdir backend secrets set GEMINI_API_KEY=your_gemini_api_key

   # Deploy the AI Edge Function
   npx supabase --workdir backend functions deploy ai-first-aid
   `

---

## ⚠️ Medical Disclaimer

> **IMPORTANT**: AI LifeSaver provides general first-aid guidance for educational and immediate emergency assistance purposes only. It is **not a substitute for professional medical diagnosis, treatment, or emergency rescue services**. Always contact your local emergency services (e.g., **Rescue 1122**, **911**, or **112**) immediately during life-threatening situations.

---

## 👥 Authors & Acknowledgments

- **AI LifeSaver Team**
- Specialized first-aid datasets curated for emergency bystander response.
