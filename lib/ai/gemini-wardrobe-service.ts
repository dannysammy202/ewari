import {
  WARDROBE_ANALYSIS_SCHEMA,
  isWardrobeAnalysis,
} from "@/lib/ai/wardrobe-analysis-schema";
import type { WardrobeAnalysis } from "@/lib/wardrobe/types";

type AnalyseWardrobeImageInput = {
  apiKey: string;
  base64: string;
  mimeType: string;
};

export async function analyseWardrobeImage({
  apiKey,
  base64,
  mimeType,
}: AnalyseWardrobeImageInput): Promise<WardrobeAnalysis> {
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
            parts: [
              {
                inline_data: {
                  mime_type: mimeType,
                  data: base64,
                },
              },
              {
                text: [
                  "Identify the single main clothing item or accessory in this image for a personal wardrobe app.",
                  "Describe only what is visibly supported by the image.",
                  "Do not identify or guess a brand.",
                  "Use a short useful wardrobe name such as 'Black oversized hoodie' or 'Brown leather loafers'.",
                  "Choose the closest category.",
                  "For fit, use Fitted, Regular, Relaxed, Oversized, Loose, or Unknown.",
                  "For pattern, use Solid when there is no visible pattern.",
                  "Return up to three style tags.",
                  "Confidence must be between 0 and 1.",
                ].join("\n"),
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: WARDROBE_ANALYSIS_SCHEMA,
        },
      }),
      signal: AbortSignal.timeout(15000),
    }
  );

  if (!response.ok) {
    throw new Error("Gemini wardrobe analysis failed");
  }

  const payload = await response.json();
  const raw = payload?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (typeof raw !== "string") {
    throw new Error("Gemini returned no wardrobe analysis");
  }

  const parsed = JSON.parse(raw);

  if (!isWardrobeAnalysis(parsed)) {
    throw new Error("Gemini returned invalid wardrobe analysis");
  }

  return {
    ...parsed,
    confidence: Math.max(0, Math.min(1, parsed.confidence)),
  };
}
