import { OCCASIONS, STYLE_OPTIONS } from "@/lib/data";
import {
  GEMINI_STYLE_INTENT_SCHEMA,
  STYLE_MOODS,
  isStyleIntent,
} from "@/lib/ai/style-intent-schema";
import type { StyleIntent } from "@/lib/types";

type GeminiStyleRequest = {
  apiKey: string;
  occasion?: string;
  mood?: string;
  prompt?: string;
};

function buildInstruction(occasion: string, mood: string, prompt: string) {
  return [
    "You are the intent parser for EWARI, a personal styling inspiration app.",
    "EWARI does not sell clothing. Your job is only to understand the user's styling request.",
    "Return a concise structured interpretation.",
    `The UI selection is occasion="${occasion}" and mood="${mood}".`,
    "Keep those selections unless the written request clearly asks for another supported option.",
    `Supported occasions: ${OCCASIONS.join(", ")}.`,
    `Supported moods: ${STYLE_MOODS.join(", ")}.`,
    `Supported style hints: ${STYLE_OPTIONS.join(", ")}.`,
    "Use Nigerian fashion context naturally when relevant, while keeping recommendations globally understandable.",
    "Do not invent prices or retailers.",
    `User request: ${prompt || "No extra written request."}`,
  ].join("\n");
}

export async function parseStyleIntentWithGemini({
  apiKey,
  occasion,
  mood,
  prompt,
}: GeminiStyleRequest): Promise<StyleIntent> {
  const selectedOccasion = typeof occasion === "string" ? occasion : "Casual outing";
  const selectedMood = typeof mood === "string" ? mood : "Clean";
  const cleanPrompt = typeof prompt === "string" ? prompt.trim().slice(0, 700) : "";

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: buildInstruction(selectedOccasion, selectedMood, cleanPrompt) }],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: GEMINI_STYLE_INTENT_SCHEMA,
        },
      }),
      signal: AbortSignal.timeout(12000),
    }
  );

  if (!response.ok) throw new Error("Gemini request failed");

  const payload = await response.json();
  const raw = payload?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (typeof raw !== "string") throw new Error("Gemini returned no styling intent");

  const parsed = JSON.parse(raw);

  if (!isStyleIntent(parsed)) throw new Error("Gemini returned an invalid styling intent");

  return parsed;
}
