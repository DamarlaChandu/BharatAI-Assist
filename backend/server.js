import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// 🧠 Import all route modules
import aiRoutes from "./routes/ai.js";
import smartAI from "./routes/ai-smart.js";
import geminiAI from "./routes/ai-gemini.js";
import products from "./routes/products.js";
import mandiAPI from "./routes/mandiAPI.js";
import healthAI from "./routes/healthAI.js";
import healthAPI from "./routes/healthAPI.js";
import agricultureAI from "./routes/agricultureAI.js"; // ✅ Crop image analyzer

// ✅ Load environment variables
dotenv.config();

// ✅ Initialize Express app
const app = express();

// ✅ Core Middleware
app.use(cors());
app.use(express.json({ limit: "15mb" })); // Increased limit for base64 images
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// ✅ Optional: basic request logger (good for debugging)
app.use((req, res, next) => {
  console.log(`➡️  [${req.method}] ${req.url}`);
  next();
});

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("🚀 BharatAI Backend is running successfully!");
});

// ✅ Register all main routes
app.use("/api/askAI", aiRoutes);                // Basic AI route
app.use("/api/askSmart", smartAI);              // Gemini + OpenAI fallback
app.use("/api/askGemini", geminiAI);            // Direct Gemini route
app.use("/api/products", products);             // Product listing
app.use("/api/agriculture", agricultureAI);     // ✅ Crop image analyzer
app.use("/api/agriculture/mandi", mandiAPI);    // Mandi price data
app.use("/api/health", healthAPI);              // ✅ Unified AI-powered Health Assistant

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend listening on port ${PORT}`);
});
