import express from "express";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// ✅ Gemini setup (replace with your key from .env)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * POST /api/health/symptom
 * AI analysis for given symptoms
 */
router.post("/symptom", async (req, res) => {
  try {
    const { symptoms } = req.body;
    if (!symptoms) return res.status(400).json({ error: "Symptoms required" });

    const prompt = `A patient reports: ${symptoms}. Suggest possible causes, treatments, and precautions in simple language.`;
    const result = await model.generateContent(prompt);

    res.json({ source: "Gemini", reply: result.response.text() });
  } catch (err) {
    console.error("❌ Health symptom error:", err.message);
    res.status(500).json({ error: "AI health analysis failed." });
  }
});

/**
 * POST /api/health/tips
 * Preventive or lifestyle tips for given disease
 */
router.post("/tips", async (req, res) => {
  try {
    const { disease } = req.body;
    if (!disease) return res.status(400).json({ error: "Disease required" });

    const prompt = `Give short and easy preventive health tips for ${disease} in India.`;
    const result = await model.generateContent(prompt);

    res.json({ source: "Gemini", reply: result.response.text() });
  } catch (err) {
    console.error("❌ Health tips error:", err.message);
    res.status(500).json({ error: "Failed to generate health tips." });
  }
});

/**
 * GET /api/health/resources
 * Fetch nearby hospitals/clinics (dummy + API-ready)
 */
router.get("/resources", async (req, res) => {
  try {
    const { location } = req.query;
    if (!location) return res.status(400).json({ error: "Location required" });

    // Example placeholder API response
    const resources = [
      { name: "Guntur General Hospital", type: "Government", contact: "0863-222222" },
      { name: "Ramesh Hospitals", type: "Private", contact: "0863-232323" },
    ];

    res.json({ location, data: resources });
  } catch (err) {
    console.error("❌ Health resources error:", err.message);
    res.status(500).json({ error: "Failed to fetch health resources." });
  }
});

export default router;
