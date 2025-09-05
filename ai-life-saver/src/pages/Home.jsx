import { motion } from "framer-motion";
import hero from '../assets/HeroImg.png';
import { Bandage, Info, HeartPulse } from "lucide-react";
import { useNavigate } from "react-router-dom";
import texts from "../data/texts.json";

export default function Home({ language }) {
  const navigate = useNavigate();
  const t = texts[language];

  return (
    <section className="w-full bg-gradient-to-br from-white via-[#E8F1FF] to-[#f8fbff] py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center px-6 lg:px-12 gap-20">
        
        {/* Left Text Section */}
        <motion.div className="md:w-1/2 text-center md:text-left"
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Logo + Title */}
          <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2 cursor-pointer">
              <div className="p-3 rounded-full bg-gradient-to-r from-red-500 via-[#BC0201] to-blue-500 shadow-md">
                <HeartPulse className="text-white w-8 h-8" />
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold leading-snug tracking-wide">
                {t.heroTitle.split(" ")[0]}{" "}
                <span className="bg-gradient-to-r from-red-500 via-[#BC0201] to-[#BC0201] bg-clip-text text-transparent">
                  {t.heroTitle.split(" ")[1]}
                </span>
              </h1>
            </motion.div>
          </div>

          {/* Red Accent Line */}
          <motion.div className="w-35 h-1 bg-[#E72220] mx-auto md:mx-0 mb-6 rounded-full"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          />

          {/* Sub Text */}
          <motion.p className="text-lg md:text-xl text-gray-600 mb-10 max-w-lg"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {t.heroSubtitle}
          </motion.p>

          {/* Buttons */}
          <motion.div className="flex justify-center md:justify-start gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
            }}
          >
            <motion.button
              className="flex items-center gap-2 bg-[#E72220] text-white px-8 py-4 rounded-full shadow-md hover:bg-[#BC0201] transform hover:scale-105 transition-all duration-300"
              variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
              onClick={() => navigate("/emergency")}
            >
              <Bandage className="w-5 h-5" />
              {t.getStarted}
            </motion.button>

            <motion.button
              className="flex items-center gap-2 bg-white border-2 border-[#3A8DFF] text-[#3A8DFF] px-8 py-4 rounded-full shadow-md hover:bg-[#004AAD] hover:text-white transform hover:scale-105 transition-all duration-300"
              variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
              onClick={() => navigate("/contacts")}
            >
              <Info className="w-5 h-5" />
              {t.learnMore}
            </motion.button>
          </motion.div>

          {/* Language Note */}
          <motion.p className="mt-6 text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            {t.availableIn} <span className="text-[#004AAD] font-semibold">English</span> & <span className="text-[#E72220] font-semibold">Urdu</span>
          </motion.p>
        </motion.div>

        {/* Right Image Section */}
        <motion.div className="md:w-1/2 w-full flex justify-end relative"
          initial={{ x: 80, opacity: 0, scale: 0.9 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="absolute w-80 h-80 bg-gradient-to-tr from-[#E8F1FF]/80 via-white to-[#FFE5E5]/60 rounded-full blur-3xl"></div>
          <motion.img
            src={hero}
            alt="AI LifeSaver First Aid"
            className="w-full max-w-2xl object-contain relative"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.4 }}
          />
        </motion.div>
      </div>
    </section>
  );
}
