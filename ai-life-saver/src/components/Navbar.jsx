import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HeartPulse, Siren, Globe } from "lucide-react";

export default function Navbar() {
  return (
    <motion.nav
  initial={{ y: 0, opacity: 1 }}
  animate={{ y: 0, opacity: 1 }}
  className="fixed top-0 w-full z-50 
             bg-gradient-to-r from-[#E8F1FF] via-[#FFE5E5] to-blue-200
             backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.12)] 
             border-b border-white/30"
>

      <div className="max-w-7xl mx-auto flex items-center justify-between px-10 py-4">
        
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="p-2 rounded-full bg-gradient-to-r from-red-500 via-[#BC0201] to-blue-500 shadow-md">
            <HeartPulse className="text-white w-6 h-6" />
          </div>
          <h1 className="text-gray-900 font-extrabold text-2xl tracking-wide">
            AI{" "}
            <span className="bg-gradient-to-r from-red-500 via-[#BC0201] to-[#BC0201] bg-clip-text text-transparent">
              LifeSaver
            </span>
          </h1>
        </motion.div>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-10">
          <NavItem to="/" label="Home" />
          <NavItem to="/contacts" label="Contacts" />
          <NavItem to="/download" label="Download PDF" />

          {/* Emergency Button */}
          <motion.div whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/emergency"
              className="flex items-center gap-2 font-semibold text-white px-6 py-2 rounded-full 
                         bg-gradient-to-r from-red-500 via-[#BC0201] to-[#BC0201] 
                         hover:shadow-[0_0_25px_rgba(0,128,255,0.6)] transition"
            >
              <Siren className="w-5 h-5" /> Emergency
            </Link>
          </motion.div>

         {/* Language Toggle */}
<motion.div whileTap={{ scale: 0.95 }}>
  <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-full p-1">
    
    <button
      className="px-4 py-2 rounded-full text-sm font-semibold 
                 bg-gradient-to-r from-blue-500 to-blue-600 text-white 
                 shadow-md hover:opacity-90 transition"
    >
      English
    </button>
    
    <button
      className="px-4 py-2 rounded-full text-sm font-semibold 
                 text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition"
    >
      اردو
    </button>
  </div>
</motion.div>

        </div>
      </div>
    </motion.nav>
  );
}

// 🔹 Reusable NavItem
function NavItem({ to, label }) {
  return (
    <motion.div whileHover={{ y: -2 }} className="relative group">
      <Link
        to={to}
        className="text-gray-700 font-medium hover:text-blue-600 transition"
      >
        {label}
      </Link>
      <span className="absolute bottom-[-6px] left-0 w-0 h-[2px] 
                       bg-gradient-to-r from-red-500 via-pink-500 to-blue-500 
                       transition-all duration-500 group-hover:w-full"></span>
    </motion.div>
  );
}















