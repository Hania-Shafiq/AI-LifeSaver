import { useState, useEffect, useRef } from "react";
import texts from "../data/texts.json";
import supabase from "../lib/supabaseClient";

const FUNCTION_NAME = "ai-first-aid";

export default function AiChat({ language }) {
  const [open, setOpen] = useState(false);
  const [currentText, setCurrentText] = useState(texts.aiChat[language]);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const listRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    setCurrentText(texts.aiChat[language]);
  }, [language]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, loading, open]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const sendMessage = async (e) => {
    e?.preventDefault?.();
    const question = input.trim();
    if (!question || loading) return;

    if (!supabase) {
      setError(currentText.aiChatNotConfigured);
      return;
    }

    setError(null);
    setInput("");

    const userMsg = { id: crypto.randomUUID(), role: "user", content: question };
    const assistantId = crypto.randomUUID();
    const history = messages.map(({ role, content }) => ({ role, content }));

    setMessages((prev) => [
      ...prev,
      userMsg,
      { id: assistantId, role: "assistant", content: "" },
    ]);
    setLoading(true);

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const res = await fetch(`${supabaseUrl}/functions/v1/${FUNCTION_NAME}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${anonKey}`,
          apikey: anonKey,
        },
        body: JSON.stringify({
          message: question,
          language,
          history,
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        let detail = currentText.aiChatError;
        try {
          const payload = await res.json();
          if (payload?.error) detail = payload.error;
        } catch {
          // keep default
        }
        throw new Error(detail);
      }

      if (!res.body) {
        throw new Error(currentText.aiChatError);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        const snapshot = accumulated;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: snapshot } : m,
          ),
        );
      }

      if (!accumulated.trim()) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: currentText.aiChatEmptyReply }
              : m,
          ),
        );
      }
    } catch (err) {
      if (err?.name === "AbortError") return;
      console.error("[AiChat]", err);
      setError(err?.message || currentText.aiChatError);
      setMessages((prev) =>
        prev.filter(
          (m) => !(m.id === assistantId && !m.content),
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Floating Chat Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={currentText.aiChatTitle}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "#2563eb",
          color: "white",
          borderRadius: "50%",
          width: "50px",
          height: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "22px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          border: "none",
          cursor: "pointer",
          zIndex: 1000,
          transition: "transform 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        💬
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            width: "320px",
            maxWidth: "calc(100vw - 40px)",
            height: "420px",
            maxHeight: "calc(100vh - 120px)",
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            fontFamily: "sans-serif",
            color: "#333",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 12px",
              borderBottom: "1px solid #e5e7eb",
              backgroundColor: "#f8fafc",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "20px" }}>🤖</span>
              <strong style={{ color: "#2563eb", fontSize: "14px" }}>
                {currentText.aiChatTitle}
              </strong>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: "18px",
                lineHeight: 1,
                color: "#64748b",
              }}
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div
            ref={listRef}
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              backgroundColor: "#fff",
            }}
          >
            {messages.length === 0 && (
              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  color: "#64748b",
                  lineHeight: 1.4,
                }}
              >
                {currentText.aiChatWelcome}
              </p>
            )}

            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                  backgroundColor:
                    m.role === "user" ? "#2563eb" : "#f1f5f9",
                  color: m.role === "user" ? "#fff" : "#1e293b",
                  borderRadius: "10px",
                  padding: "8px 10px",
                  fontSize: "12px",
                  lineHeight: 1.45,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {m.content || (loading && m.role === "assistant" ? "…" : "")}
              </div>
            ))}

            {loading &&
              messages[messages.length - 1]?.role === "assistant" &&
              !messages[messages.length - 1]?.content && (
                <p
                  style={{
                    margin: 0,
                    fontSize: "11px",
                    color: "#64748b",
                  }}
                >
                  {currentText.aiChatTyping}
                </p>
              )}

            {error && (
              <p
                style={{
                  margin: 0,
                  fontSize: "11px",
                  color: "#b91c1c",
                  lineHeight: 1.35,
                }}
              >
                {error}
              </p>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={sendMessage}
            style={{
              display: "flex",
              gap: "6px",
              padding: "10px",
              borderTop: "1px solid #e5e7eb",
              backgroundColor: "#f8fafc",
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={currentText.aiChatPlaceholder}
              disabled={loading}
              dir={language === "ur" ? "rtl" : "ltr"}
              style={{
                flex: 1,
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "8px 10px",
                fontSize: "12px",
                outline: "none",
              }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                backgroundColor: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "8px 12px",
                fontSize: "12px",
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                opacity: loading || !input.trim() ? 0.6 : 1,
                whiteSpace: "nowrap",
              }}
            >
              {currentText.aiChatSend}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
