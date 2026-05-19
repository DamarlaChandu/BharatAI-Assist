import express from "express";
import axios from "axios";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// POST /api/askHF - Try Hugging Face → OpenAI → Gemini
router.post("/", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // ---- 1️⃣ Try Hugging Face ----
    try {
      if (process.env.HF_API_KEY) {
        console.log("🤗 [askHF] Trying Hugging Face...");
        const model = "mistralai/Mixtral-8x7B-Instruct-v0.1";
        const url = `https://router.huggingface.co/hf-inference/v1/models/${model}`;

        const response = await axios.post(
          url,
          { inputs: prompt },
          {
            headers: {
              Authorization: `Bearer ${process.env.HF_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        const output =
          response.data?.[0]?.generated_text ||
          response.data?.generated_text ||
          response.data?.outputs?.[0]?.content ||
          JSON.stringify(response.data);

        console.log("✅ [askHF] Hugging Face succeeded");
        return res.json({ reply: output, source: "Hugging Face" });
      }
    } catch (error) {
      console.warn("⚠️ [askHF] Hugging Face failed:", error.response?.data?.error || error.message);
    }

    // ---- 2️⃣ Try OpenAI ----
    try {
      if (process.env.OPENAI_API_KEY) {
        console.log("🤖 [askHF] Trying OpenAI...");
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }]
        });
        console.log("✅ [askHF] OpenAI succeeded");
        return res.json({ reply: response.choices[0].message.content, source: "OpenAI" });
      }
    } catch (err) {
      console.warn("⚠️ [askHF] OpenAI failed:", err.message);
    }

    // ---- 3️⃣ Try Gemini ----
    try {
      if (process.env.GEMINI_API_KEY) {
        console.log("✨ [askHF] Trying Gemini...");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const result = await model.generateContent(prompt);
        const reply = result?.response?.text?.() || "No response from Gemini";
        console.log("✅ [askHF] Gemini succeeded");
        return res.json({ reply, source: "Gemini" });
      }
    } catch (err) {
      console.warn("⚠️ [askHF] Gemini failed:", err.message);
    }

    return res.status(500).json({ error: "All AI services failed" });

  } catch (error) {
    console.error("❌ HF error:", error.message);
    res.status(500).json({
      error: error.message || "Failed to get AI response"
    });
  }
});

export default router;
