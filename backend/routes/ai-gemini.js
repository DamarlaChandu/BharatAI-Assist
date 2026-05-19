import express from "express";
import axios from "axios";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// POST /api/askGemini - Try Gemini → OpenAI → Hugging Face
router.post("/", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  // ---- 1️⃣ Try Gemini ----
  try {
    if (process.env.GEMINI_API_KEY) {
      console.log("✨ [askGemini] Trying Gemini...");
      const url =
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=" +
        process.env.GEMINI_API_KEY;

      const response = await axios.post(url, {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      });

      const reply =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No reply from Gemini";

      console.log("✅ [askGemini] Gemini succeeded");
      return res.json({ reply, source: "Gemini" });
    }
  } catch (error) {
    const errMsg =
      error.response?.data?.error?.message ||
      error.message ||
      "Unknown error occurred";
    console.warn("⚠️ [askGemini] Gemini failed:", errMsg);
  }

  // ---- 2️⃣ Try OpenAI ----
  try {
    if (process.env.OPENAI_API_KEY) {
      console.log("🤖 [askGemini] Trying OpenAI...");
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }]
      });
      console.log("✅ [askGemini] OpenAI succeeded");
      return res.json({ reply: response.choices[0].message.content, source: "OpenAI" });
    }
  } catch (err) {
    console.warn("⚠️ [askGemini] OpenAI failed:", err.message);
  }

  // ---- 3️⃣ Try Hugging Face ----
  try {
    if (process.env.HF_API_KEY) {
      console.log("🤗 [askGemini] Trying Hugging Face...");
      const hfResponse = await axios.post(
        "https://api-inference.huggingface.co/models/gpt2",
        { inputs: prompt },
        { headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` } }
      );
      const reply = hfResponse.data?.[0]?.generated_text || "No response from HF";
      console.log("✅ [askGemini] Hugging Face succeeded");
      return res.json({ reply, source: "Hugging Face" });
    }
  } catch (err) {
    console.warn("⚠️ [askGemini] Hugging Face failed:", err.message);
  }

  return res.status(500).json({ error: "All AI services failed" });
});

export default router;
