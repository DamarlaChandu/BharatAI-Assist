/* eslint-disable react/prop-types */
import React, { useState } from "react";
import axios from "axios";
import { 
  FaArrowLeft, 
  FaHeartbeat, 
  FaHospital, 
  FaStethoscope, 
  FaBriefcaseMedical, 
  FaSearchLocation, 
  FaLanguage,
  FaSpinner,
  FaPhoneAlt,
  FaMapMarkerAlt
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import bannerImg from "../assets/healthcare_banner.png";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "te", label: "తెలుగు" },
  { code: "ta", label: "தமிழ்" },
];

export default function Healthcare() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [symptom, setSymptom] = useState("");
  const [symptomResult, setSymptomResult] = useState("");
  const [symptomLoading, setSymptomLoading] = useState(false);

  const [disease, setDisease] = useState("");
  const [tipsResult, setTipsResult] = useState("");
  const [tipsLoading, setTipsLoading] = useState(false);

  const [location, setLocation] = useState("");
  const [resources, setResources] = useState([]);
  const [resourceLoading, setResourceLoading] = useState(false);

  const API_BASE = "http://localhost:5000/api/health";

  // 🩺 Symptom Checker Handler
  const handleSymptomCheck = async (e) => {
    e.preventDefault();
    if (!symptom.trim()) return alert(t("describeSymptoms"));
    setSymptomLoading(true);
    setSymptomResult("");
    try {
      const res = await axios.post(`${API_BASE}/symptom`, { symptoms: symptom });
      setSymptomResult(res.data.reply || t("noResponse"));
    } catch (err) {
      alert(t("analyzeFailed"));
    } finally {
      setSymptomLoading(false);
    }
  };

  // 💡 Preventive Tips Handler
  const handleGetTips = async (e) => {
    e.preventDefault();
    if (!disease.trim()) return alert(t("enterDiseasePlaceholder"));
    setTipsLoading(true);
    setTipsResult("");
    try {
      const res = await axios.post(`${API_BASE}/tips`, { disease });
      setTipsResult(res.data.reply || t("noResponse"));
    } catch (err) {
      alert(t("analyzeFailed"));
    } finally {
      setTipsLoading(false);
    }
  };

  // 🏥 Nearby Resources Handler
  const handleGetResources = async (e) => {
    if (e) e.preventDefault();
    if (!location.trim()) return alert(t("enterLocationPlaceholder"));
    setResourceLoading(true);
    setResources([]);
    try {
      const res = await axios.get(`${API_BASE}/resources`, { params: { location } });
      setResources(res.data.data || []);
    } catch (err) {
      alert(t("noResourcesFound"));
    } finally {
      setResourceLoading(false);
    }
  };

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-[#f0f7ff] font-sans pb-12">
      {/* 🌟 Premium Hero Header */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden shadow-xl">
        <img 
          src={bannerImg} 
          alt="Healthcare Banner" 
          className="w-full h-full object-cover transform scale-105 hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-transparent flex flex-col justify-center px-6 md:px-12">
          <motion.button
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            onClick={() => navigate("/")}
            className="absolute top-6 left-6 flex items-center gap-2 text-white/90 hover:text-white bg-white/20 backdrop-blur-md px-4 py-2 rounded-full transition-all border border-white/30"
          >
            <FaArrowLeft /> {t("back")}
          </motion.button>

          <div className="absolute top-6 right-6 flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30">
            <FaLanguage className="text-white text-lg" />
            <select
              value={i18n.language}
              onChange={handleLanguageChange}
              className="bg-transparent text-white text-sm outline-none cursor-pointer font-medium"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="text-gray-800">
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-3xl md:text-5xl font-bold text-white flex items-center gap-4 mb-2">
              <FaHeartbeat className="text-red-400 animate-pulse" />
              {t("healthcareAssistant")}
            </h1>
            <p className="text-blue-100 text-lg md:text-xl font-medium max-w-lg">
              {t("aiHealthGuidance")}
            </p>
          </motion.div>
        </div>
      </div>

      {/* 🌈 Main Content Grid */}
      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-6 -mt-10 relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {/* 🩺 Symptom Checker Card */}
        <motion.section variants={cardVariants} className="bg-white/90 backdrop-blur-lg p-6 rounded-3xl shadow-2xl border border-white hover:shadow-blue-200 transition-shadow flex flex-col">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 rounded-2xl text-blue-600 text-2xl shadow-inner">
              <FaStethoscope />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{t("symptomChecker")}</h2>
          </div>
          <p className="text-gray-600 mb-6 text-sm">{t("describeSymptoms")}</p>
          
          <form onSubmit={handleSymptomCheck} className="flex-grow flex flex-col gap-4">
            <textarea
              placeholder={t("enterSymptomsPlaceholder")}
              value={symptom}
              onChange={(e) => setSymptom(e.target.value)}
              className="w-full p-4 border border-blue-100 rounded-2xl bg-blue-50/50 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none text-gray-700 min-h-[120px]"
            />
            <button
              type="submit"
              disabled={symptomLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-blue-300 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {symptomLoading ? <FaSpinner className="animate-spin" /> : <FaHeartbeat />}
              {symptomLoading ? t("analyzingSymptoms") : t("checkSymptoms")}
            </button>
          </form>

          <AnimatePresence>
            {symptomResult && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 bg-indigo-50/80 p-5 rounded-2xl border border-indigo-100 overflow-hidden"
              >
                <div className="flex items-center gap-2 text-indigo-700 font-bold mb-3">
                  <FaBriefcaseMedical /> {t("aiResultHealth")}
                </div>
                <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto custom-scrollbar">
                  {symptomResult}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* 💡 Preventive Tips Card */}
        <motion.section variants={cardVariants} className="bg-white/90 backdrop-blur-lg p-6 rounded-3xl shadow-2xl border border-white hover:shadow-green-200 transition-shadow flex flex-col">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-green-100 rounded-2xl text-green-600 text-2xl shadow-inner">
              <FaBriefcaseMedical />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{t("preventiveTips")}</h2>
          </div>
          <p className="text-gray-600 mb-6 text-sm">{t("preventiveHealthTips")}</p>

          <form onSubmit={handleGetTips} className="flex-grow flex flex-col gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder={t("enterDiseasePlaceholder")}
                value={disease}
                onChange={(e) => setDisease(e.target.value)}
                className="w-full p-4 border border-green-100 rounded-2xl bg-green-50/50 focus:bg-white focus:ring-4 focus:ring-green-100 outline-none transition-all text-gray-700"
              />
            </div>
            <button
              type="submit"
              disabled={tipsLoading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-green-300 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {tipsLoading ? <FaSpinner className="animate-spin" /> : <FaSearchLocation />}
              {tipsLoading ? t("loading") : t("getTips")}
            </button>
          </form>

          <AnimatePresence>
            {tipsResult && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 bg-green-50/80 p-5 rounded-2xl border border-green-100 overflow-hidden"
              >
                <div className="flex items-center gap-2 text-green-700 font-bold mb-3">
                  <FaBriefcaseMedical /> {t("tips")}
                </div>
                <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto custom-scrollbar">
                  {tipsResult}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* 🏥 Nearby Resources Card */}
        <motion.section variants={cardVariants} className="bg-white/90 backdrop-blur-lg p-6 rounded-3xl shadow-2xl border border-white hover:shadow-purple-200 transition-shadow flex flex-col">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-100 rounded-2xl text-purple-600 text-2xl shadow-inner">
              <FaHospital />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{t("nearbyResources")}</h2>
          </div>
          <p className="text-gray-600 mb-6 text-sm">{t("nearbyHealthResources")}</p>

          <div className="flex-grow flex flex-col gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder={t("enterLocationPlaceholder")}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-4 border border-purple-100 rounded-2xl bg-purple-50/50 focus:bg-white focus:ring-4 focus:ring-purple-100 outline-none transition-all text-gray-700"
              />
            </div>
            <button
              onClick={handleGetResources}
              disabled={resourceLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-purple-300 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {resourceLoading ? <FaSpinner className="animate-spin" /> : <FaSearchLocation />}
              {resourceLoading ? t("loading") : t("findResources")}
            </button>
          </div>

          <div className="mt-6 flex-grow overflow-y-auto custom-scrollbar max-h-[300px] space-y-3">
            {resourceLoading && (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <FaSpinner className="animate-spin text-3xl mb-2" />
                <p>{t("loading")}</p>
              </div>
            )}
            
            {!resourceLoading && resources.length === 0 && location && (
              <div className="text-center py-10 text-gray-400 italic text-sm">
                {t("noResourcesFound")}
              </div>
            )}

            {!resourceLoading && resources.map((res, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-white border border-purple-100 hover:border-purple-300 transition-all shadow-sm"
              >
                <h4 className="font-bold text-gray-800 flex items-center gap-2 mb-1">
                  <FaHospital className="text-purple-600" />
                  {res.name}
                </h4>
                <p className="text-xs text-gray-600 flex items-start gap-2 mb-2">
                  <FaMapMarkerAlt className="mt-1 flex-shrink-0" />
                  {res.address}
                </p>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    {res.type || "Medical Center"}
                  </span>
                  {res.contact && res.contact !== "N/A" && (
                    <a href={`tel:${res.contact}`} className="flex items-center gap-1 text-blue-600 hover:underline font-bold">
                      <FaPhoneAlt /> {res.contact}
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </motion.main>

      {/* 🏥 Emergency Footer */}
      <footer className="max-w-7xl mx-auto px-6 mt-12">
        <div className="bg-red-50 border border-red-100 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="p-4 bg-red-100 text-red-600 text-3xl rounded-full animate-bounce">
              <FaPhoneAlt />
            </div>
            <div>
              <h3 className="text-xl font-bold text-red-800 uppercase tracking-wide">Emergency Helpline</h3>
              <p className="text-red-600 font-medium">Dial 108 for immediate ambulance services across India.</p>
            </div>
          </div>
          <a 
            href="tel:108"
            className="px-12 py-4 bg-red-600 text-white font-black text-2xl rounded-2xl shadow-xl hover:bg-red-700 transition-all hover:scale-105 active:scale-95"
          >
            CALL 108
          </a>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}} />
    </div>
  );
}
