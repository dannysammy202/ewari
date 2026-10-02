import { searchOpenverseImage } from "@/lib/outfit-images/openverse-provider";
import { searchWikimediaImage } from "@/lib/outfit-images/wikimedia-provider";
import type { OutfitImage, OutfitImageSearchItem } from "@/lib/outfit-images/types";

async function findImage(item: OutfitImageSearchItem) {
  const openverse = await searchOpenverseImage(item);
  if (openverse) return openverse;

  return searchWikimediaImage(item);
}

export async function findOutfitImages(items: OutfitImageSearchItem[]) {
  const settled = await Promise.allSettled(items.slice(0, 6).map(findImage));
  const images: Record<string, OutfitImage> = {};

  settled.forEach((result) => {
    if (result.status === "fulfilled" && result.value) {
      images[result.value.itemId] = result.value;
    }
  });

  return images;
}
