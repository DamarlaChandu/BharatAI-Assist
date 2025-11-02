import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import aiRoutes from "./routes/ai.js";
import smartAI from "./routes/ai-smart.js";
import geminiAI from "./routes/ai-gemini.js";
import products from "./routes/products.js";
import mandiAPI from "./routes/mandiAPI.js"; // ✅ Add this
import healthAI from "./routes/healthAI.js";
import healthAPI from "./routes/healthAPI.js";


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ✅ Register all routes
app.use("/api/askAI", aiRoutes);
app.use("/api/askSmart", smartAI);
app.use("/api/askGemini", geminiAI);
app.use("/api/products", products);
app.use("/api/agriculture/mandi", mandiAPI); // ✅ Add this
app.use("/api/health", healthAI);
app.use("/api/health", healthAPI);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));
