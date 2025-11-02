import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

/**
 * POST /api/askSmart
 * Handles smart AI replies using Gemini → fallback OpenAI
 */
router.post("/", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || prompt.trim().length === 0) {
    return res.status(400).json({ error: "Prompt is required." });
  }

  console.log("🧠 Received prompt:", prompt);

  // ---- 1️⃣ Try Gemini ----
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Missing GEMINI_API_KEY in environment variables.");
    }

    const geminiResponse = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      { contents: [{ parts: [{ text: prompt }] }] },
      {
        headers: { "Content-Type": "application/json" },
        params: { key: process.env.GEMINI_API_KEY },
      }
    );

    const geminiText =
      geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from Gemini.";

    console.log("✅ Gemini response received.");
    return res.json({ source: "Gemini", reply: geminiText });
  } catch (geminiError) {
    console.warn("⚠️ Gemini failed, trying OpenAI...");
    console.error("Gemini error:", geminiError.response?.data || geminiError.message);
  }

  // ---- 2️⃣ Fallback to OpenAI ----
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("Missing OPENAI_API_KEY in environment variables.");
    }

    const openaiResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const openaiText =
      openaiResponse.data?.choices?.[0]?.message?.content ||
      "No response from OpenAI.";

    console.log("✅ OpenAI fallback successful.");
    return res.json({ source: "OpenAI", reply: openaiText });
  } catch (openaiError) {
    console.error("❌ Both AIs failed:", openaiError.response?.data || openaiError.message);
    return res.status(500).json({ error: "Both Gemini and OpenAI failed." });
  }
});

export default router;
