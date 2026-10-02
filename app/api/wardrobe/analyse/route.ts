import { NextResponse } from "next/server";
import { analyseWardrobeImage } from "@/lib/ai/gemini-wardrobe-service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Gemini is not configured." },
      { status: 503 }
    );
  }

  let body: { base64?: string; mimeType?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!body.base64 || !body.mimeType?.startsWith("image/")) {
    return NextResponse.json({ error: "Image required." }, { status: 400 });
  }

  if (body.base64.length > 4_000_000) {
    return NextResponse.json({ error: "Image is too large." }, { status: 413 });
  }

  try {
    const analysis = await analyseWardrobeImage({
      apiKey,
      base64: body.base64,
      mimeType: body.mimeType,
    });

    return NextResponse.json({ analysis });
  } catch {
    return NextResponse.json(
      { error: "Wardrobe analysis failed." },
      { status: 502 }
    );
  }
}
