import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// ── Gemini setup with Retry Logic ─────────────────────────────────────────────
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Robust AI generation with automatic retries for 503/Overloaded errors
 */
async function generateWithRetry(prompt, maxRetries = 2) {
  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
  let lastError;

  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      lastError = err;
      const isRetryable = err.message?.includes("503") || err.message?.includes("Service Unavailable") || err.message?.includes("high demand");
      
      if (isRetryable && attempt <= maxRetries) {
        const delay = attempt * 1000; // Exponential backoff: 1s, 2s
        console.warn(`⚠️ [AI] Model busy, retrying in ${delay}ms (Attempt ${attempt}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw err;
      }
    }
  }
}

// ── Fallback symptom map ────────────────────
const SYMPTOM_FALLBACKS = {
  fever: "🌡️ **Possible Fever**\n• Monitor temperature every 4 hours\n• Stay well hydrated (ORS/water)\n• Take paracetamol if >38.5°C\n• Consult a doctor if fever persists >3 days",
  cough: "🫁 **Respiratory Symptom - Cough**\n• Could be viral/bacterial infection or allergy\n• Drink warm fluids with honey & ginger\n• Avoid cold/dusty environments\n• See a doctor if cough lasts >2 weeks or brings blood",
  headache: "🧠 **Headache / Migraine**\n• Rest in a quiet, dark room\n• Stay hydrated and avoid screen time\n• Take over-the-counter pain relief (ibuprofen/paracetamol)\n• Seek help if sudden and severe (could be serious)",
  stomach: "🫄 **Stomach / Digestive Issue**\n• Eat light, easily digestible food (khichdi, curd rice)\n• Avoid spicy or oily food\n• Drink plenty of fluids to prevent dehydration\n• See a doctor if pain is severe or persistent",
  diarrhea: "💧 **Diarrhea**\n• Most important: drink ORS to replace fluids\n• Avoid dairy, fatty or spicy foods\n• Eat bananas, rice, toast\n• Consult doctor if blood in stool or lasting >48h",
  chest: "❤️ **Chest Pain / Tightness** — URGENT\n• Do NOT ignore chest pain\n• Call emergency services (108) immediately",
  breathless: "🆘 **Breathlessness** — URGENT\n• Seek emergency care immediately (call 108)",
  rash: "🩹 **Skin Rash / Irritation**\n• Avoid scratching\n• Apply calamine lotion / cold compress",
};

const TIPS_FALLBACKS = {
  diabetes: "🩸 **Diabetes Prevention & Management**\n• Maintain a low-sugar, high-fibre diet\n• Exercise at least 30 minutes per day\n• Monitor blood glucose regularly",
  malaria: "🦟 **Malaria Prevention**\n• Sleep under insecticide-treated mosquito nets\n• Use mosquito repellents\n• Clear stagnant water",
  dengue: "🦟 **Dengue Prevention**\n• Eliminate stagnant water\n• Use mosquito repellents\n• Wear full-sleeve clothing",
  hypertension: "💊 **Hypertension**\n• Reduce salt intake\n• Exercise regularly\n• Monitor BP regularly",
};

const HOSPITALS_FALLBACK = {
  Hyderabad: [
    { name: "Apollo Hospitals", address: "Jubilee Hills", type: "Multi-Specialty", contact: "040-23607777" },
    { name: "KIMS Hospital", address: "Begumpet", type: "Multi-Specialty", contact: "040-44885000" },
  ],
  Delhi: [
    { name: "AIIMS Delhi", address: "Ansari Nagar", type: "Government", contact: "011-26588500" },
    { name: "Fortis Hospital", address: "Vasant Kunj", type: "Private", contact: "011-42776222" },
  ],
};

/**
 * POST /api/health/symptom
 */
router.post("/symptom", async (req, res) => {
  const { symptoms } = req.body;
  if (!symptoms) return res.status(400).json({ error: "Symptoms required" });

  try {
    const prompt = `You are a highly capable AI Medical Assistant specialized in Indian healthcare contexts.
A user reports the following symptoms: "${symptoms}"

Please provide a detailed response including:
1. 🩺 **Possible Conditions**: List 2-3 most likely conditions.
2. 💊 **Immediate Care**: Suggest safe home remedies or first aid.
3. ⚠️ **Urgent Warning Signs**: List "Red Flag" symptoms requiring ER.
4. 🍎 **General Advice**: Lifestyle suggestions.

⚠️ CRITICAL: End with: "**Disclaimer:** This is AI-generated guidance and NOT a medical diagnosis. Please consult a doctor. In emergency, call **108**."`;

    const reply = await generateWithRetry(prompt);
    console.log(`✅ [Health] Symptom check via Gemini for: ${symptoms.slice(0, 40)}`);
    return res.json({ source: "Gemini", reply });
  } catch (err) {
    console.warn("⚠️ [Health] Gemini symptom failed:", err.message, "— using fallback");
    const lower = symptoms.toLowerCase();
    for (const [key, reply] of Object.entries(SYMPTOM_FALLBACKS)) {
      if (lower.includes(key)) {
        return res.json({
          source: "fallback",
          reply: reply + "\n\n⚠️ **Disclaimer:** AI-generated guidance. Consult a doctor. In emergency, call 108.",
        });
      }
    }
    return res.json({
      source: "fallback",
      reply: "🏥 Please describe symptoms specifically. In emergency, call 108.\n\n⚠️ **Disclaimer:** AI-generated guidance. Consult a doctor.",
    });
  }
});

/**
 * POST /api/health/tips
 */
router.post("/tips", async (req, res) => {
  const { disease } = req.body;
  if (!disease) return res.status(400).json({ error: "Disease required" });

  try {
    const prompt = `Provide comprehensive preventive health tips for: "${disease}" in an Indian context. 
Include prevention steps, diet, lifestyle, and early warning signs.`;

    const reply = await generateWithRetry(prompt);
    console.log(`✅ [Health] Tips via Gemini for: ${disease}`);
    return res.json({ source: "Gemini", reply });
  } catch (err) {
    console.warn("⚠️ [Health] Gemini tips failed:", err.message, "— using fallback");
    const lower = disease.toLowerCase();
    for (const [key, reply] of Object.entries(TIPS_FALLBACKS)) {
      if (lower.includes(key)) {
        return res.json({ source: "fallback", reply });
      }
    }
    return res.json({
      source: "fallback",
      reply: `🏥 **General Health Tips for ${disease}**\n• Consult a doctor\n• Balanced diet\n• Exercise 30 min daily`,
    });
  }
});

/**
 * GET /api/health/resources
 */
router.get("/resources", async (req, res) => {
  const { location } = req.query;
  if (!location) return res.status(400).json({ error: "Location required" });

  const locationKey = Object.keys(HOSPITALS_FALLBACK).find(
    (k) => k.toLowerCase() === location.toLowerCase()
  );
  if (locationKey) {
    return res.json({ location, source: "database", data: HOSPITALS_FALLBACK[locationKey] });
  }

  try {
    const prompt = `List 5 real and reputable hospitals near "${location}", India.
Return ONLY a valid JSON array of objects with keys: "name", "address", "type", "contact".`;

    let text = await generateWithRetry(prompt);
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) text = jsonMatch[0];

    const parsed = JSON.parse(text);
    console.log(`✅ [Health] Resources via Gemini for: ${location}`);
    return res.json({ location, source: "AI", data: parsed });
  } catch (err) {
    console.warn("⚠️ [Health] Gemini resources failed:", err.message, "— using default");
    return res.json({
      location,
      source: "fallback",
      data: [
        { name: "Government District Hospital", address: `Main Road, ${location}`, type: "Government", contact: "108" },
      ],
      message: "⚠️ Exact hospitals not found. Showing general resources. Call 104 for help.",
    });
  }
});

export default router;
