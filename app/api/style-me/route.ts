import { NextResponse } from "next/server";
import { parseStyleIntentWithGemini } from "@/lib/ai/gemini-style-service";

export const runtime = "nodejs";

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

  try {
    const intent = await parseStyleIntentWithGemini({
      apiKey,
      occasion: body.occasion,
      mood: body.mood,
      prompt: body.prompt,
    });

    return NextResponse.json({ intent });
  } catch {
    return NextResponse.json(
      { error: "Gemini styling request failed." },
      { status: 502 }
    );
  }
}
