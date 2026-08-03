import { GoogleGenAI } from '@google/genai';

let client: GoogleGenAI | null = null;

export function getGeminiClient() {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }

  if (!client) {
    client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  return client;
}
