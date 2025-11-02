import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { prompt } = req.body;
    const model = "mistralai/Mixtral-8x7B-Instruct-v0.1"; // you can also try "google/gemma-2b-it"

    // ✅ New Hugging Face Router API (2025)
    const url = `https://router.huggingface.co/hf-inference/v1/models/${model}`;

    const response = await axios.post(
      url,
      {
        inputs: prompt,
      },
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

    res.json({ reply: output });
  } catch (error) {
    console.error("❌ Hugging Face error:", error.response?.data || error.message);
    res.status(500).json({
      error:
        error.response?.data?.error ||
        error.message ||
        "Failed to get Hugging Face response",
    });
  }
});

export default router;
