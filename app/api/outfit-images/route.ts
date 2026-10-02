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
    { images },
    {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    }
  );
}

export async function GET() {
  const sample: OutfitImageSearchItem[] = [
    { id: "sample-top", name: "Cream knitted polo", category: "top", colour: "Cream" },
    { id: "sample-bottom", name: "Brown relaxed trousers", category: "bottom", colour: "Brown" },
    { id: "sample-shoes", name: "White low-top trainers", category: "shoes", colour: "White" },
  ];

  const images = await findOutfitImages(sample);

  return NextResponse.json({
    ok: Object.keys(images).length > 0,
    count: Object.keys(images).length,
    items: Object.values(images).map((image) => ({
      itemId: image.itemId,
      sourceUrl: image.sourceUrl,
      imageUrl: image.imageUrl,
      license: image.license,
    })),
  });
}
