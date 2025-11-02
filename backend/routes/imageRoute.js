import express from "express";
import multer from "multer";
import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// Temporary storage for uploads
const upload = multer({ dest: "uploads/" });

// Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    const imagePath = req.file.path;
    const imageData = fs.readFileSync(imagePath);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: req.file.mimetype,
          data: imageData.toString("base64"),
        },
      },
      { text: "Describe this image in detail." },
    ]);

    const description = result.response.text();

    // Delete uploaded image
    fs.unlinkSync(imagePath);

    res.json({ description });
  } catch (error) {
    console.error("Error analyzing image:", error.message);
    res.status(500).json({ error: "Image analysis failed. Try again later." });
  }
});

export default router;
