import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const url =
  "https://generativelanguage.googleapis.com/v1beta/models?key=" +
  process.env.GEMINI_API_KEY;

axios
  .get(url)
  .then((r) => {
    console.log("✅ Models your key can access:\n");
    r.data.models.forEach((m) => console.log("•", m.name));
  })
  .catch((e) =>
    console.error("❌ Error listing models:", e.response?.data || e.message)
  );
