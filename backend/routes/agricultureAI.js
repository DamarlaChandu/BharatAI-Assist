import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// POST: Analyze crop disease
router.post("/analyze", async (req, res) => {
  const { cropType, base64Image } = req.body;

  if (!base64Image)
    return res.status(400).json({ error: "Please upload a crop image." });

  try {
    const prompt = `Identify disease or issue in this crop image. Crop Type: ${cropType || "Unknown"}.
    Suggest remedies and fertilizers.`;

    const aiResponse = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      { params: { key: process.env.GEMINI_API_KEY } }
    );

    const result =
      aiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No diagnosis found.";
    res.json({ reply: result });
  } catch (err) {
    console.error("Error analyzing crop:", err.message);
    res.status(500).json({ error: "AI analysis failed." });
  }
});

// POST: Farming recommendations
router.post("/recommendations", async (req, res) => {
  const { cropType, soilType, season, question } = req.body;

  const prompt = `
You are an agricultural expert. 
Provide farming recommendations for:
Crop: ${cropType || "Not specified"}
Soil: ${soilType || "Not specified"}
Season: ${season || "Not specified"}
Question: ${question || "General advice"}.
`;

  try {
    const aiResponse = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      { params: { key: process.env.GEMINI_API_KEY } }
    );

    const reply =
      aiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No recommendations found.";
    res.json({ reply });
  } catch (err) {
    console.error("Error getting recommendations:", err.message);
    res.status(500).json({ error: "Failed to get recommendations." });
  }
});

export default router;
