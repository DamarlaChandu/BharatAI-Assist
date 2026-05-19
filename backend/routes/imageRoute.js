import express from "express";
import multer from "multer";
import fs from "fs";
import axios from "axios";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Temporary storage for uploads
const upload = multer({ dest: "uploads/" });

/**
 * POST /analyze - Image analysis with multi-API fallback
 * Try: Gemini → OpenAI → Hugging Face
 */
router.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    const imagePath = req.file.path;
    const imageData = fs.readFileSync(imagePath);
    const base64Image = imageData.toString("base64");
    const prompt = "Describe this image in detail.";

    // ---- 1️⃣ Try Gemini ----
    try {
      if (process.env.GEMINI_API_KEY) {
        console.log("✨ [image] Trying Gemini...");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const result = await model.generateContent([
          {
            inlineData: {
              mimeType: req.file.mimetype,
              data: base64Image,
            },
          },
          { text: prompt },
        ]);

        const description = result.response.text();
        fs.unlinkSync(imagePath); // Delete uploaded image
        console.log("✅ [image] Gemini succeeded");
        return res.json({ description, source: "Gemini" });
      }
    } catch (err) {
      console.warn("⚠️ [image] Gemini failed:", err.message);
    }

    // ---- 2️⃣ Try OpenAI ----
    try {
      if (process.env.OPENAI_API_KEY) {
        console.log("🤖 [image] Trying OpenAI...");
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: prompt },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:${req.file.mimetype};base64,${base64Image}`,
                  },
                },
              ],
            },
          ],
        });

        const description = response.choices[0].message.content;
        fs.unlinkSync(imagePath); // Delete uploaded image
        console.log("✅ [image] OpenAI succeeded");
        return res.json({ description, source: "OpenAI" });
      }
    } catch (err) {
      console.warn("⚠️ [image] OpenAI failed:", err.message);
    }

    // ---- 3️⃣ Try Hugging Face ----
    try {
      if (process.env.HF_API_KEY) {
        console.log("🤗 [image] Trying Hugging Face...");
        const hfResponse = await axios.post(
          "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large",
          { inputs: base64Image },
          {
            headers: {
              Authorization: `Bearer ${process.env.HF_API_KEY}`,
            },
          }
        );

        const description = hfResponse.data?.[0]?.generated_text || "No description from HF";
        fs.unlinkSync(imagePath); // Delete uploaded image
        console.log("✅ [image] Hugging Face succeeded");
        return res.json({ description, source: "Hugging Face" });
      }
    } catch (err) {
      console.warn("⚠️ [image] Hugging Face failed:", err.message);
    }

    // Clean up
    fs.unlinkSync(imagePath);
    return res.status(500).json({ error: "All image analysis services failed. Try again later." });

  } catch (error) {
    console.error("Error analyzing image:", error.message);
    res.status(500).json({ error: "Image analysis failed. Try again later." });
  }
});

export default router;
