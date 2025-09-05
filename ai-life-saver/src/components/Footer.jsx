import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HeartPulse, Globe, Siren } from "lucide-react";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full mt-20 
                 bg-gradient-to-r from-[#E8F1FF] via-[#FFE5E5] to-blue-200
                 backdrop-blur-xl shadow-[0_-4px_20px_rgba(0,0,0,0.12)] 
                 border-t border-white/30"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-10 py-6 gap-6">

        {/* Logo & Tagline */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="p-2 rounded-full bg-gradient-to-r from-red-500 via-[#BC0201] to-blue-500 shadow-md">
            <HeartPulse className="text-white w-6 h-6" />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-gray-900 font-extrabold text-xl tracking-wide">
              AI{" "}
              <span className="bg-gradient-to-r from-red-500 via-[#BC0201] to-[#BC0201] bg-clip-text text-transparent">
                LifeSaver
              </span>
            </h1>
            <p className="text-gray-600 text-sm">Your AI Emergency Companion</p>
          </div>
        </div>


       
      </div>

      <div className="text-center text-gray-500 text-sm py-4 border-t border-white/20">
        © {new Date().getFullYear()} AI LifeSaver. All rights reserved.
      </div>
    </motion.footer>
  );
}

// 🔹 Reusable Footer Link
function FooterLink({ to, label, icon }) {
  return (
    <motion.div whileHover={{ y: -2 }} className="relative group">
      <Link
        to={to}
        className="text-gray-700 font-medium hover:text-blue-600 transition flex items-center gap-1"
      >
        {icon && icon} {label}
      </Link>
      <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] 
                       bg-gradient-to-r from-red-500 via-pink-500 to-blue-500 
                       transition-all duration-500 group-hover:w-full"></span>
    </motion.div>
  );
}
