import express from "express";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// In-memory cache (30 min TTL per state)
const cache = {};
const CACHE_DURATION = 30 * 60 * 1000;

// ─── Helper: Fetch from data.gov.in ───────────────────────────────────────────
async function fetchLiveMandi(state) {
  const apiKey =
    process.env.DATA_API_KEY ||
    "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b";

  const response = await axios.get(
    "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070",
    {
      params: {
        "api-key": apiKey,
        format: "json",
        "filters[state]": state,
        limit: 20,
      },
      timeout: 12000,
      headers: {
        Accept: "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    }
  );

  const records = response.data.records || [];
  return records.map((r) => ({
    crop: r.commodity || "Unknown",
    price: String(r.modal_price || "N/A"),
    market: r.market || "Unknown",
    district: r.district || "Unknown",
  }));
}

// ─── Helper: Generate via Gemini AI ───────────────────────────────────────────
async function generateWithRetry(model, prompt, maxRetries = 2) {
  let lastError;
  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      lastError = err;
      const isRetryable = err.message?.includes("503") || err.message?.includes("Service Unavailable") || err.message?.includes("high demand");
      if (isRetryable && attempt <= maxRetries) {
        const delay = attempt * 1000;
        console.warn(`⚠️ [Mandi AI] Model busy, retrying in ${delay}ms (Attempt ${attempt}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw err;
      }
    }
  }
}

async function fetchMandiViaGemini(state) {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) throw new Error("No Gemini key configured");

  const genAI = new GoogleGenerativeAI(geminiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const prompt = `You are an agricultural commodity price expert for India. Today is ${today}.
Generate realistic current wholesale mandi prices for 10 major agricultural commodities grown in "${state}", India.
Return ONLY a valid JSON array of objects with keys: "crop", "price", "market", "district".`;

  const text = await generateWithRetry(model, prompt);
  const cleaned = text.trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  const parsed = JSON.parse(cleaned);
  return parsed.map((r) => ({
    crop: String(r.crop || "Unknown"),
    price: String(r.price || "N/A"),
    market: String(r.market || "Unknown"),
    district: String(r.district || "Unknown"),
  }));
}

// ─── Route: GET /api/agriculture/mandi?state=XYZ ──────────────────────────────
router.get("/", async (req, res) => {
  const { state } = req.query;

  if (!state) {
    return res.status(400).json({ error: "State is required" });
  }

  // ── Tier 1: Check Cache ──
  if (cache[state] && Date.now() - cache[state].timestamp < CACHE_DURATION) {
    console.log(`✅ [Mandi] Returning cached data for ${state}`);
    return res.json({
      source: cache[state].source + "-cached",
      data: cache[state].data,
    });
  }

  // ── Tier 2: Try Live data.gov.in API ──
  try {
    console.log(`🌐 [Mandi] Fetching live data from data.gov.in for ${state}...`);
    const mandiData = await fetchLiveMandi(state);

    if (mandiData.length > 0) {
      cache[state] = { timestamp: Date.now(), data: mandiData, source: "live" };
      console.log(`✅ [Mandi] Live data fetched for ${state}: ${mandiData.length} records`);
      return res.json({ source: "live", data: mandiData });
    }

    console.warn(`⚠️ [Mandi] Live API returned 0 records for ${state}, falling to Gemini...`);
  } catch (liveErr) {
    const status = liveErr.response?.status;
    console.error(`❌ [Mandi] Live API failed for ${state} (${status || liveErr.message}), trying Gemini...`);
  }

  // ── Tier 3: Gemini AI Generated Prices ──
  try {
    console.log(`🤖 [Mandi] Generating mandi prices via Gemini for ${state}...`);
    const aiData = await fetchMandiViaGemini(state);

    cache[state] = { timestamp: Date.now(), data: aiData, source: "ai" };
    console.log(`✅ [Mandi] Gemini generated ${aiData.length} records for ${state}`);

    return res.json({
      source: "ai",
      data: aiData,
      message: "🤖 AI-estimated prices based on current market trends. For official prices, visit agmarknet.gov.in",
    });
  } catch (aiErr) {
    console.error(`❌ [Mandi] Gemini also failed for ${state}:`, aiErr.message);

    // ── Last resort: hardcoded state-specific data ──
    const lastResort = [
      { crop: "Rice", price: "2450", market: `${state} Main Mandi`, district: state },
      { crop: "Wheat", price: "2200", market: `${state} Central APMC`, district: state },
      { crop: "Cotton", price: "6800", market: `${state} Market Yard`, district: state },
      { crop: "Maize", price: "1900", market: `${state} APMC`, district: state },
    ];

    return res.json({
      source: "fallback",
      data: lastResort,
      message: "⚠️ Unable to fetch live prices at this moment. Showing estimated data.",
    });
  }
});

export default router;
