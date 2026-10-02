import { buildOutfitImageQueries } from "@/lib/outfit-images/query-builder";
import { scoreOpenverseResult } from "@/lib/outfit-images/result-scorer";
import type { OpenverseResult, OutfitImage, OutfitImageSearchItem } from "@/lib/outfit-images/types";

const ENDPOINTS = [
  "https://api.openverse.org/v1/images/",
  "https://api.openverse.engineering/v1/images/",
];

async function searchEndpoint(endpoint: string, query: string, photographOnly: boolean) {
  const params = new URLSearchParams({
    q: query,
    page_size: "30",
    mature: "false",
    license_type: "commercial",
  });

  if (photographOnly) params.set("category", "photograph");

  try {
    const response = await fetch(`${endpoint}?${params.toString()}`, {
      headers: {
        Accept: "application/json",
        "User-Agent": "EWARI/0.1 (https://github.com/dannysammy202/ewari)",
      },
      next: { revalidate: 60 * 60 * 24 * 7 },
      signal: AbortSignal.timeout(9000),
    });

    if (!response.ok) return [];

    const payload = await response.json();
    return (Array.isArray(payload?.results) ? payload.results : []) as OpenverseResult[];
  } catch {
    return [];
  }
}

async function searchQuery(query: string) {
  for (const endpoint of ENDPOINTS) {
    const photos = await searchEndpoint(endpoint, query, true);
    if (photos.length) return photos;

    const broad = await searchEndpoint(endpoint, query, false);
    if (broad.length) return broad;
  }

  return [];
}

export async function searchOpenverseImage(item: OutfitImageSearchItem): Promise<OutfitImage | null> {
  const queries = buildOutfitImageQueries(item);

  for (const query of queries) {
    const results = await searchQuery(query);

    const selected = results
      .filter((result) => (result.thumbnail || result.url) && result.watermarked !== true)
      .sort((a, b) => scoreOpenverseResult(item, b) - scoreOpenverseResult(item, a))[0];

    if (!selected) continue;

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

  return null;
}
