
// 🎤 Speech to Text
export const startListening = (language, setInput) => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Speech Recognition not supported in this browser.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = language === "ur" ? "ur-PK" : "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    setInput(transcript); // input state update
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
  };
};

// 🔊 Text to Speech
export const speakResult = (steps, language) => {
  if (!steps || steps.length === 0) return;

  const utterance = new SpeechSynthesisUtterance();
  utterance.lang = language === "ur" ? "ur-PK" : "en-US";
  utterance.text = steps.join(". ");

  window.speechSynthesis.speak(utterance);
};
