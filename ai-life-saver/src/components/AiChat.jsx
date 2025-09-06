import { useState, useEffect } from "react";
import texts from "../data/texts.json";

export default function AiChat({ language }) {
  const [open, setOpen] = useState(false);
  const [currentText, setCurrentText] = useState(texts.aiChat[language]);

  useEffect(() => {
    setCurrentText(texts.aiChat[language]);
  }, [language]);

  return (
    <div>
      {/* Floating Chat Button */}
      <button
        onClick={() => setOpen(!open)}
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

      {/* Small Horizontal Chat Banner */}
      {open && (
        <div
          onMouseLeave={() => setOpen(false)}
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            width: "250px",
            height: "60px",
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            padding: "10px",
            fontFamily: "sans-serif",
            fontSize: "13px",
            color: "#333",
          }}
        >
          <span style={{ fontSize: "20px", marginRight: "8px" }}>🤖</span>
          <div>
            <strong style={{ color: "#2563eb", fontSize: "14px" }}>
              {currentText.aiChatTitle}
            </strong>
            <p
              style={{
                margin: 0,
                fontSize: "12px",
                lineHeight: "1.2",
              }}
            >
              {currentText.aiChatComingSoon}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
