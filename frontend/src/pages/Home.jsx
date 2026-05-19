import React from "react";
import { 
  FaLeaf, 
  FaStethoscope, 
  FaGlobe, 
  FaMicrophone, 
  FaLanguage, 
  FaChevronRight, 
  FaRobot, 
  FaHeartbeat, 
  FaSeedling 
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import heroBanner from "../assets/home_banner.png";

const Home = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => i18n.changeLanguage(lng);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.2, delayChildren: 0.3 } 
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans overflow-x-hidden">
      {/* 🚀 Immersive Hero Section */}
      <div className="relative h-[85vh] md:h-[90vh] w-full overflow-hidden">
        <img 
          src={heroBanner} 
          alt="Rural India Innovation" 
          className="absolute inset-0 w-full h-full object-cover scale-105 animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-[#f8fafc]" />
        
        {/* Navigation Header */}
        <header className="absolute top-0 left-0 w-full flex items-center justify-between px-6 md:px-12 py-6 z-50">
          <motion.div 
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center space-x-3 bg-white/20 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/30 shadow-2xl"
          >
            <div className="bg-gradient-to-br from-green-500 to-emerald-400 p-2 rounded-xl text-white text-xl">
              <FaRobot />
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
              BharatAI Assist <span className="text-green-400 font-normal">🇮🇳</span>
            </h1>
          </motion.div>

          <motion.div 
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center space-x-2 bg-white/20 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/30 shadow-2xl"
          >
            <FaGlobe className="text-white text-lg" />
            <select
              value={i18n.language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="outline-none bg-transparent text-white text-sm cursor-pointer font-bold"
            >
              <option value="en" className="text-gray-800">English</option>
              <option value="hi" className="text-gray-800">हिन्दी</option>
              <option value="te" className="text-gray-800">తెలుగు</option>
              <option value="ta" className="text-gray-800">தமிழ்</option>
            </select>
          </motion.div>
        </header>

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 mt-[-5vh]">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-6 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 text-white font-bold tracking-widest text-xs md:text-sm uppercase"
          >
            Building the Future of Rural India
          </motion.div>
          <motion.h1 
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-8xl font-black text-white mb-6 drop-shadow-2xl leading-tight"
          >
            {t("title").split("&").map((part, idx) => (
              <span key={idx} className={idx === 1 ? "text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400" : ""}>
                {idx === 1 ? ` & ${part}` : part}
              </span>
            ))}
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-2xl text-blue-50 font-medium max-w-2xl drop-shadow-lg mb-12"
          >
            {t("subtitle")}
          </motion.p>

          {/* Core Feature Buttons */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col md:flex-row items-center justify-center gap-6"
          >
            <AssistantCard
              icon={<FaSeedling className="text-green-500" />}
              title={t("agriculture")}
              desc={t("agriShortDesc")}
              btnColor="bg-green-600 shadow-green-500/40"
              onClick={() => navigate("/Agriculture")}
            />
            <AssistantCard
              icon={<FaHeartbeat className="text-blue-500" />}
              title={t("healthcare")}
              desc={t("healthShortDesc")}
              btnColor="bg-blue-600 shadow-blue-500/40"
              onClick={() => navigate("/Healthcare")}
            />
          </motion.div>
        </div>
      </div>

      {/* 🧩 Bottom Feature Bar */}
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-6 -mt-20 relative z-20"
      >
        <div className="bg-white/80 backdrop-blur-3xl rounded-[3rem] shadow-2xl border border-white p-8 md:p-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <FeatureItem
            icon={<FaMicrophone className="text-green-600" />}
            title={t("voice")}
            desc={t("voiceDesc")}
          />
          <FeatureItem
            icon={<FaLanguage className="text-blue-600" />}
            title={t("multilingual")}
            desc={t("multiDesc")}
          />
          <FeatureItem
            icon={<FaLeaf className="text-emerald-600" />}
            title={t("agriShort")}
            desc={t("agriShortDesc")}
          />
          <FeatureItem
            icon={<FaStethoscope className="text-pink-600" />}
            title={t("healthShort")}
            desc={t("healthShortDesc")}
          />
        </div>
      </motion.div>

      {/* 🏛️ Mission Section */}
      <section className="py-24 px-6 text-center max-w-4xl mx-auto">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-green-50 to-blue-50 p-12 rounded-[3rem] border border-white shadow-xl"
        >
          <h2 className="text-3xl md:text-5xl font-black text-gray-800 mb-6 italic">
            "Empowering every farm, every family."
          </h2>
          <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
            BharatAI Assist is more than just an app; it's a digital companion for rural India. 
            By bridging the gap between advanced AI and local languages, we are ensuring that 
            essential knowledge for health and farming is just a tap away for everyone.
          </p>
        </motion.div>
      </section>

      {/* 📍 Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div>
            <h2 className="text-2xl font-black mb-2 flex items-center justify-center md:justify-start gap-3">
              <FaRobot className="text-green-400" /> BharatAI Assist
            </h2>
            <p className="text-gray-400 max-w-xs">Helping rural India thrive through high-tech, voice-first AI guidance.</p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-gray-400 text-sm">© {new Date().getFullYear()} BharatAI — Empowering 1.4 Billion Dreams</p>
            <div className="flex justify-center md:justify-end gap-6 mt-4 text-xs font-bold uppercase tracking-widest text-green-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slow-zoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 20s infinite alternate ease-in-out;
        }
      `}} />
    </div>
  );
};

const AssistantCard = ({ icon, title, desc, btnColor, onClick }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="bg-white/10 backdrop-blur-2xl border border-white/20 p-8 rounded-[2.5rem] w-full md:w-[350px] shadow-2xl group transition-all"
  >
    <div className="text-5xl mb-6 flex justify-center group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-2xl font-black text-white mb-2">{title}</h3>
    <p className="text-blue-50/80 mb-8 text-sm">{desc}</p>
    <button 
      onClick={onClick}
      className={`w-full py-4 rounded-2xl text-white font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 group-hover:translate-x-1 transition-all shadow-xl ${btnColor}`}
    >
      Start Now <FaChevronRight className="text-xs" />
    </button>
  </motion.div>
);

const FeatureItem = ({ icon, title, desc }) => (
  <div className="flex flex-col items-center text-center group">
    <div className="p-4 bg-gray-50 rounded-2xl text-3xl mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-inner">
      {icon}
    </div>
    <h4 className="text-lg font-black text-gray-800 mb-2">{title}</h4>
    <p className="text-gray-500 text-xs leading-relaxed max-w-[150px]">{desc}</p>
  </div>
);

export default Home;
