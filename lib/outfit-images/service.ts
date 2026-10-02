import { searchOpenverseImage } from "@/lib/outfit-images/openverse-provider";
import type { OutfitImage, OutfitImageSearchItem } from "@/lib/outfit-images/types";

export async function findOutfitImages(items: OutfitImageSearchItem[]) {
  const settled = await Promise.allSettled(items.slice(0, 6).map(searchOpenverseImage));
  const images: Record<string, OutfitImage> = {};

  settled.forEach((result) => {
    if (result.status === "fulfilled" && result.value) {
      images[result.value.itemId] = result.value;
    }
  });

  return images;
}
