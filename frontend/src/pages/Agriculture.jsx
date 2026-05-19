/* eslint-disable react/prop-types */
import React, { useState } from "react";
import axios from "axios";
import { 
  FaArrowLeft, 
  FaCloudUploadAlt, 
  FaLeaf, 
  FaSeedling, 
  FaChartLine, 
  FaMapMarkerAlt, 
  FaLanguage,
  FaSpinner,
  FaQuestionCircle,
  FaArrowRight
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import bannerImg from "../assets/agriculture_banner.png";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Jammu and Kashmir"
];

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "te", label: "తెలుగు" },
  { code: "ta", label: "தமிழ்" },
];

export default function Agriculture() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // Crop Disease State
  const [fileName, setFileName] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [cropType, setCropType] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  // Recommendations State
  const [recCropType, setRecCropType] = useState("");
  const [soilType, setSoilType] = useState("");
  const [season, setSeason] = useState("");
  const [question, setQuestion] = useState("");
  const [recLoading, setRecLoading] = useState(false);
  const [recReply, setRecReply] = useState("");
  const [recSource, setRecSource] = useState("");

  // Mandi Prices State
  const [selectedState, setSelectedState] = useState(INDIAN_STATES[0]);
  const [mandiLoading, setMandiLoading] = useState(false);
  const [mandiData, setMandiData] = useState([]);
  const [mandiSource, setMandiSource] = useState("");
  const [mandiMessage, setMandiMessage] = useState("");

  const API_BASE = "http://localhost:5000/api";

  // --- Handlers ---

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(",")[1];
      setImageBase64(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!imageBase64) return alert(t("uploadFirst"));
    setLoading(true);
    setResult("");
    try {
      const res = await axios.post(`${API_BASE}/agriculture/analyze`, {
        cropType,
        base64Image: imageBase64,
      });
      setResult(res.data.reply || t("noResponse"));
    } catch (err) {
      alert(t("analyzeFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleGetRecommendations = async (e) => {
    e.preventDefault();
    const userPrompt = question.trim() || `Suggest suitable farming practices and fertilizer for ${recCropType || "the specified crop"} in ${soilType || "the given soil"} during ${season || "the current"} season.`;
    if (!userPrompt) return alert(t("enterCropOrQuestion"));

    setRecLoading(true);
    setRecReply("");
    try {
      const res = await axios.post(`${API_BASE}/askSmart`, { prompt: userPrompt });
      setRecReply(res.data.reply || t("noRecommendations"));
      setRecSource(res.data.source || "AI");
    } catch (err) {
      alert(t("recommendationFailed"));
    } finally {
      setRecLoading(false);
    }
  };

  const handleGetMandi = async () => {
    setMandiLoading(true);
    setMandiData([]);
    setMandiMessage("");
    try {
      const res = await axios.get(`${API_BASE}/agriculture/mandi`, { params: { state: selectedState } });
      setMandiData(res.data.data || []);
      setMandiSource(res.data.source || "fallback");
      if (res.data.message) setMandiMessage(res.data.message);
    } catch (err) {
      alert(t("mandiFailed"));
    } finally {
      setMandiLoading(false);
    }
  };

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-[#f7fff7] font-sans pb-12">
      {/* 🌿 Premium Hero Header */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden shadow-xl">
        <img 
          src={bannerImg} 
          alt="Agriculture Banner" 
          className="w-full h-full object-cover transform scale-105 hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 to-transparent flex flex-col justify-center px-6 md:px-12">
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
              <FaLeaf className="text-green-400" />
              {t("agricultureAssistant")}
            </h1>
            <p className="text-green-100 text-lg md:text-xl font-medium max-w-lg">
              {t("aiFarming")}
            </p>
          </motion.div>
        </div>
      </div>

      {/* 🚜 Main Content Grid */}
      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-6 -mt-10 relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {/* 📷 Disease Detection Card */}
        <motion.section variants={cardVariants} className="bg-white/90 backdrop-blur-lg p-6 rounded-3xl shadow-2xl border border-white hover:shadow-green-200 transition-shadow flex flex-col">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-green-100 rounded-2xl text-green-600 text-2xl shadow-inner">
              <FaCloudUploadAlt />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{t("cropDiseaseDetection")}</h2>
          </div>
          <p className="text-gray-600 mb-6 text-sm">{t("uploadInstruction")}</p>

          <div className="flex-grow flex flex-col gap-4">
            <label className="group relative flex flex-col items-center justify-center border-2 border-dashed border-green-200 rounded-2xl p-6 hover:bg-green-50/50 hover:border-green-400 transition-all cursor-pointer">
              <FaCloudUploadAlt className="text-4xl text-green-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-green-700">{fileName || t("clickToUpload")}</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>

            <input
              type="text"
              placeholder={t("cropType")}
              value={cropType}
              onChange={(e) => setCropType(e.target.value)}
              className="w-full p-4 border border-green-100 rounded-2xl bg-green-50/50 focus:bg-white focus:ring-4 focus:ring-green-100 outline-none transition-all text-gray-700"
            />

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-green-300 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? <FaSpinner className="animate-spin" /> : <FaLeaf />}
              {loading ? t("analyzing") : t("analyzeDisease")}
            </button>
          </div>

          <AnimatePresence>
            {result && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 bg-green-50/80 p-5 rounded-2xl border border-green-100 overflow-hidden"
              >
                <div className="flex items-center gap-2 text-green-700 font-bold mb-3">
                  <FaSeedling /> {t("aiResult")}
                </div>
                <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto custom-scrollbar">
                  {result}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* 🌿 Recommendations Card */}
        <motion.section variants={cardVariants} className="bg-white/90 backdrop-blur-lg p-6 rounded-3xl shadow-2xl border border-white hover:shadow-emerald-200 transition-shadow flex flex-col">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600 text-2xl shadow-inner">
              <FaQuestionCircle />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{t("farmingRecommendations")}</h2>
          </div>
          <p className="text-gray-600 mb-6 text-sm">{t("recommend")}</p>

          <form onSubmit={handleGetRecommendations} className="flex-grow flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-3 mb-1">
              <input
                type="text"
                placeholder={t("cropType")}
                value={recCropType}
                onChange={(e) => setRecCropType(e.target.value)}
                className="w-full p-3 border border-emerald-100 rounded-xl bg-emerald-50/50 focus:bg-white focus:ring-4 focus:ring-emerald-100 outline-none transition-all text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder={t("soilType")}
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full p-3 border border-emerald-100 rounded-xl bg-emerald-50/50 focus:bg-white focus:ring-4 focus:ring-emerald-100 outline-none transition-all text-xs"
              />
              <input
                type="text"
                placeholder={t("season")}
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full p-3 border border-emerald-100 rounded-xl bg-emerald-50/50 focus:bg-white focus:ring-4 focus:ring-emerald-100 outline-none transition-all text-xs"
              />
            </div>
            <textarea
              placeholder={t("yourQuestion")}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full p-4 border border-emerald-100 rounded-2xl bg-emerald-50/50 focus:bg-white focus:ring-4 focus:ring-emerald-100 outline-none transition-all resize-none text-gray-700 h-24"
            />
            <button
              type="submit"
              disabled={recLoading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-emerald-300 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {recLoading ? <FaSpinner className="animate-spin" /> : <FaArrowRight />}
              {recLoading ? t("getting") : t("getRecommendations")}
            </button>
          </form>

          <AnimatePresence>
            {recReply && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 bg-teal-50/80 p-5 rounded-2xl border border-teal-100 overflow-hidden"
              >
                <div className="text-xs text-teal-700 font-bold mb-2 uppercase tracking-wider">
                  Source: {recSource}
                </div>
                <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto custom-scrollbar">
                  {recReply}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* 📈 Mandi Prices Card */}
        <motion.section variants={cardVariants} className="bg-white/90 backdrop-blur-lg p-6 rounded-3xl shadow-2xl border border-white hover:shadow-yellow-200 transition-shadow flex flex-col">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-yellow-100 rounded-2xl text-yellow-600 text-2xl shadow-inner">
              <FaChartLine />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{t("mandiPrices")}</h2>
          </div>
          <p className="text-gray-600 mb-6 text-sm">{t("checkMarketPrices")}</p>

          <div className="flex gap-2 mb-4">
            <div className="relative flex-grow">
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full p-4 pr-10 border border-yellow-100 rounded-2xl bg-yellow-50/50 focus:bg-white focus:ring-4 focus:ring-yellow-100 outline-none transition-all text-gray-700 appearance-none font-medium"
              >
                {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-yellow-600">
                <FaMapMarkerAlt />
              </div>
            </div>
            <button
              onClick={handleGetMandi}
              disabled={mandiLoading}
              className="bg-yellow-500 hover:bg-yellow-600 text-white p-4 rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-70"
            >
              {mandiLoading ? <FaSpinner className="animate-spin" /> : <FaArrowRight />}
            </button>
          </div>

          <div className="flex-grow overflow-y-auto custom-scrollbar max-h-[400px]">
            {mandiLoading && (
              <div className="flex flex-col items-center justify-center py-20 text-yellow-400">
                <FaSpinner className="animate-spin text-4xl mb-4" />
                <p className="font-medium">{t("loading")}</p>
              </div>
            )}

            {!mandiLoading && mandiData.length === 0 && (
              <div className="text-center py-20 text-gray-400 italic">
                {t("noMandiData")}
              </div>
            )}

            {mandiData.length > 0 && (
              <div className="space-y-3">
                <div className="text-[10px] font-bold text-yellow-700 uppercase tracking-widest mb-2 px-1">
                  {mandiSource === "live" ? "Live Gov. API" : "AI Estimation"}
                </div>
                {mandiData.map((r, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-4 rounded-2xl bg-gradient-to-r from-yellow-50 to-white border border-yellow-100 shadow-sm"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-800">{r.crop}</h4>
                        <p className="text-[10px] text-gray-500 flex items-center gap-1">
                          <FaMapMarkerAlt /> {r.market}, {r.district}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-black text-yellow-600">₹{r.price}</div>
                        <div className="text-[8px] text-gray-400 font-bold uppercase">per quintal</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.section>
      </motion.main>

      {/* 📊 Footer Stats Section */}
      <footer className="max-w-7xl mx-auto px-6 mt-12">
        <div className="bg-white/50 backdrop-blur-md border border-white rounded-3xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center shadow-lg">
          <div>
            <div className="text-3xl font-black text-green-600 mb-1">10,000+</div>
            <div className="text-xs font-bold text-gray-500 uppercase">Farmers Assisted</div>
          </div>
          <div className="border-y md:border-y-0 md:border-x border-gray-100 py-4 md:py-0">
            <div className="text-3xl font-black text-emerald-600 mb-1">50+</div>
            <div className="text-xs font-bold text-gray-500 uppercase">Crop Types Covered</div>
          </div>
          <div>
            <div className="text-3xl font-black text-yellow-600 mb-1">28 States</div>
            <div className="text-xs font-bold text-gray-500 uppercase">Live Mandi Markets</div>
          </div>
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
