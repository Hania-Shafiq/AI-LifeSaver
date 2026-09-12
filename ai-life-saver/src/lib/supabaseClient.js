import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client for AI LifeSaver.
 *
 * Reads credentials from Vite environment variables (VITE_ prefix required).
 * Set these in a .env file at the project root – see .env.example.
 *
 * The anon key is intentionally public: access is restricted to SELECT-only
 * via Row Level Security policies defined in supabase/schema.sql.
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Export null when env vars are missing so callers can detect the
// offline/unconfigured state and fall back to the local JSON file.
const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export default supabase;
