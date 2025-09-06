import { motion } from "framer-motion";
import { HeartPulse, Users, Rocket, Code } from "lucide-react";
import texts from "../data/texts.json";

function About({ language }) {
  return (
    <section className="min-h-screen bg-[#f0f7ff] py-20 px-6 font-inter">
      {/* Heading */}
      <div className="max-w-3xl mx-auto text-center mb-16 mt-10">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-gray-900 leading-snug"
        >
          {texts[language].aboutHeading}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-700 text-base md:text-lg mt-4 leading-relaxed"
        >
          {texts[language].aboutSubheading}
        </motion.p>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 max-w-6xl mx-auto">
        <motion.div
          className="bg-white shadow-md rounded-2xl p-6 text-center border border-gray-200"
          whileHover={{ scale: 1.05 }}
        >
          <HeartPulse className="h-10 w-10 mx-auto text-red-500 mb-3" />
          <h3 className="font-semibold text-lg">
            {texts[language].aboutMissionTitle}
          </h3>
          <p className="text-gray-600 text-sm mt-2">
            {texts[language].aboutMissionDesc}
          </p>
        </motion.div>

        <motion.div
          className="bg-white shadow-md rounded-2xl p-6 text-center border border-gray-200"
          whileHover={{ scale: 1.05 }}
        >
          <Users className="h-10 w-10 mx-auto text-red-500 mb-3" />
          <h3 className="font-semibold text-lg">
            {texts[language].aboutWhyTitle}
          </h3>
          <p className="text-gray-600 text-sm mt-2">
            {texts[language].aboutWhyDesc}
          </p>
        </motion.div>

        <motion.div
          className="bg-white shadow-md rounded-2xl p-6 text-center border border-gray-200"
          whileHover={{ scale: 1.05 }}
        >
          <Code className="h-10 w-10 mx-auto text-red-500 mb-3" />
          <h3 className="font-semibold text-lg">
            {texts[language].aboutTechTitle}
          </h3>
          <p className="text-gray-600 text-sm mt-2">
            {texts[language].aboutTechDesc}
          </p>
        </motion.div>

        <motion.div
          className="bg-white shadow-md rounded-2xl p-6 text-center border border-gray-200"
          whileHover={{ scale: 1.05 }}
        >
          <Rocket className="h-10 w-10 mx-auto text-red-500 mb-3" />
          <h3 className="font-semibold text-lg">
            {texts[language].aboutFutureTitle}
          </h3>
          <p className="text-gray-600 text-sm mt-2">
            {texts[language].aboutFutureDesc}
          </p>
        </motion.div>
      </div>

      {/* Closing Note */}
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-gray-700 text-md leading-relaxed">
          {texts[language].aboutClosingNote}
        </p>
      </div>
    </section>
  );
}

export default About;
