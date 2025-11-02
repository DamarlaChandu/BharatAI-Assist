/* eslint-disable react/prop-types */
import React, { useState } from "react";
import axios from "axios";
import { FaArrowLeft, FaCloudUploadAlt, FaLeaf } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

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

  const [tab, setTab] = useState("disease");

  // Crop Disease
  const [fileName, setFileName] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [cropType, setCropType] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  // Recommendations
  const [soilType, setSoilType] = useState("");
  const [season, setSeason] = useState("");
  const [question, setQuestion] = useState("");
  const [recLoading, setRecLoading] = useState(false);
  const [recReply, setRecReply] = useState("");
  const [recSource, setRecSource] = useState(""); // shows Gemini / OpenAI fallback

  // Mandi Prices
  const [selectedState, setSelectedState] = useState(INDIAN_STATES[0]);
  const [mandiLoading, setMandiLoading] = useState(false);
  const [mandiData, setMandiData] = useState([]);
  const [mandiSource, setMandiSource] = useState("");

  // Handle File Upload
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

  // Analyze Crop Image
  const handleAnalyze = async () => {
    if (!imageBase64) return alert(t("uploadFirst") || "Please upload an image first.");
    setLoading(true);
    setResult("");
    try {
      const res = await axios.post("http://localhost:5000/api/agriculture/analyze", {
        cropType,
        base64Image: imageBase64,
      });
      setResult(res.data.reply || t("noResponse") || "No response from AI.");
    } catch (err) {
      console.error("❌ Analyze failed:", err);
      alert(t("analyzeFailed") || "Analyze failed. Check server logs.");
    } finally {
      setLoading(false);
    }
  };

  // 🌿 Get Recommendations via /api/askSmart (Gemini + fallback on server)
  const handleGetRecommendations = async (e) => {
    e.preventDefault();

    // Prefer explicit user question, otherwise compose one
    const userPrompt =
      question && question.trim().length > 0
        ? question.trim()
        : `Suggest suitable farming practices and fertilizer for ${cropType || "the specified crop"} in ${soilType || "the given soil"} during ${season || "the current"} season.`;

    if (!userPrompt) return alert(t("enterCropOrQuestion") || "Please enter a crop or a question.");

    setRecLoading(true);
    setRecReply("");
    setRecSource("");

    try {
      const res = await axios.post("http://localhost:5000/api/askSmart", {
        prompt: userPrompt,
      });

      // The server returns { source: "Gemini" | "OpenAI", reply: "..." }
      setRecReply(res?.data?.reply || t("noRecommendations") || "No recommendations found.");
      setRecSource(res?.data?.source || "Unknown");
    } catch (err) {
      console.error("❌ Recommendation fetch failed:", err);
      // If server responds with JSON error, show it in console and an alert
      const serverMsg = err.response?.data?.error || err.message;
      alert(t("recommendationFailed") || `Failed to fetch recommendations: ${serverMsg}`);
    } finally {
      setRecLoading(false);
    }
  };

  // 🌾 Get Mandi Prices (Updated with live + fallback)
  const handleGetMandi = async () => {
    if (!selectedState) return alert(t("Please select a state.") || "Please select a state.");
    setMandiLoading(true);
    setMandiData([]);
    try {
      const res = await axios.get("http://localhost:5000/api/agriculture/mandi", {
        params: { state: selectedState },
      });
      setMandiData(res.data.data || []);
      setMandiSource(res.data.source || "fallback");
    } catch (err) {
      console.error("❌ Mandi fetch failed:", err);
      alert(t("mandiFailed") || "Mandi fetch failed. Check server.");
      setMandiSource("fallback");
    } finally {
      setMandiLoading(false);
    }
  };

  // Language switch handler
  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className="min-h-screen bg-green-50 p-6">
      {/* Header */}
      <header className="max-w-5xl mx-auto flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-green-700 hover:text-green-800"
        >
          <FaArrowLeft /> {t("back")}
        </button>
        <h1 className="text-xl font-bold flex items-center gap-2 text-green-700">
          <FaLeaf /> {t("agricultureAssistant")}
        </h1>
        <select
          value={i18n.language}
          onChange={handleLanguageChange}
          className="border p-1 text-green-700 rounded"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
      </header>

      <h2 className="text-center text-gray-600 mb-8 font-medium">
        {t("aiFarming")}
      </h2>

      {/* Tabs */}
      <main className="max-w-4xl mx-auto">
        <nav className="flex gap-3 justify-center mb-6">
          <button
            onClick={() => setTab("disease")}
            className={`px-4 py-2 rounded ${
              tab === "disease" ? "bg-green-600 text-white" : "bg-white shadow"
            }`}
          >
            {t("disease")}
          </button>
          <button
            onClick={() => setTab("recommend")}
            className={`px-4 py-2 rounded ${
              tab === "recommend" ? "bg-green-600 text-white" : "bg-white shadow"
            }`}
          >
            {t("recommend")}
          </button>
          <button
            onClick={() => setTab("mandi")}
            className={`px-4 py-2 rounded ${
              tab === "mandi" ? "bg-green-600 text-white" : "bg-white shadow"
            }`}
          >
            {t("mandi")}
          </button>
        </nav>

        {/* Crop Disease Tab */}
        {tab === "disease" && (
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-3">
              {t("cropDiseaseDetection")}
            </h2>
            <p className="text-gray-600 mb-4">{t("uploadInstruction")}</p>

            <div className="border-2 border-dashed border-green-300 rounded p-6 text-center mb-4">
              <FaCloudUploadAlt className="text-4xl text-green-500 mx-auto mb-2" />
              <label htmlFor="cropImage" className="cursor-pointer text-green-700">
                {t("clickToUpload")}
              </label>
              <input
                id="cropImage"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              {fileName && (
                <p className="mt-2 text-sm text-gray-700">
                  {t("selected")}: {fileName}
                </p>
              )}
            </div>

            <input
              type="text"
              placeholder={t("cropType")}
              value={cropType}
              onChange={(e) => setCropType(e.target.value)}
              className="w-full mb-4 p-2 border rounded"
            />

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              {loading ? t("analyzing") : t("analyzeDisease")}
            </button>

            {result && (
              <div className="mt-4 bg-green-50 p-4 rounded">
                <strong>{t("aiResult")}</strong>
                <pre className="whitespace-pre-wrap mt-2">{result}</pre>
              </div>
            )}
          </section>
        )}

        {/* Recommendations Tab */}
        {tab === "recommend" && (
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-3">
              {t("farmingRecommendations")}
            </h2>
            <form onSubmit={handleGetRecommendations} className="space-y-3">
              <input
                type="text"
                placeholder={t("cropTypeRequired")}
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder={t("soilType")}
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder={t("season")}
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <textarea
                placeholder={t("yourQuestion")}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                disabled={recLoading}
              >
                {recLoading ? t("getting") : t("getRecommendations")}
              </button>
            </form>

            {recReply && (
              <div className="mt-4 bg-yellow-50 p-4 rounded">
                <p className="text-sm text-green-700 font-semibold mb-2">
                  {recSource ? `🌿 Source: ${recSource}` : "🌿 Source: AI"}
                </p>
                <pre className="whitespace-pre-wrap">{recReply}</pre>
              </div>
            )}
          </section>
        )}

        {/* Mandi Prices Tab */}
        {tab === "mandi" && (
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-3">{t("mandiPrices")}</h2>
            <p className="text-gray-600 mb-4">{t("checkMarketPrices")}</p>

            <div className="flex gap-3 mb-4">
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="flex-1 border p-2 rounded"
              >
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <button
                onClick={handleGetMandi}
                className="bg-green-600 text-white px-4 rounded hover:bg-green-700"
                disabled={mandiLoading}
              >
                {mandiLoading ? t("loading") : t("getMandiPrices")}
              </button>
            </div>

            {mandiLoading && <p className="text-gray-500">{t("loading")}</p>}

            {!mandiLoading && mandiData.length === 0 && (
              <p className="text-gray-500">{t("noMandiData")}</p>
            )}

            {mandiData.length > 0 && (
              <div className="mt-4">
                <p
                  className={`text-sm font-semibold mb-2 ${
                    mandiSource === "live"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {mandiSource === "live"
                    ? "✅ Live Data from Government of India (data.gov.in)"
                    : "🧩 Offline Demo Data (Fallback Mode)"}
                </p>

                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2">{t("crop")}</th>
                      <th className="p-2">{t("price")}</th>
                      <th className="p-2">{t("market")}</th>
                      <th className="p-2">{t("district")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mandiData.map((r, i) => (
                      <tr key={i} className="border-t">
                        <td className="p-2">{r.crop}</td>
                        <td className="p-2">{r.price}</td>
                        <td className="p-2">{r.market}</td>
                        <td className="p-2">{r.district}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
