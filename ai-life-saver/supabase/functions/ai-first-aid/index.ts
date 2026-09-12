/**
 * AI LifeSaver – Gemini first-aid assistant Edge Function
 *
 * POST /functions/v1/ai-first-aid
 * Body: { message: string, language: "en" | "ur", history?: { role, content }[] }
 *
 * Secrets (Dashboard → Edge Functions → Secrets, or CLI):
 *   GEMINI_API_KEY   – required – Google Gemini API key (never expose to the frontend)
 *   GEMINI_MODEL     – optional – default "gemini-1.5-flash"
 *
 * Deploy:
 *   npx supabase login
 *   npx supabase link --project-ref wcnwwwsmjcazopltdpbj
 *   npx supabase secrets set GEMINI_API_KEY=your_key_here
 *   npx supabase functions deploy ai-first-aid
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const DISCLAIMER = "For emergency contact call 1122.";

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

type ConditionRow = {
  id: string;
  name_en: string;
  name_ur: string;
  synonyms: string[] | null;
  risk_level: string | null;
  steps_en: string[] | null;
  steps_ur: string[] | null;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    const body = await req.json();
    const message = typeof body?.message === "string" ? body.message.trim() : "";
    const language = body?.language === "ur" ? "ur" : "en";
    const history = Array.isArray(body?.history) ? body.history : [];

    if (!message) {
      return jsonResponse({ error: "Message is required" }, 400);
    }

    const groqKey = Deno.env.get("GROQ_API_KEY");
    const geminiKey = Deno.env.get("GEMINI_API_KEY");

    if (!groqKey && !geminiKey) {
      return jsonResponse(
        { error: "AI API is not configured on the server. Please set GROQ_API_KEY or GEMINI_API_KEY." },
        500,
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    if (!supabaseUrl || !supabaseAnonKey) {
      return jsonResponse({ error: "Supabase env missing" }, 500);
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: conditions, error: dbError } = await supabase
      .from("conditions")
      .select(
        "id, name_en, name_ur, synonyms, risk_level, steps_en, steps_ur",
      );

    if (dbError) {
      console.error("conditions query failed:", dbError.message);
    }

    const matches = findRelevantConditions(
      (conditions as ConditionRow[]) || [],
      message,
    );
    const dbContext = formatConditionsContext(matches, language);

    const systemPrompt = buildSystemPrompt(language, dbContext, matches.length > 0);
    const sanitizedHistory = sanitizeHistory(history);

    // Direct friendly greeting handling
    const isGreeting = /^(hi|hello|hey|salam|assalam|aoa|hy|hola|good\s+(morning|afternoon|evening|day))[\s!.]*$/i.test(message.trim()) ||
      /^(سلام|ہیلو|اسلام علیکم|السلام علیکم)/.test(message.trim());

    if (isGreeting) {
      const greetingReply = language === "ur"
        ? `ہیلو! میں AI LifeSaver ہوں، آپ کا ابتدائی طبی امداد کا اسسٹنٹ۔ میں آپ کی ایمرجنسی میں کس طرح مدد کر سکتا ہوں؟\n\n${DISCLAIMER}`
        : `Hello! I am AI LifeSaver, your first-aid emergency assistant. How can I assist you in your emergency?\n\n${DISCLAIMER}`;

      const encoder = new TextEncoder();
      return new Response(encoder.encode(greetingReply), {
        headers: {
          ...CORS_HEADERS,
          "Content-Type": "text/plain; charset=utf-8",
        },
      });
    }

    let fullText = "";
    let providerError = "";

    // Helper to call Groq with model fallback
    const callGroq = async (key: string) => {
      const configuredModel = Deno.env.get("GROQ_MODEL");
      const modelsToTry = configuredModel 
        ? [configuredModel, "openai/gpt-oss-120b", "openai/gpt-oss-20b", "qwen/qwen3.8-27b"]
        : ["openai/gpt-oss-120b", "openai/gpt-oss-20b", "qwen/qwen3.8-27b", "llama-3.3-70b-versatile"];

      const groqMessages = [
        { role: "system", content: systemPrompt },
        ...sanitizedHistory,
        { role: "user", content: message },
      ];

      let lastError = "";
      for (const model of modelsToTry) {
        try {
          const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${key}`,
            },
            body: JSON.stringify({
              model: model,
              messages: groqMessages,
              temperature: 0.3,
            }),
          });
          if (res.ok) {
            const json = await res.json();
            const text = json?.choices?.[0]?.message?.content?.trim() || "";
            if (text) return text;
          } else {
            const errText = await res.text().catch(() => "");
            lastError = `Groq ${res.status} (${model}): ${errText}`;
          }
        } catch (err: any) {
          lastError = err?.message || String(err);
        }
      }
      throw new Error(lastError || "All Groq models failed");
    };

    // Helper to call Gemini
    const callGemini = async (key: string) => {
      const model = Deno.env.get("GEMINI_MODEL") || "gemini-1.5-flash";
      const geminiContents = toGeminiContents(sanitizedHistory, message);
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`;
      const res = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: geminiContents,
          generationConfig: { temperature: 0.3 },
        }),
      });
      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        throw new Error(`Gemini ${res.status}: ${errText}`);
      }
      const json = await res.json();
      return extractGeminiText(json);
    };

    // Determine primary provider based on key format or availability
    const isGroq = (groqKey && groqKey.startsWith("gsk_")) || (!geminiKey && groqKey);

    if (isGroq && groqKey) {
      try {
        fullText = await callGroq(groqKey);
      } catch (err: any) {
        console.error("Groq primary attempt failed:", err?.message || err);
        providerError = String(err?.message || err);
        // Fallback to Gemini if available or if groqKey was actually a Gemini key
        if (geminiKey) {
          try {
            fullText = await callGemini(geminiKey);
          } catch (gErr: any) {
            console.error("Gemini fallback failed:", gErr?.message || gErr);
          }
        } else if (groqKey.startsWith("AQ.") || groqKey.startsWith("AIzaSy")) {
          // groqKey was accidentally set with a Gemini key
          try {
            fullText = await callGemini(groqKey);
          } catch (gErr: any) {
            console.error("Gemini attempt with key failed:", gErr?.message || gErr);
          }
        }
      }
    } else {
      const effectiveGeminiKey = geminiKey || groqKey;
      if (effectiveGeminiKey) {
        try {
          fullText = await callGemini(effectiveGeminiKey);
        } catch (err: any) {
          console.error("Gemini primary attempt failed:", err?.message || err);
          providerError = String(err?.message || err);
          if (groqKey && groqKey !== effectiveGeminiKey) {
            try {
              fullText = await callGroq(groqKey);
            } catch (qErr: any) {
              console.error("Groq fallback failed:", qErr?.message || qErr);
            }
          }
        }
      }
    }

    if (!fullText.trim()) {
      console.error("AI assistant empty response. Last error:", providerError);
      return jsonResponse(
        { error: "Failed to reach the AI assistant. " + (providerError ? `Details: ${providerError}` : "Please check API keys.") },
        502,
      );
    }

    if (!fullText.trim()) {
      console.error("AI empty response");
      return jsonResponse(
        { error: "Failed to reach the AI assistant. Please try again." },
        502,
      );
    }

    // Mandatory ending — never omit, modify, translate, or place anything after it
    if (!fullText.trimEnd().endsWith(DISCLAIMER)) {
      const gap =
        fullText.length > 0 && !fullText.endsWith("\n") ? "\n\n" : "";
      fullText = fullText + gap + DISCLAIMER;
    }

    const encoder = new TextEncoder();

    // Keep the same streamed text/plain response shape the frontend already expects
    const stream = new ReadableStream({
      start(controller) {
        try {
          controller.enqueue(encoder.encode(fullText));
        } catch (err) {
          console.error("stream error:", err);
          const fallback =
            (language === "ur"
              ? "معذرت، جواب بنانے میں مسئلہ پیش آیا۔ براہ کرم دوبارہ کوشش کریں۔\n\n"
              : "Sorry, something went wrong while generating a reply. Please try again.\n\n") +
            DISCLAIMER;
          controller.enqueue(encoder.encode(fallback));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (err) {
    console.error("ai-first-aid error:", err);
    return jsonResponse({ error: "Unexpected server error" }, 500);
  }
});

function jsonResponse(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

/** Map OpenAI-style history + current user message to Gemini contents[]. */
function toGeminiContents(
  history: ChatMessage[],
  message: string,
): { role: "user" | "model"; parts: { text: string }[] }[] {
  const contents: { role: "user" | "model"; parts: { text: string }[] }[] = [];

  for (const item of history) {
    if (item.role === "user") {
      contents.push({ role: "user", parts: [{ text: item.content }] });
    } else if (item.role === "assistant") {
      contents.push({ role: "model", parts: [{ text: item.content }] });
    }
  }

  contents.push({ role: "user", parts: [{ text: message }] });
  return contents;
}

/** Extract plain text from Gemini generateContent response JSON. */
function extractGeminiText(payload: unknown): string {
  const candidates = (payload as {
    candidates?: {
      content?: { parts?: { text?: string }[] };
    }[];
  })?.candidates;

  const parts = candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts) || parts.length === 0) return "";

  return parts
    .map((p) => (typeof p?.text === "string" ? p.text : ""))
    .join("")
    .trim();
}

function buildSystemPrompt(
  language: "en" | "ur",
  dbContext: string,
  hasDbMatch: boolean,
): string {
  const langName = language === "ur" ? "Urdu" : "English";

  return `You are AI LifeSaver, a strict first-aid assistant for emergency guidance.

HARD RULES:
1. You are STRICTLY limited to first-aid guidance only.
2. Refuse any question unrelated to first aid, injuries, sudden illness, CPR, bleeding, burns, choking, poisoning, fractures, or similar emergencies. When refusing, briefly say you only provide first-aid help, then end with the mandatory disclaimer.
3. Do NOT provide medical diagnoses.
4. Do NOT claim to replace doctors, paramedics, or emergency professionals.
5. Prioritize information from the PRIMARY FIRST-AID SOURCE (Supabase database) whenever it is relevant. Do not invent or fabricate database content.
6. If the database does not contain the required information, you may use your general knowledge to give safe, appropriate first-aid guidance.
7. Give clear, practical, step-by-step instructions where appropriate.
8. Prioritize user safety. Clearly state when emergency medical assistance is required.
9. Respond entirely in ${langName}, except for the mandatory closing sentence which must remain exactly as specified below.
10. EVERY response MUST end with EXACTLY this English sentence and nothing after it:
${DISCLAIMER}

${
  hasDbMatch
    ? `PRIMARY FIRST-AID SOURCE (from the AI LifeSaver Supabase database — treat as authoritative when relevant):\n${dbContext}`
    : `PRIMARY FIRST-AID SOURCE: No closely matching entries were found in the Supabase database for this query. Use safe general first-aid knowledge.`
}`;
}

function findRelevantConditions(
  conditions: ConditionRow[],
  query: string,
): ConditionRow[] {
  const q = query.toLowerCase().trim();
  if (!q || conditions.length === 0) return [];

  const words = q.split(/[\s,./!?؟،]+/).filter((w) => w.length > 2);

  const scored = conditions
    .map((c) => {
      let score = 0;
      const nameEn = (c.name_en || "").toLowerCase();
      const nameUr = c.name_ur || "";
      const synonyms = (c.synonyms || []).map((s) => s.toLowerCase());

      if (nameEn && (q.includes(nameEn) || nameEn.includes(q))) score += 12;
      if (nameUr && (q.includes(nameUr) || nameUr.includes(query.trim()))) {
        score += 12;
      }

      for (const syn of synonyms) {
        if (!syn) continue;
        if (q === syn) score += 20;
        else if (q.includes(syn) || syn.includes(q)) score += 8;

        for (const word of words) {
          if (syn === word) score += 6;
          else if (syn.includes(word) || word.includes(syn)) score += 2;
        }
      }

      for (const word of words) {
        if (nameEn.includes(word)) score += 3;
        if (nameUr.includes(word)) score += 3;
      }

      return { c, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, 3).map((x) => x.c);
}

function formatConditionsContext(
  matches: ConditionRow[],
  language: "en" | "ur",
): string {
  if (matches.length === 0) return "";

  return matches
    .map((c, i) => {
      const title = language === "ur" ? c.name_ur : c.name_en;
      const steps = (language === "ur" ? c.steps_ur : c.steps_en) || [];
      const stepsText = steps
        .map((s, idx) => `  ${idx + 1}. ${s}`)
        .join("\n");
      return [
        `Entry ${i + 1}: ${title} (id: ${c.id})`,
        `Also known as: ${(c.synonyms || []).join(", ")}`,
        `Risk level: ${c.risk_level || "n/a"}`,
        `Steps:`,
        stepsText || "  (none)",
      ].join("\n");
    })
    .join("\n\n");
}

function sanitizeHistory(history: unknown[]): ChatMessage[] {
  const out: ChatMessage[] = [];
  for (const item of history) {
    if (!item || typeof item !== "object") continue;
    const role = (item as { role?: string }).role;
    const content = (item as { content?: string }).content;
    if (
      (role === "user" || role === "assistant") &&
      typeof content === "string" &&
      content.trim()
    ) {
      out.push({ role, content: content.trim().slice(0, 4000) });
    }
  }
  // Keep last 8 turns to limit token use
  return out.slice(-8);
}
