import { useState } from "react";
import { motion } from "framer-motion";
import { Search, FileText } from "lucide-react";
import { jsPDF } from "jspdf";
import firstAidData from "../data/firstAid.json";
import emergGuide from "../assets/guideBox.png";
import texts from "../data/texts.json";

export default function Emergency({ language }) {
  const [input, setInput] = useState("");
  const [resultKey, setResultKey] = useState(null);

  // Handle Search
  const handleSearch = () => {
    const key = input.toLowerCase().trim();
    if (firstAidData[key]) {
      setResultKey(key); // store only the key
    } else {
      setResultKey("noMatch");
    }
  };

  // Download PDF
  const downloadPDF = () => {
    if (!resultKey || resultKey === "noMatch") return;

    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.setTextColor(231, 34, 32);
    doc.text(texts[language].emergencyPDFHeader, 14, 20);

    // Line under header
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(14, 24, 196, 24);

    // Steps
    const steps = firstAidData[resultKey][language] || firstAidData[resultKey]["en"];
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    steps.forEach((step, i) => {
      doc.text(`${i + 1}. ${step}`, 14, 35 + i * 10);
    });

    doc.save("first_aid.pdf");
  };

  // Resolve steps dynamically
  const getSteps = () => {
    if (resultKey === "noMatch") return [texts[language].emergencyNoMatch];
    if (resultKey && firstAidData[resultKey]) {
      return firstAidData[resultKey][language] || firstAidData[resultKey]["en"];
    }
    return null;
  };

  const steps = getSteps();

  return (
    <div className="max-w-4xl mx-auto px-6 pt-24 relative">
      {/* Background Gradient Circles */}
      <div className="absolute -top-32 -left-32 w-72 h-72 bg-gradient-to-tr from-red-200 via-blue-200 to-white rounded-full blur-3xl opacity-50"></div>
      <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-gradient-to-tr from-blue-200 via-red-200 to-white rounded-full blur-3xl opacity-50"></div>

      {/* Header with Image */}
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
      </div>

      {/* Input Card */}
      <motion.div
        className="bg-white shadow-xl rounded-2xl p-6 flex flex-col md:flex-row items-center gap-3 hover:shadow-2xl transition-shadow duration-300 z-10 -mt-2"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={texts[language].emergencyPlaceholder}
          className="flex-1 border-2 border-gray-200 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 transition-all duration-300"
        />

        <motion.button
          onClick={handleSearch}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-white shadow-md transform hover:scale-105 transition-all duration-300 bg-gradient-to-r from-red-500 via-[#BC0201] to-blue-500 cursor-pointer"
          whileTap={{ scale: 0.97 }}
        >
          <Search className="w-5 h-5" />
          {texts[language].emergencySearchBtn}
        </motion.button>
      </motion.div>

      {/* Results Section */}
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
