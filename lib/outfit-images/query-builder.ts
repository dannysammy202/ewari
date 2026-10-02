import type { OutfitImageSearchItem } from "@/lib/outfit-images/types";

const CATEGORY_SUFFIX: Record<OutfitImageSearchItem["category"], string> = {
  top: "fashion clothing isolated white background flat lay",
  outerwear: "fashion jacket isolated white background flat lay",
  bottom: "fashion trousers pants isolated white background flat lay",
  shoes: "fashion shoes sneakers isolated white background product",
  bag: "fashion bag isolated white background product",
  accessory: "fashion accessory isolated white background product",
};

export function buildOutfitImageQuery(item: OutfitImageSearchItem) {
  const base = item.name
    .replace(/tone/gi, "")
    .replace(/minimal/gi, "")
    .replace(/retro/gi, "")
    .trim();

  return `${base} ${item.colour} ${CATEGORY_SUFFIX[item.category]}`.slice(0, 190);
}
