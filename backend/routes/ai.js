import express from "express";
import OpenAI from "openai";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// POST /api/askAI - Try OpenAI → Gemini → Hugging Face
router.post("/", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // ---- 1️⃣ Try OpenAI ----
    try {
      if (process.env.OPENAI_API_KEY) {
        console.log("🤖 [ai] Trying OpenAI...");
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }]
        });
        console.log("✅ [ai] OpenAI succeeded");
        return res.json({ reply: response.choices[0].message.content, source: "OpenAI" });
      }
    } catch (err) {
      console.warn("⚠️ [ai] OpenAI failed:", err.message);
    }

    // ---- 2️⃣ Try Gemini ----
    try {
      if (process.env.GEMINI_API_KEY) {
        console.log("✨ [ai] Trying Gemini...");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const result = await model.generateContent(prompt);
        const reply = result?.response?.text?.() || "No response from Gemini";
        console.log("✅ [ai] Gemini succeeded");
        return res.json({ reply, source: "Gemini" });
      }
    } catch (err) {
      console.warn("⚠️ [ai] Gemini failed:", err.message);
    }

    // ---- 3️⃣ Try Hugging Face ----
    try {
      if (process.env.HF_API_KEY) {
        console.log("🤗 [ai] Trying Hugging Face...");
        const hfResponse = await axios.post(
          "https://api-inference.huggingface.co/models/gpt2",
          { inputs: prompt },
          { headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` } }
        );
        const reply = hfResponse.data?.[0]?.generated_text || "No response from HF";
        console.log("✅ [ai] Hugging Face succeeded");
        return res.json({ reply, source: "Hugging Face" });
      }
    } catch (err) {
      console.warn("⚠️ [ai] Hugging Face failed:", err.message);
    }

    return res.status(500).json({ error: "All AI services failed" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
