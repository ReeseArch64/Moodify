import { GoogleGenAI } from "@google/genai";

export const Gemini = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_TOKEN,
});
