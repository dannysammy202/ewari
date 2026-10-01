import { NextResponse } from "next/server";
import { OCCASIONS, STYLE_OPTIONS } from "@/lib/data";
import type { StyleIntent } from "@/lib/types";

export const runtime = "nodejs";

const moods = ["Clean", "Relaxed", "Bold", "Minimal", "Smart", "Street", "Afrocentric"] as const;
const dressLevels = ["Relaxed", "Balanced", "Dressy"] as const;

function isStyleIntent(value: unknown): value is StyleIntent {
  if (!value || typeof value !== "object") return false;
  const intent = value as Partial<StyleIntent>;

  return (
    typeof intent.occasion === "string" &&
    typeof intent.mood === "string" &&
    Array.isArray(intent.colours) &&
    Array.isArray(intent.requiredItems) &&
    dressLevels.includes(intent.dressLevel as (typeof dressLevels)[number]) &&
    Array.isArray(intent.styleHints) &&
    Array.isArray(intent.avoid) &&
    typeof intent.stylingDirection === "string"
  );
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Gemini is not configured." },
      { status: 503 }
    );
  }

  let body: { occasion?: string; mood?: string; prompt?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const selectedOccasion = typeof body.occasion === "string" ? body.occasion : "Casual outing";
  const selectedMood = typeof body.mood === "string" ? body.mood : "Clean";
  const prompt = typeof body.prompt === "string" ? body.prompt.trim().slice(0, 700) : "";

  const instruction = [
    "You are the intent parser for EWARI, a personal styling inspiration app.",
    "EWARI does not sell clothing. Your job is only to understand the user's styling request.",
    "Return a concise structured interpretation.",
    `The UI selection is occasion="${selectedOccasion}" and mood="${selectedMood}".`,
    "Keep those selections unless the written request clearly asks for another supported option.",
    `Supported occasions: ${OCCASIONS.join(", ")}.`,
    `Supported moods: ${moods.join(", ")}.`,
    `Supported style hints: ${STYLE_OPTIONS.join(", ")}.`,
    "Use Nigerian fashion context naturally when relevant, while keeping recommendations globally understandable.",
    "Do not invent prices or retailers.",
    `User request: ${prompt || "No extra written request."}`,
  ].join("\n");

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: instruction }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              occasion: {
                type: "STRING",
                enum: OCCASIONS,
              },
              mood: {
                type: "STRING",
                enum: moods,
              },
              colours: {
                type: "ARRAY",
                items: { type: "STRING" },
              },
              requiredItems: {
                type: "ARRAY",
                items: { type: "STRING" },
              },
              dressLevel: {
                type: "STRING",
                enum: dressLevels,
              },
              styleHints: {
                type: "ARRAY",
                items: {
                  type: "STRING",
                  enum: STYLE_OPTIONS,
                },
              },
              avoid: {
                type: "ARRAY",
                items: { type: "STRING" },
              },
              stylingDirection: {
                type: "STRING",
              },
            },
            required: [
              "occasion",
              "mood",
              "colours",
              "requiredItems",
              "dressLevel",
              "styleHints",
              "avoid",
              "stylingDirection",
            ],
          },
        },
      }),
      signal: AbortSignal.timeout(12000),
    }
  );

  if (!response.ok) {
    return NextResponse.json(
      { error: "Gemini request failed." },
      { status: 502 }
    );
  }

  const payload = await response.json();
  const raw = payload?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (typeof raw !== "string") {
    return NextResponse.json(
      { error: "Gemini returned no styling intent." },
      { status: 502 }
    );
  }

  try {
    const intent = JSON.parse(raw);

    if (!isStyleIntent(intent)) {
      throw new Error("Invalid intent");
    }

    return NextResponse.json({ intent });
  } catch {
    return NextResponse.json(
      { error: "Gemini returned an invalid styling intent." },
      { status: 502 }
    );
  }
}
