import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
dotenv.config();

async function test() {
  const keys = [
    { name: "KEY_1", value: process.env.GEMINI_API_KEY_1 },
    { name: "KEY_2", value: process.env.GEMINI_API_KEY_2 },
    { name: "KEY_3", value: process.env.GEMINI_API_KEY_3 },
  ];

  for (const key of keys) {
    if (!key.value) { console.log(`${key.name}: not set`); continue; }
    console.log(`\n=== ${key.name} (${key.value.substring(0, 15)}...) ===`);
    try {
      const genAI = new GoogleGenerativeAI(key.value);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent("Say hello in one word");
      console.log(`  ✅ SUCCESS: "${result.response.text().trim().substring(0, 60)}"`);
    } catch (err: any) {
      console.log(`  ❌ FAILED (${err.status}): ${err.message?.substring(0, 200)}`);
    }
  }
}

test();
