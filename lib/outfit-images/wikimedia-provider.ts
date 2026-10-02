import { buildOutfitImageQueries } from "@/lib/outfit-images/query-builder";
import type { OutfitImage, OutfitImageSearchItem } from "@/lib/outfit-images/types";

type CommonsPage = {
  title?: string;
  imageinfo?: Array<{
    thumburl?: string;
    url?: string;
    descriptionurl?: string;
    extmetadata?: {
      Artist?: { value?: string };
      LicenseShortName?: { value?: string };
      LicenseUrl?: { value?: string };
      UsageTerms?: { value?: string };
    };
  }>;
};

function stripHtml(value?: string) {
  if (!value) return "";
  return value.replace(/<[^>]+>/g, "").replace(/&[^;]+;/g, " ").trim();
}

async function searchCommons(query: string) {
  const params = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: query,
    gsrnamespace: "6",
    gsrlimit: "20",
    prop: "imageinfo",
    iiprop: "url|extmetadata",
    iiurlwidth: "700",
    format: "json",
    origin: "*",
  });

  try {
    const response = await fetch(
      `https://commons.wikimedia.org/w/api.php?${params.toString()}`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "EWARI/0.1 (https://github.com/dannysammy202/ewari)",
        },
        next: { revalidate: 60 * 60 * 24 * 7 },
        signal: AbortSignal.timeout(9000),
      }
    );

    if (!response.ok) return [];

    const payload = await response.json();
    return Object.values(payload?.query?.pages || {}) as CommonsPage[];
  } catch {
    return [];
  }
}

function isUsefulImage(page: CommonsPage, item: OutfitImageSearchItem) {
  const title = (page.title || "").toLowerCase();
  const subject = item.name.toLowerCase();

  const categoryHints: Record<OutfitImageSearchItem["category"], string[]> = {
    top: ["shirt", "polo", "hoodie", "sweatshirt", "t-shirt", "tee"],
    outerwear: ["jacket", "coat", "overshirt"],
    bottom: ["trouser", "pants", "jeans", "cargo"],
    shoes: ["shoe", "sneaker", "trainer", "loafer", "boot", "slide"],
    bag: ["bag", "tote", "crossbody", "sling"],
    accessory: ["watch", "cap", "sunglasses", "bracelet", "ring", "chain"],
  };

  if (categoryHints[item.category].some((hint) => title.includes(hint))) return true;

  return subject
    .split(/\s+/)
    .filter((token) => token.length > 3)
    .some((token) => title.includes(token));
}

export async function searchWikimediaImage(
  item: OutfitImageSearchItem
): Promise<OutfitImage | null> {
  for (const query of buildOutfitImageQueries(item)) {
    const pages = await searchCommons(query);
    const selected =
      pages.find((page) => isUsefulImage(page, item) && page.imageinfo?.[0]?.thumburl) ||
      pages.find((page) => page.imageinfo?.[0]?.thumburl);

    const info = selected?.imageinfo?.[0];
    if (!selected || !info?.thumburl) continue;

    const metadata = info.extmetadata;

    return {
      itemId: item.id,
      imageUrl: info.thumburl,
      fullImageUrl: info.url || info.thumburl,
      title: (selected.title || item.name).replace(/^File:/i, ""),
      creator: stripHtml(metadata?.Artist?.value) || "Wikimedia Commons contributor",
      license:
        metadata?.LicenseShortName?.value ||
        metadata?.UsageTerms?.value ||
        "Open licence",
      licenseUrl: metadata?.LicenseUrl?.value || null,
      sourceUrl: info.descriptionurl || null,
      attribution: null,
    };
  }

  return null;
}
