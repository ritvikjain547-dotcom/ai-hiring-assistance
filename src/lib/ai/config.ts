

import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * AI Provider Configuration
 * 
 * Supports two providers (checked in order):
 * 1. OpenRouter (OPENROUTER_API_KEY) — unified API, many models, generous limits
 * 2. Gemini Direct (GEMINI_API_KEY_1/2/3) — free tier with key rotation
 */

// ─── Provider Detection ─────────────────────────────────────────────────────

function getOpenRouterKey(): string | null {
  const key = process.env.OPENROUTER_API_KEY;
  return key && key.trim().length > 10 ? key.trim() : null;
}

let currentKeyIndex = 0;

function getGeminiApiKeys(): string[] {
  const keys: string[] = [];
  for (let i = 1; i <= 3; i++) {
    const key = process.env[`GEMINI_API_KEY_${i}`];
    if (key && key.trim().length > 10 && key !== '""' && key.trim().startsWith('AIza')) {
      keys.push(key.trim());
    } else if (key && key.trim().length > 10 && !key.trim().startsWith('AIza')) {
      console.warn(`[Gemini] Skipping GEMINI_API_KEY_${i} — invalid format (must start with 'AIza')`);
    }
  }
  return keys;
}

function getNextGeminiKey(): string {
  const keys = getGeminiApiKeys();
  if (keys.length === 0) {
    throw new Error(
      "No Gemini API keys configured. " +
      "Set GEMINI_API_KEY_1, GEMINI_API_KEY_2, or GEMINI_API_KEY_3 in .env. " +
      "Get free keys at: https://aistudio.google.com/apikey"
    );
  }
  const key = keys[currentKeyIndex % keys.length];
  currentKeyIndex = (currentKeyIndex + 1) % keys.length;
  return key;
}

type AiProvider = "openrouter" | "gemini";

function getProvider(): AiProvider {
  if (getOpenRouterKey()) return "openrouter";
  if (getGeminiApiKeys().length > 0) return "gemini";
  throw new Error("No AI provider configured. Set OPENROUTER_API_KEY or GEMINI_API_KEY_1 in .env");
}

export function isAiConfigured(): boolean {
  return !!getOpenRouterKey() || getGeminiApiKeys().length > 0;
}

// ─── Model Configuration ────────────────────────────────────────────────────

/** Model to use on OpenRouter (free Gemini 2.5 Flash) */
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "google/gemini-2.5-flash";
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1/chat/completions";

/** Model to use for direct Gemini SDK calls */
const GEMINI_MODEL = "gemini-2.5-flash";

// ─── OpenRouter Implementation ──────────────────────────────────────────────

async function callOpenRouter(
  prompt: string,
  temperature: number,
  maxRetries: number,
): Promise<string> {
  const apiKey = getOpenRouterKey()!;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      console.log(`[OpenRouter] Attempt ${attempt + 1} using model ${OPENROUTER_MODEL}...`);

      const response = await fetch(OPENROUTER_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
          "X-Title": "AI Hiring Assistant",
        },
        body: JSON.stringify({
          model: OPENROUTER_MODEL,
          messages: [{ role: "user", content: prompt }],
          temperature,
          max_tokens: 4096,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`OpenRouter API error ${response.status}: ${errorBody.substring(0, 300)}`);
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content;

      if (!text || text.trim().length === 0) {
        throw new Error("Empty response from OpenRouter");
      }

      console.log(`[OpenRouter] Success (${text.length} chars)`);
      return text;
    } catch (error: any) {
      lastError = error instanceof Error ? error : new Error(String(error));
      const msg = lastError.message;

      console.error(`[OpenRouter] Attempt ${attempt + 1} failed:`, msg.substring(0, 150));

      // Rate limit — wait and retry
      if (msg.includes("429") || msg.includes("rate") || msg.includes("Too Many")) {
        const waitSecs = Math.min(10 * (attempt + 1), 30);
        console.log(`[OpenRouter] Rate limited. Waiting ${waitSecs}s...`);
        await new Promise(r => setTimeout(r, waitSecs * 1000));
        continue;
      }

      // Other errors — small delay
      if (attempt < maxRetries - 1) {
        await new Promise(r => setTimeout(r, 2000 * (attempt + 1)));
      }
    }
  }

  throw lastError || new Error("OpenRouter API call failed after all retries");
}

// ─── Gemini Direct Implementation ───────────────────────────────────────────

async function callGeminiDirect(
  prompt: string,
  temperature: number,
  maxRetries: number,
): Promise<string> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const apiKey = getNextGeminiKey();
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: GEMINI_MODEL,
        generationConfig: {
          temperature,
          maxOutputTokens: 4096,
        },
      });

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      if (!text || text.trim().length === 0) {
        throw new Error("Empty response from Gemini");
      }

      return text;
    } catch (error: any) {
      lastError = error instanceof Error ? error : new Error(String(error));
      const msg = lastError.message;

      console.error(`[Gemini] Attempt ${attempt + 1} with key ...${apiKey.slice(-6)} failed:`, msg.substring(0, 120));

      // If rate limited, check if quota is fully exhausted vs temporary
      if (msg.includes("429") || msg.includes("quota") || msg.includes("Too Many")) {
        // If "limit: 0" — the daily quota is fully exhausted, don't wait long
        if (msg.includes("limit: 0")) {
          console.log(`[Gemini] Key ...${apiKey.slice(-6)} daily quota exhausted. Trying next key immediately...`);
          await new Promise(r => setTimeout(r, 1000));
          continue;
        }
        const retryMatch = msg.match(/retry in (\d+)/i);
        const waitSecs = retryMatch ? Math.min(parseInt(retryMatch[1]) + 2, 30) : 15;
        console.log(`[Gemini] Rate limited. Waiting ${waitSecs}s before retrying with next key...`);
        await new Promise(r => setTimeout(r, waitSecs * 1000));
        continue;
      }

      // For other errors, small delay then try next key
      if (attempt < maxRetries - 1) {
        await new Promise(r => setTimeout(r, 2000 * (attempt + 1)));
      }
    }
  }

  throw lastError || new Error("Gemini API call failed after all retries");
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Call the configured AI provider with a text prompt and return the response.
 * Automatically selects OpenRouter or Gemini Direct based on env configuration.
 */
export async function callGemini(
  prompt: string,
  temperature: number = 0.3,
  maxRetries: number = 3,
): Promise<string> {
  const provider = getProvider();
  console.log(`[AI] Using provider: ${provider}`);

  if (provider === "openrouter") {
    return callOpenRouter(prompt, temperature, maxRetries);
  } else {
    return callGeminiDirect(prompt, temperature, maxRetries);
  }
}
