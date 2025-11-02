import React from "react";
import { FaGlobe, FaLeaf } from "react-icons/fa";

const Header = () => {
  return (
    <header className="w-full flex justify-between items-center px-8 py-4 bg-white/60 backdrop-blur-lg shadow-sm fixed top-0 left-0 z-50">
      {/* Logo Section */}
      <div className="flex items-center space-x-3">
        <div className="bg-green-500 p-3 rounded-xl text-white shadow-md">
          <FaLeaf className="text-2xl" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          BharatAI Assist
        </h1>
      </div>

      {/* Language Selector */}
      <div className="flex items-center space-x-2 border border-gray-300 rounded-lg px-4 py-2 bg-white shadow-sm hover:shadow-md transition">
        <FaGlobe className="text-gray-600 text-lg" />
        <select
          className="bg-transparent outline-none text-gray-700 font-medium cursor-pointer"
          defaultValue="English"
        >
          <option>English</option>
          <option>हिन्दी</option>
          <option>తెలుగు</option>
          <option>தமிழ்</option>
          <option>मराठी</option>
        </select>
      </div>
    </header>
  );
};

export default Header;
