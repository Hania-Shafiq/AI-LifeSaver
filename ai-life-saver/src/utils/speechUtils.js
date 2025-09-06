// 🎤 Speech to Text
export const startListening = (language, setInput, setListening) => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Speech recognition not supported in this browser.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = language === "ur" ? "ur-PK" : "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  // Mic started
  recognition.onstart = () => {
    setListening(true);
    window.speechSynthesis.cancel(); // stop ongoing speech
  };

  recognition.start();

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.replace(/\.$/, "");
    setInput(transcript); // update input state
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    setListening(false);
  };

  recognition.onend = () => {
    setListening(false);
  };
};

export const speakResult = (steps, language) => {
  if (!steps || steps.length === 0) return;

  // Cancel any old speech
  window.speechSynthesis.cancel();

  // Get available voices
  const voices = window.speechSynthesis.getVoices();
  let selectedVoice = null;

  if (language === "ur") {
    // Try to find an Urdu voice, fallback to Hindi or English
    selectedVoice =
      voices.find(
        (v) =>
          v.lang.toLowerCase().includes("ur") ||
          v.name.toLowerCase().includes("urdu")
      ) ||
      voices.find((v) => v.lang.toLowerCase().includes("hi")) ||
      voices.find((v) => v.lang.toLowerCase().includes("en")) ||
      voices[0];
  } else {
    selectedVoice =
      voices.find((v) => v.lang.toLowerCase().includes("en")) || voices[0];
  }

  // Speak each step separately
  steps.forEach((step) => {
    const utterance = new SpeechSynthesisUtterance(step);
    utterance.lang = language === "ur" ? "ur-PK" : "en-US";
    if (selectedVoice) utterance.voice = selectedVoice;
    window.speechSynthesis.speak(utterance);
  });
};
