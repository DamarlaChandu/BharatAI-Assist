import React from "react";
import { FaLeaf, FaStethoscope, FaGlobe, FaMicrophone, FaLanguage } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Home = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => i18n.changeLanguage(lng);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-50 to-blue-100 font-sans flex flex-col justify-between">
      {/* Header */}
      <header className="w-full flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-green-500 to-emerald-400 p-2 rounded-xl text-white text-2xl shadow-md">
            <FaLeaf />
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-gray-800">
            BharatAI Assist 🇮🇳
          </h1>
        </div>

        <div className="flex items-center space-x-2 bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm">
          <FaGlobe className="text-gray-600 text-lg" />
          <select
            value={i18n.language}
            onChange={(e) => changeLanguage(e.target.value)}
            className="outline-none bg-transparent text-gray-700 text-sm cursor-pointer"
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="te">Telugu</option>
            <option value="ta">Tamil</option>
          </select>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center text-center px-6 mt-16">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900">
          {t("title")}
        </h1>
        <p className="text-lg text-gray-600 mt-4 mb-20">{t("subtitle")}</p>

        {/* Feature Cards */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 mb-20 px-4">
          <AssistantCard
            icon={<FaLeaf className="text-green-600 text-5xl" />}
            title={t("agriculture")}
            desc={t("agriDesc")}
            color="bg-green-500 hover:bg-green-600"
            buttonText={t("getStarted")}
            onClick={() => navigate("/Agriculture")}
          />
          <AssistantCard
            icon={<FaStethoscope className="text-blue-600 text-5xl" />}
            title={t("healthcare")}
            desc={t("healthDesc")}
            color="bg-blue-500 hover:bg-blue-600"
            buttonText={t("getStarted")}
            onClick={() => navigate("/Healthcare")}
          />
        </div>
      </main>

      {/* Footer Feature Section */}
      <footer className="bg-white/80 backdrop-blur-xl shadow-inner py-12 mt-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-6 text-center">
          <FeatureCard
            icon={<FaMicrophone className="text-green-600 text-4xl mx-auto mb-3" />}
            title={t("voice")}
            desc={t("voiceDesc")}
          />
          <FeatureCard
            icon={<FaLanguage className="text-blue-600 text-4xl mx-auto mb-3" />}
            title={t("multilingual")}
            desc={t("multiDesc")}
          />
          <FeatureCard
            icon={<FaLeaf className="text-emerald-600 text-4xl mx-auto mb-3" />}
            title={t("agriShort")}
            desc={t("agriShortDesc")}
          />
          <FeatureCard
            icon={<FaStethoscope className="text-pink-600 text-4xl mx-auto mb-3" />}
            title={t("healthShort")}
            desc={t("healthShortDesc")}
          />
        </div>

        <p className="text-center text-gray-500 text-sm mt-10">
          © {new Date().getFullYear()} BharatAI Assist — Empowering Rural India 🇮🇳
        </p>
      </footer>
    </div>
  );
};

const AssistantCard = ({ icon, title, desc, color, buttonText, onClick }) => (
  <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-lg border p-10 w-[320px] md:w-[380px] flex flex-col items-center transition-all hover:shadow-2xl">
    <div className="mb-4">{icon}</div>
    <h3 className="text-2xl font-semibold mb-2 text-gray-800">{title}</h3>
    <p className="text-gray-600 mb-6">{desc}</p>
    <button
      onClick={onClick}
      className={`px-6 py-2 text-white font-medium rounded-full ${color} transition-all`}
    >
      {buttonText}
    </button>
  </div>
);

const FeatureCard = ({ icon, title, desc }) => (
  <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-green-50 shadow-md hover:shadow-lg transition-all">
    {icon}
    <h4 className="text-lg font-semibold text-gray-800 mb-1">{title}</h4>
    <p className="text-gray-600 text-sm">{desc}</p>
  </div>
);

export default Home;
