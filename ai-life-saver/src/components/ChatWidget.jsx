import { useState } from "react";
import AiChat from "./AiChat";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);

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
          width: "60px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "24px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          border: "none",
          cursor: "pointer",
          zIndex: 1000,
        }}
      >
        💬
      </button>

      {/* Chat Box */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "350px",
            height: "450px",
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            zIndex: 1000,
            overflow: "hidden",
          }}
        >
          <AiChat />
        </div>
      )}
    </div>
  );
}
