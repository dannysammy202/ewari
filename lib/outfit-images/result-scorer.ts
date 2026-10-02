import type { OpenverseResult, OutfitImageSearchItem } from "@/lib/outfit-images/types";

const STOP_WORDS = new Set(["the", "and", "with", "tone", "minimal", "relaxed", "regular"]);

const CATEGORY_TERMS: Record<OutfitImageSearchItem["category"], string[]> = {
  top: ["shirt", "polo", "hoodie", "sweatshirt", "top", "tee", "t-shirt"],
  outerwear: ["jacket", "coat", "overshirt"],
  bottom: ["trouser", "pants", "jeans", "denim", "cargo"],
  shoes: ["shoe", "sneaker", "trainer", "loafer", "slide"],
  bag: ["bag", "crossbody", "tote", "sling"],
  accessory: ["watch", "cap", "bracelet", "chain", "ring", "sunglasses"],
};

function tokenise(item: OutfitImageSearchItem) {
  return `${item.name} ${item.colour}`
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
}

export function scoreOpenverseResult(item: OutfitImageSearchItem, result: OpenverseResult) {
  const haystack = [
    result.title || "",
    ...(result.tags || []).map((tag) => tag.name || ""),
  ].join(" ").toLowerCase();

  let score = tokenise(item).reduce(
    (total, token) => total + (haystack.includes(token) ? 4 : 0),
    0
  );

  if (CATEGORY_TERMS[item.category].some((term) => haystack.includes(term))) score += 5;
  if (haystack.includes("fashion")) score += 2;
  if (haystack.includes("isolated")) score += 2;

  if (result.width && result.height) {
    const ratio = result.width / result.height;
    if (ratio > 0.55 && ratio < 1.8) score += 1;
  }

  return score;
}
