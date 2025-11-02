/* eslint-disable react/prop-types */
import React, { useState } from "react";
import axios from "axios";
import { FaArrowLeft, FaHeartbeat, FaHospital } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "te", label: "తెలుగు" },
  { code: "ta", label: "தமிழ்" },
];

export default function Healthcare() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [tab, setTab] = useState("symptom");
  const [symptom, setSymptom] = useState("");
  const [symptomResult, setSymptomResult] = useState("");
  const [symptomLoading, setSymptomLoading] = useState(false);

  const [disease, setDisease] = useState("");
  const [tipsResult, setTipsResult] = useState("");
  const [tipsLoading, setTipsLoading] = useState(false);

  const [location, setLocation] = useState("");
  const [resources, setResources] = useState([]);
  const [resourceLoading, setResourceLoading] = useState(false);

  // 🩺 Symptom Checker
  const handleSymptomCheck = async (e) => {
    e.preventDefault();
    if (!symptom) return alert(t("Please enter symptoms."));
    setSymptomLoading(true);
    setSymptomResult("");
    try {
      const res = await axios.post("http://localhost:5000/api/health/symptom", {
        symptoms: symptom,
      });
      setSymptomResult(res.data.reply || t("No response from AI."));
    } catch {
      alert(t("Symptom check failed."));
    } finally {
      setSymptomLoading(false);
    }
  };

  // 💡 Preventive Tips
  const handleGetTips = async (e) => {
    e.preventDefault();
    if (!disease) return alert(t("Please enter disease name."));
    setTipsLoading(true);
    setTipsResult("");
    try {
      const res = await axios.post("http://localhost:5000/api/health/tips", {
        disease,
      });
      setTipsResult(res.data.reply || t("No tips available."));
    } catch {
      alert(t("Failed to fetch tips."));
    } finally {
      setTipsLoading(false);
    }
  };

  // 🏥 Nearby Resources
  const handleGetResources = async () => {
    if (!location) return alert(t("Please enter your location."));
    setResourceLoading(true);
    setResources([]);
    try {
      const res = await axios.get("http://localhost:5000/api/health/resources", {
        params: { location },
      });
      setResources(res.data.data || []);
    } catch {
      alert(t("Failed to fetch nearby resources."));
    } finally {
      setResourceLoading(false);
    }
  };

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      {/* Header */}
      <header className="max-w-5xl mx-auto flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-blue-700 hover:text-blue-800"
        >
          <FaArrowLeft /> {t("back")}
        </button>
        <h1 className="text-xl font-bold flex items-center gap-2 text-blue-700">
          <FaHeartbeat /> {t("Healthcare Assistant")}
        </h1>
        <select
          value={i18n.language}
          onChange={handleLanguageChange}
          className="border border-blue-400 text-blue-700 rounded p-1"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
      </header>

      <h2 className="text-center text-gray-600 mb-8 font-medium">
        {t("AI-powered Health Guidance")}
      </h2>

      {/* Tabs */}
      <main className="max-w-4xl mx-auto">
        <nav className="flex gap-3 justify-center mb-6">
          <button
            onClick={() => setTab("symptom")}
            className={`px-4 py-2 rounded ${
              tab === "symptom" ? "bg-blue-600 text-white" : "bg-white shadow"
            }`}
          >
            {t("Symptom Checker")}
          </button>
          <button
            onClick={() => setTab("tips")}
            className={`px-4 py-2 rounded ${
              tab === "tips" ? "bg-blue-600 text-white" : "bg-white shadow"
            }`}
          >
            {t("Preventive Tips")}
          </button>
          <button
            onClick={() => setTab("resources")}
            className={`px-4 py-2 rounded ${
              tab === "resources" ? "bg-blue-600 text-white" : "bg-white shadow"
            }`}
          >
            {t("Nearby Resources")}
          </button>
        </nav>

        {/* 🩺 Symptom Checker */}
        {tab === "symptom" && (
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-3">
              {t("Symptom Checker")}
            </h2>
            <p className="text-gray-600 mb-4">
              {t("Describe your symptoms to get AI-powered health insights.")}
            </p>
            <form onSubmit={handleSymptomCheck} className="space-y-3">
              <textarea
                placeholder={t("Enter your symptoms (e.g., fever, cough, fatigue)")}
                value={symptom}
                onChange={(e) => setSymptom(e.target.value)}
                className="w-full p-2 border rounded"
                rows="3"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                disabled={symptomLoading}
              >
                {symptomLoading ? t("Analyzing...") : t("Check Symptoms")}
              </button>
            </form>
            {symptomResult && (
              <div className="mt-4 bg-blue-50 p-4 rounded">
                <strong>{t("AI Result")}:</strong>
                <pre className="whitespace-pre-wrap mt-2">{symptomResult}</pre>
              </div>
            )}
          </section>
        )}

        {/* 💡 Preventive Tips */}
        {tab === "tips" && (
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-3">
              {t("Preventive Health Tips")}
            </h2>
            <p className="text-gray-600 mb-4">
              {t("Get preventive advice for common diseases.")}
            </p>
            <form onSubmit={handleGetTips} className="space-y-3">
              <input
                type="text"
                placeholder={t("Enter disease name (e.g., Diabetes, Malaria)")}
                value={disease}
                onChange={(e) => setDisease(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                disabled={tipsLoading}
              >
                {tipsLoading ? t("Loading...") : t("Get Tips")}
              </button>
            </form>
            {tipsResult && (
              <div className="mt-4 bg-blue-50 p-4 rounded">
                <strong>{t("Tips")}:</strong>
                <pre className="whitespace-pre-wrap mt-2">{tipsResult}</pre>
              </div>
            )}
          </section>
        )}

        {/* 🏥 Nearby Resources */}
        {tab === "resources" && (
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-3">
              {t("Nearby Health Resources")}
            </h2>
            <p className="text-gray-600 mb-4">
              {t("Find hospitals and clinics near you.")}
            </p>
            <div className="mb-4">
              <input
                type="text"
                placeholder={t("Enter your location")}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <button
                onClick={handleGetResources}
                className="w-full mt-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                disabled={resourceLoading}
              >
                {resourceLoading ? t("Loading...") : t("Find Resources")}
              </button>
            </div>
            {resources.length === 0 && !resourceLoading && (
              <p className="text-gray-500">
                {t("No resources found (demo mode).")}
              </p>
            )}
            {resources.length > 0 && (
              <ul>
                {resources.map((r, i) => (
                  <li key={i} className="mb-2 border p-3 rounded bg-blue-50">
                    <FaHospital className="inline-block mr-3 text-blue-600" />
                    <span className="font-semibold">{r.name}</span> -{" "}
                    <span>{r.address}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
