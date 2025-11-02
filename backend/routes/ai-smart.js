import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.post("/", async (req, res) => {
  const { prompt } = req.body;

  try {
    // 1️⃣ Try Gemini first
    const geminiResponse = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      { contents: [{ parts: [{ text: prompt }] }] },
      { headers: { "Content-Type": "application/json" }, params: { key: process.env.GEMINI_API_KEY } }
    );

    const geminiText =
      geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from Gemini.";
    return res.json({ source: "Gemini", reply: geminiText });
  } catch (geminiError) {
    console.warn("⚠️ Gemini failed, trying OpenAI...");
  }

  try {
    // 2️⃣ Fallback to OpenAI
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
    return res.json({ source: "OpenAI", reply: openaiText });
  } catch (openaiError) {
    console.error("❌ Both AIs failed:", openaiError.message);
    return res.status(500).json({ error: "Both Gemini and OpenAI failed." });
  }
});

export default router;
