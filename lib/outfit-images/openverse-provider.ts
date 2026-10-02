import { buildOutfitImageQuery } from "@/lib/outfit-images/query-builder";
import { scoreOpenverseResult } from "@/lib/outfit-images/result-scorer";
import type { OpenverseResult, OutfitImage, OutfitImageSearchItem } from "@/lib/outfit-images/types";

export async function searchOpenverseImage(item: OutfitImageSearchItem): Promise<OutfitImage | null> {
  const params = new URLSearchParams({
    q: buildOutfitImageQuery(item),
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
    .sort((a, b) => scoreOpenverseResult(item, b) - scoreOpenverseResult(item, a))[0];

  if (!selected) return null;

  return {
    itemId: item.id,
    imageUrl: selected.thumbnail || selected.url || "",
    fullImageUrl: selected.url || selected.thumbnail,
    title: selected.title || item.name,
    creator: selected.creator || "Unknown creator",
    license: selected.license || "Open licence",
    licenseUrl: selected.license_url || null,
    sourceUrl: selected.foreign_landing_url || null,
    attribution: selected.attribution || null,
  };
}
