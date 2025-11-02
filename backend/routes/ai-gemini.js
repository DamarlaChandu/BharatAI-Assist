import express from "express";
import axios from "axios";

const router = express.Router();

// ✅ Correct endpoint and structure for MakerSuite Gemini API (v1beta)
router.post("/", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const url =
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
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

    res.json({ reply });
  } catch (error) {
    const errMsg =
      error.response?.data?.error?.message ||
      error.message ||
      "Unknown error occurred";
    res.status(500).json({ error: errMsg });
  }
});

export default router;
