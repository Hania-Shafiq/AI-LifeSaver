import { useRef, useState } from "react";

export default function useSpeech(lang = "en-US") {
  const recRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [text, setText] = useState("");

  const getRec = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return null;
    const rec = new SR();
    rec.lang = lang;            // "ur-PK" for Urdu, "en-US" for English
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    return rec;
  };

  const start = () => {
    const rec = getRec();
    if (!rec) return;
    recRef.current = rec;
    setListening(true);
    rec.onresult = e => {
      const t = e.results[0][0].transcript;
      setText(t);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    rec.start();
  };

  const stop = () => {
    recRef.current?.stop();
    setListening(false);
  };

  return { text, setText, start, stop, listening };
}
