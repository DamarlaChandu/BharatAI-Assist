import express from "express";
import axios from "axios";

const router = express.Router();

/**
 * ✅ Fetch mandi prices from external API (data.gov.in)
 * with fallback to demo data if request fails.
 */
router.get("/", async (req, res) => {
  const { state } = req.query;

  if (!state) {
    return res.status(400).json({ error: "State is required" });
  }

  try {
    // 🌾 Try live API call
    const response = await axios.get(
      "https://data.gov.in/api/datastore/resource.json",
      {
        params: {
          resource_id: "9ef84268-d588-465a-a308-a864a43d0070", // Mandi prices dataset
          api_key:
            "579b464db66ec23bdd000001f98c78825fb343f452e263c75b4f2500", // demo API key
          filters: JSON.stringify({ state }),
          limit: 10,
        },
      }
    );

    const records = response.data.records || [];

    // 🔹 Convert API data to clean format
    const mandiData = records.map((r) => ({
      crop: r.commodity || "Unknown",
      price: r.modal_price || "N/A",
      market: r.market || "Unknown",
      district: r.district || "Unknown",
    }));

    return res.json({ source: "live", data: mandiData });
  } catch (err) {
    console.error("❌ Live Mandi API failed, switching to fallback:", err.message);

    // 🔸 Fallback demo data (if API fails)
    const fallbackData = [
      {
        crop: "Rice",
        price: "2300",
        market: "Guntur",
        district: "Guntur",
      },
      {
        crop: "Wheat",
        price: "2200",
        market: "Ludhiana",
        district: "Ludhiana",
      },
      {
        crop: "Cotton",
        price: "6100",
        market: "Warangal",
        district: "Warangal",
      },
      {
        crop: "Turmeric",
        price: "9000",
        market: "Erode",
        district: "Erode",
      },
    ];

    return res.json({ source: "fallback", data: fallbackData });
  }
});

export default router;
