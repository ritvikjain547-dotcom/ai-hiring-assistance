import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
dotenv.config();

async function test() {
  const key = process.env.GEMINI_API_KEY_2;
  console.log("Testing key:", key);
  
  try {
    const genAI = new GoogleGenerativeAI(key!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent("Say hello");
    console.log("Success:", result.response.text());
  } catch (err: any) {
    console.error("FULL ERROR:", err.message);
    console.error("Status:", err.status);
    console.error("Details:", JSON.stringify(err.errorDetails, null, 2));
  }
}

test();
