import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, FileText, Mic, Loader2, WifiOff, AlertTriangle } from "lucide-react";
import { jsPDF } from "jspdf";
import texts from "../data/texts.json";

// Static fallback – used when Supabase is unreachable or unconfigured
import fallbackData from "../data/firstAid.json";

// Supabase client (null when env vars are absent)
import supabase from "../lib/supabaseClient";

// Speech utilities
import { startListening, speakResult } from "../utils/speechUtils.js";

// --------------------------------------------------------------------------
// Helpers – normalise the Supabase row shape to match the legacy JSON shape
// so the rest of the component is data-source agnostic.
// --------------------------------------------------------------------------

/**
 * Convert a Supabase `conditions` row into the internal condition object:
 * { en: string[], ur: string[], synonyms: string[], risk: string }
 */
function rowToCondition(row) {
  return {
    en: row.steps_en ?? [],
    ur: row.steps_ur ?? [],
    synonyms: row.synonyms ?? [],
    risk: row.risk_level ?? "",
  };
}

/**
 * Convert the legacy firstAid.json object into an array of { id, ...condition }
 * so both data sources share the same in-memory shape.
 */
function jsonToConditionsArray(json) {
  return Object.entries(json).map(([id, value]) => ({ id, ...value }));
}

// --------------------------------------------------------------------------
// Component
// --------------------------------------------------------------------------

export default function Emergency({ language }) {
  const [input, setInput] = useState("");
  const [resultKey, setResultKey] = useState(null);
  const [micReady, setMicReady] = useState(false);
  const [listening, setListening] = useState(false);

  // All fetched conditions cached here; search runs client-side against this.
  const [conditionsCache, setConditionsCache] = useState(null); // null = loading
  const [dataSource, setDataSource] = useState(null); // 'supabase' | 'fallback'
  const [fetchError, setFetchError] = useState(false);

  // SOS state
  const [sosLoading, setSosLoading] = useState(false);
  const [sosToast, setSosToast] = useState(null); // { message, type: 'success'|'error' }

  // Keep a stable ref so effects that depend on resultKey can read the cache
  const cacheRef = useRef(null);

  const t = texts[language];

  // -------------------------------------------------------------------------
  // 1. CHECK SPEECH RECOGNITION SUPPORT
  // -------------------------------------------------------------------------
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) setMicReady(true);
  }, []);

  // -------------------------------------------------------------------------
  // 2. FETCH ALL CONDITIONS ONCE ON MOUNT
  //    Priority: Supabase → fallback JSON (when client is null or query fails)
  // -------------------------------------------------------------------------
  useEffect(() => {
    let cancelled = false;

    async function loadConditions() {
      // --- Try Supabase first ---
      if (supabase) {
        const { data, error } = await supabase
          .from("conditions")
          .select("*");

        if (!cancelled) {
          if (!error && data && data.length > 0) {
            // Normalise Supabase rows to internal shape
            const normalised = data.map((row) => ({
              id: row.id,
              ...rowToCondition(row),
            }));
            setConditionsCache(normalised);
            cacheRef.current = normalised;
            setDataSource("supabase");
            return;
          }
          // Supabase returned an error or empty table → fall through to JSON
          console.warn("[AI LifeSaver] Supabase query failed, using fallback.", error?.message);
          setFetchError(true);
        }
      }

      // --- Fallback: static firstAid.json ---
      if (!cancelled) {
        const fallback = jsonToConditionsArray(fallbackData);
        setConditionsCache(fallback);
        cacheRef.current = fallback;
        setDataSource("fallback");
      }
    }

    loadConditions();
    return () => { cancelled = true; };
  }, []);

  // -------------------------------------------------------------------------
  // 3. HANDLE SEARCH – identical synonym-matching logic, now against the cache
  // -------------------------------------------------------------------------
  const handleSearch = (query = null) => {
    window.speechSynthesis.cancel();

    if (!conditionsCache) return; // Still loading

    const key = (query || input).toLowerCase().trim();
    let foundCondition = null;

    for (const condition of conditionsCache) {
      const syns = condition.synonyms ?? [];
      if (syns.some((syn) => syn.toLowerCase() === key)) {
        foundCondition = condition;
        break;
      }
    }

    if (foundCondition) {
      setResultKey(foundCondition.id);
      speakResult(
        foundCondition[language] || foundCondition["en"],
        language
      );
    } else {
      setResultKey("noMatch");
      speakResult([texts[language].emergencyNoMatch], language);
    }
  };

  // -------------------------------------------------------------------------
  // 4. DOWNLOAD PDF
  // -------------------------------------------------------------------------
  const downloadPDF = () => {
    if (!resultKey || resultKey === "noMatch") return;

    const condition = conditionsCache?.find((c) => c.id === resultKey);
    if (!condition) return;

    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(231, 34, 32);
    doc.text(texts[language].emergencyPDFHeader, 14, 20);
    doc.setLineWidth(0.5);
    doc.line(14, 24, 196, 24);

    const steps = condition[language] || condition["en"];
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    steps.forEach((step, i) => {
      doc.text(`${i + 1}. ${step}`, 14, 35 + i * 10);
    });

    doc.save("first_aid.pdf");
  };

  // -------------------------------------------------------------------------
  // 5. GET CURRENT STEPS
  // -------------------------------------------------------------------------
  const getSteps = () => {
    if (resultKey === "noMatch") return [texts[language].emergencyNoMatch];
    if (resultKey && conditionsCache) {
      const condition = conditionsCache.find((c) => c.id === resultKey);
      if (condition) return condition[language] || condition["en"];
    }
    return null;
  };

  const steps = getSteps();

  // -------------------------------------------------------------------------
  // 6. MIC INPUT
  // -------------------------------------------------------------------------
  const handleMicClick = () => {
    if (!micReady || listening) return;
    startListening(
      language,
      (text) => {
        setInput(text);
        handleSearch(text);
      },
      setListening
    );
  };

  // -------------------------------------------------------------------------
  // 7. ONE-TAP SOS
  // -------------------------------------------------------------------------
  const showToast = useCallback((message, type = "success") => {
    setSosToast({ message, type });
    setTimeout(() => setSosToast(null), 4000);
  }, []);

  const handleSOS = useCallback(() => {
    if (sosLoading) return;

    // Browser support check
    if (!navigator.geolocation) {
      showToast(t.sosErrNoSupport, "error");
      return;
    }

    setSosLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setSosLoading(false);
        const { latitude, longitude } = position.coords;
        const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
        const message = `${t.sosMessage}${mapsLink}`;
        // WhatsApp universal link – no phone number required.
        // Opens WhatsApp and lets the user choose the contact themselves.
        const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(waUrl, "_blank", "noopener,noreferrer");
        showToast(t.sosWhatsAppOpened, "success");
      },
      (error) => {
        setSosLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            showToast(t.sosErrPermission, "error");
            break;
          case error.POSITION_UNAVAILABLE:
            showToast(t.sosErrUnavailable, "error");
            break;
          case error.TIMEOUT:
            showToast(t.sosErrTimeout, "error");
            break;
          default:
            showToast(t.sosErrUnknown, "error");
        }
      },
      { timeout: 10000, maximumAge: 0 }
    );
  }, [sosLoading, t, showToast]);

  // -------------------------------------------------------------------------
  // 7. LANGUAGE TOGGLE → STOP OLD SPEECH + RE-SPEAK IN NEW LANGUAGE
  // -------------------------------------------------------------------------
  useEffect(() => {
    window.speechSynthesis.cancel();
    if (resultKey && conditionsCache) {
      if (resultKey === "noMatch") {
        speakResult([texts[language].emergencyNoMatch], language);
      } else {
        const condition = conditionsCache.find((c) => c.id === resultKey);
        if (condition) {
          speakResult(condition[language] || condition["en"], language);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  // -------------------------------------------------------------------------
  // RENDER
  // -------------------------------------------------------------------------
  const emergGuide = new URL("../assets/guideBox.png", import.meta.url).href;
  const isLoading = conditionsCache === null;

  return (
    <div className="max-w-4xl mx-auto px-6 pt-24 relative">
      {/* Background Circles */}
      <div className="absolute -top-32 -left-32 w-72 h-72 bg-gradient-to-tr from-red-200 via-blue-200 to-white rounded-full blur-3xl opacity-50" />
      <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-gradient-to-tr from-blue-200 via-red-200 to-white rounded-full blur-3xl opacity-50" />

      {/* SOS Toast Notification */}
      {sosToast && (
        <motion.div
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl text-white text-sm font-semibold ${
            sosToast.type === "success"
              ? "bg-gradient-to-r from-green-500 to-emerald-600"
              : "bg-gradient-to-r from-red-600 to-rose-700"
          }`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.35 }}
        >
          {sosToast.type === "error" && <AlertTriangle className="w-4 h-4 flex-shrink-0" />}
          <span>{sosToast.message}</span>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex flex-col items-center gap-4 mb-6 text-center">
        <motion.img
          src={emergGuide}
          alt={texts[language].emergencyHeaderImageAlt}
          className="w-24 md:w-28 rounded-xl shadow-md"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        />
        <motion.h2
          className="text-4xl font-extrabold text-red-600 drop-shadow-md"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          {texts[language].emergencyTitle}
        </motion.h2>

        {/* Data-source indicator */}
        {dataSource === "fallback" && (
          <motion.div
            className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <WifiOff className="w-3 h-3" />
            {fetchError
              ? "Using offline data (Supabase unavailable)"
              : "Using local data (Supabase not configured)"}
          </motion.div>
        )}

        {/* ── ONE-TAP SOS BUTTON ── */}
        <motion.button
          id="sos-button"
          onClick={handleSOS}
          disabled={sosLoading}
          className="relative mt-2 flex items-center justify-center gap-3 px-10 py-4 rounded-2xl font-extrabold text-2xl tracking-widest text-white shadow-2xl cursor-pointer select-none overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed bg-gradient-to-br from-red-500 via-red-600 to-red-800"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={!sosLoading ? { scale: 1.06 } : {}}
          whileTap={!sosLoading ? { scale: 0.97 } : {}}
        >
          {/* Pulsing ring */}
          {!sosLoading && (
            <span className="absolute inset-0 rounded-2xl animate-ping bg-red-500 opacity-30" />
          )}
          {sosLoading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-base font-semibold tracking-normal">{t.sosGettingLocation}</span>
            </>
          ) : (
            <>
              <span className="text-3xl leading-none">🚨</span>
              <span>{t.sosButtonLabel}</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="flex items-center justify-center gap-3 mt-10 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading emergency data…</span>
        </div>
      )}

      {/* Input Card – shown once data is ready */}
      {!isLoading && (
        <motion.div
          className="bg-white shadow-xl rounded-2xl p-6 flex flex-col md:flex-row items-center gap-3 hover:shadow-2xl transition-shadow duration-300 z-10 -mt-2"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <input
            value={input}
            onChange={(e) => {
              window.speechSynthesis.cancel();
              setInput(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            placeholder={texts[language].emergencyPlaceholder}
            className="flex-1 border-2 border-gray-200 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 transition-all duration-300"
          />

          {/* Search Button */}
          <motion.button
            onClick={() => handleSearch()}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white shadow-md transform hover:scale-105 transition-all duration-300 bg-gradient-to-r from-red-500 via-[#BC0201] to-blue-500 cursor-pointer"
            whileTap={{ scale: 0.97 }}
          >
            <Search className="w-5 h-5" />
            {texts[language].emergencySearchBtn}
          </motion.button>

          {/* Mic Button */}
          <motion.button
            onClick={handleMicClick}
            disabled={!micReady}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-white shadow-md ${
              micReady
                ? listening
                  ? "bg-red-600 animate-pulse"
                  : "bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600"
                : "bg-gray-300 cursor-not-allowed"
            } transform hover:scale-105 transition-all duration-300`}
            whileTap={{ scale: 0.95 }}
          >
            <Mic className="w-5 h-5" />
            {listening ? texts[language].listening : texts[language].voiceSearch}
          </motion.button>
        </motion.div>
      )}

      {/* Results */}
      {steps && (
        <motion.div
          className="mt-8 bg-gradient-to-r from-blue-50 via-white to-red-50 p-6 rounded-2xl shadow-lg relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6 text-red-600" />
            {texts[language].emergencyStepsHeading}
          </h3>
          <ul className="list-decimal list-inside space-y-2">
            {steps.map((step, i) => (
              <motion.li
                key={i}
                className="p-3 bg-white rounded-lg shadow hover:bg-red-50 transition-colors duration-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ scale: 1.02 }}
              >
                {step}
              </motion.li>
            ))}
          </ul>

          {resultKey !== "noMatch" && (
            <motion.button
              onClick={downloadPDF}
              className="mt-6 flex items-center gap-2 bg-blue-500 text-white px-5 py-3 rounded-lg hover:bg-blue-600 transform hover:scale-105 transition-all duration-300 shadow-md"
              whileTap={{ scale: 0.95 }}
            >
              <FileText className="w-5 h-5" />
              {texts[language].emergencyDownloadBtn}
            </motion.button>
          )}
        </motion.div>
      )}
    </div>
  );
}
