import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// ✅ Check API key
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY not found in environment variables!");
}

// ✅ Initialize Gemini client (v1 SDK)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use the stable latest model (pro = high accuracy; flash = faster)
const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });


/**
 * 🌾 POST /api/agriculture/analyze
 * Body: { cropType, base64Image }
 */
router.post("/analyze", async (req, res) => {
  try {
    const { cropType, base64Image } = req.body;

    // 🧩 Validate input
    if (!base64Image || typeof base64Image !== "string") {
      return res.status(400).json({ error: "Valid Base64 image data is required." });
    }

    // 🧠 AI Prompt (Indian Agriculture Focus)
    const prompt = `
You are an expert Indian agricultural advisor.
Analyze the given crop image (type: ${cropType || "Unknown"}).
Identify possible diseases, pest/insect infestations, or nutrient deficiencies.
Provide:
1. Disease or issue name (if detected)
2. Remedies (organic + chemical options)
3. Recommended fertilizers or sprays available in India
4. Preventive care tips to avoid recurrence
Explain simply, in a way that farmers can understand.
`;

    // 🖼️ Prepare AI input with image and text
    const input = [
      {
        inlineData: {
          mimeType: "image/jpeg", // works for both JPG and PNG
          data: base64Image,
        },
      },
      { text: prompt },
    ];

    // 🚀 Generate AI response
    const result = await model.generateContent(input);

    // 🧾 Safely extract text
    const aiReply = result?.response?.text?.() || 
      "Sorry, I couldn’t analyze this image. Please try again with a clearer photo.";

    // ✅ Send response to frontend
    res.json({ reply: aiReply });

  } catch (err) {
    console.error("❌ Image analysis failed:", err.message || err);
    res.status(500).json({
      error: "AI crop analysis failed. Check backend logs for details.",
      details: err.message || err.toString(),
    });
  }
});

export default router;
