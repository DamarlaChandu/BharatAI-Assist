import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function testKey() {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "Say hello from my backend setup!" }]
    });
    console.log("✅ API key working fine!");
    console.log("AI Reply:", response.choices[0].message.content);
  } catch (error) {
    console.error("❌ Something went wrong:", error.message);
  }
}

testKey();
