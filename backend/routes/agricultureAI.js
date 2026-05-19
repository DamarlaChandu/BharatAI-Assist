import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Robust AI generation with automatic retries for 503/Overloaded errors
 */
async function generateWithRetry(model, content, maxRetries = 2) {
  let lastError;
  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      const result = await model.generateContent(content);
      return result.response.text();
    } catch (err) {
      lastError = err;
      const isRetryable = err.message?.includes("503") || err.message?.includes("Service Unavailable") || err.message?.includes("high demand");
      if (isRetryable && attempt <= maxRetries) {
        const delay = attempt * 1000;
        console.warn(`⚠️ [Agri AI] Model busy, retrying in ${delay}ms (Attempt ${attempt}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw err;
      }
    }
  }
}

router.post("/analyze", async (req, res) => {
  try {
    const { cropType, base64Image } = req.body;
    if (!base64Image) return res.status(400).json({ error: "Image required" });

    const prompt = `You are an expert agricultural advisor. Analyze this crop image (${cropType || "Unknown"}).
Give: 1. Disease, 2. Remedy, 3. Fertilizer, 4. Prevention. Use clear headings and emojis.`;

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const content = [
      { inlineData: { mimeType: "image/jpeg", data: base64Image } },
      { text: prompt },
    ];

    const reply = await generateWithRetry(model, content);
    console.log(`🚀 [Agri-v2] Image analyzed successfully via Stable Gemini`);

    return res.json({ reply: reply || "No response", source: "Gemini" });
  } catch (err) {
    console.error("❌ Agri AI error:", err.message);
    return res.status(500).json({ error: "AI Analysis failed", details: err.message });
  }
});

export default router;