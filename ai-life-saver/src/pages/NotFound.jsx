import { motion } from "framer-motion";
import { FileDown, BookOpen } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-2xl w-full bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-10 text-center border border-blue-100"
      >
        {/* Header */}
        <div className="flex flex-col items-center gap-4">
          <BookOpen className="w-14 h-14 text-blue-600" />
          <h1 className="text-3xl font-extrabold text-gray-900">
            First Aid Guide
          </h1>
          <p className="text-gray-600 max-w-md">
            Download an <span className="font-semibold">offline PDF guide</span> 
            with step-by-step instructions for the most common emergencies. 
            Access life-saving information even without internet.
          </p>
        </div>

        {/* Download Button */}
        <motion.a
          href="/first-aid-guide.pdf"
          download
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 inline-flex items-center gap-3 px-8 py-3 rounded-full 
                     bg-gradient-to-r from-red-500 via-pink-500 to-blue-600
                     text-white font-semibold shadow-lg hover:shadow-[0_0_25px_rgba(0,128,255,0.6)] 
                     transition"
        >
          <FileDown className="w-6 h-6" />
          Download PDF
        </motion.a>

        {/* Extra Tip */}
        <p className="mt-6 text-sm text-gray-500">
          📲 Works on both <span className="font-medium">mobile & desktop</span>.  
          Keep it saved for emergencies!
        </p>
      </motion.div>
    </div>
  );
}

