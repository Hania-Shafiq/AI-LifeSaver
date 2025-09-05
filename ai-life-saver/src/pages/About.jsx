import { motion } from "framer-motion";
import { HeartPulse, Users, Rocket, Code } from "lucide-react";

function About() {
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
          About AI LifeSaver
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-700 text-base md:text-lg mt-4 leading-relaxed"
        >
          AI LifeSaver is a bilingual (Urdu & English) AI-powered first aid assistant 
          designed to provide instant, step-by-step emergency guidance with text, 
          visuals, and emergency contacts.
        </motion.p>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 max-w-6xl mx-auto">
        <motion.div
          className="bg-white shadow-md rounded-2xl p-6 text-center border border-gray-200"
          whileHover={{ scale: 1.05 }}
        >
          <HeartPulse className="h-10 w-10 mx-auto text-red-500 mb-3" />
          <h3 className="font-semibold text-lg">Mission</h3>
          <p className="text-gray-600 text-sm mt-2">
            To make first aid knowledge accessible to everyone instantly in critical situations.
          </p>
        </motion.div>

        <motion.div
          className="bg-white shadow-md rounded-2xl p-6 text-center border border-gray-200"
          whileHover={{ scale: 1.05 }}
        >
          <Users className="h-10 w-10 mx-auto text-red-500 mb-3" />
          <h3 className="font-semibold text-lg">Why This Project?</h3>
          <p className="text-gray-600 text-sm mt-2">
            Many people panic in emergencies. AI LifeSaver helps them act calmly with proper guidance.
          </p>
        </motion.div>

        <motion.div
          className="bg-white shadow-md rounded-2xl p-6 text-center border border-gray-200"
          whileHover={{ scale: 1.05 }}
        >
          <Code className="h-10 w-10 mx-auto text-red-500 mb-3" />
          <h3 className="font-semibold text-lg">Technology</h3>
          <p className="text-gray-600 text-sm mt-2">
            Built with React, TailwindCSS, Vite, Framer Motion, and jsPDF for seamless experience.
          </p>
        </motion.div>

        <motion.div
          className="bg-white shadow-md rounded-2xl p-6 text-center border border-gray-200"
          whileHover={{ scale: 1.05 }}
        >
          <Rocket className="h-10 w-10 mx-auto text-red-500 mb-3" />
          <h3 className="font-semibold text-lg">Future Scope</h3>
          <p className="text-gray-600 text-sm mt-2">
            AI chatbot, hospital APIs, offline mobile app, and image recognition for first aid.
          </p>
        </motion.div>
      </div>

      {/* Closing Note */}
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-gray-700 text-md leading-relaxed">
          AI LifeSaver is not just a project—it’s an initiative to spread awareness 
          and save lives. Share it with your family and friends so more people 
          can be prepared in emergencies.
        </p>
      </div>
    </section>
  );
}

export default About;
