import { NextResponse } from "next/server";
import { findOutfitImages } from "@/lib/outfit-images/service";
import type { OutfitImageSearchItem } from "@/lib/outfit-images/types";

export const runtime = "nodejs";

function isSearchItem(value: unknown): value is OutfitImageSearchItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<OutfitImageSearchItem>;
  return Boolean(item.id && item.name && item.category && item.colour);
}

export async function POST(request: Request) {
  let body: { items?: unknown[] };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ images: {} }, { status: 400 });
  }

  const items = (body.items || []).filter(isSearchItem).slice(0, 6);
  const images = await findOutfitImages(items);

  return NextResponse.json(
    { images, provider: "Openverse" },
    {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    }
  );
}
