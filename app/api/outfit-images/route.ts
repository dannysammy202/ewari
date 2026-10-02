import { NextResponse } from "next/server";
import type { OutfitItem } from "@/lib/types";

export const runtime = "nodejs";

type SearchItem = Pick<OutfitItem, "id" | "name" | "category" | "colour">;

type OpenverseResult = {
  id?: string;
  title?: string | null;
  thumbnail?: string | null;
  url?: string | null;
  creator?: string | null;
  license?: string | null;
  license_url?: string | null;
  foreign_landing_url?: string | null;
  attribution?: string | null;
  tags?: Array<{ name?: string | null }>;
  width?: number | null;
  height?: number | null;
};

function queryFor(item: SearchItem) {
  const base = item.name
    .replace(/tone/gi, "")
    .replace(/minimal/gi, "")
    .replace(/retro/gi, "")
    .trim();

  const suffix: Record<SearchItem["category"], string> = {
    top: "fashion clothing isolated white background flat lay",
    outerwear: "fashion jacket isolated white background flat lay",
    bottom: "fashion trousers pants isolated white background flat lay",
    shoes: "fashion shoes sneakers isolated white background product",
    bag: "fashion bag isolated white background product",
    accessory: "fashion accessory isolated white background product",
  };

  return `${base} ${item.colour} ${suffix[item.category]}`.slice(0, 190);
}

function tokenise(item: SearchItem) {
  const stop = new Set(["the", "and", "with", "tone", "minimal", "relaxed", "regular"]);
  return `${item.name} ${item.colour}`
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2 && !stop.has(token));
}

function scoreResult(item: SearchItem, result: OpenverseResult) {
  const haystack = [
    result.title || "",
    ...(result.tags || []).map((tag) => tag.name || ""),
  ].join(" ").toLowerCase();

  let score = tokenise(item).reduce((total, token) => total + (haystack.includes(token) ? 4 : 0), 0);

  const categoryTerms: Record<SearchItem["category"], string[]> = {
    top: ["shirt", "polo", "hoodie", "sweatshirt", "top", "tee", "t-shirt"],
    outerwear: ["jacket", "coat", "overshirt"],
    bottom: ["trouser", "pants", "jeans", "denim", "cargo"],
    shoes: ["shoe", "sneaker", "trainer", "loafer", "slide"],
    bag: ["bag", "crossbody", "tote", "sling"],
    accessory: ["watch", "cap", "bracelet", "chain", "ring", "sunglasses"],
  };

  if (categoryTerms[item.category].some((term) => haystack.includes(term))) score += 5;
  if (haystack.includes("fashion")) score += 2;
  if (haystack.includes("isolated")) score += 2;

  if (result.width && result.height) {
    const ratio = result.width / result.height;
    if (ratio > 0.55 && ratio < 1.8) score += 1;
  }

  return score;
}

async function searchImage(item: SearchItem) {
  const params = new URLSearchParams({
    q: queryFor(item),
    page_size: "12",
    mature: "false",
    license_type: "commercial",
  });

  const response = await fetch(`https://api.openverse.org/v1/images/?${params.toString()}`, {
    headers: {
      Accept: "application/json",
      "User-Agent": "EWARI/0.1 (https://github.com/dannysammy202/ewari)",
    },
    next: { revalidate: 60 * 60 * 24 * 7 },
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) return null;

  const payload = await response.json();
  const results = (Array.isArray(payload?.results) ? payload.results : []) as OpenverseResult[];

  const selected = results
    .filter((result) => result.thumbnail || result.url)
    .sort((a, b) => scoreResult(item, b) - scoreResult(item, a))[0];

  if (!selected) return null;

  return {
    itemId: item.id,
    imageUrl: selected.thumbnail || selected.url,
    fullImageUrl: selected.url || selected.thumbnail,
    title: selected.title || item.name,
    creator: selected.creator || "Unknown creator",
    license: selected.license || "Open licence",
    licenseUrl: selected.license_url || null,
    sourceUrl: selected.foreign_landing_url || null,
    attribution: selected.attribution || null,
  };
}

export async function POST(request: Request) {
  let body: { items?: SearchItem[] };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ images: {} }, { status: 400 });
  }

  const items = (body.items || [])
    .filter((item) => item?.id && item?.name && item?.category)
    .slice(0, 6);

  const settled = await Promise.allSettled(items.map(searchImage));
  const images: Record<string, unknown> = {};

  settled.forEach((result) => {
    if (result.status === "fulfilled" && result.value) {
      images[result.value.itemId] = result.value;
    }
  });

  return NextResponse.json(
    { images, provider: "Openverse" },
    {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    }
  );
}
