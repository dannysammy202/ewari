import type { Outfit } from "@/lib/types";

export const ITEM_ALIASES: Record<string, string[]> = {
  sneakers: ["sneaker", "trainer"],
  sneaker: ["sneaker", "trainer"],
  trainers: ["trainer", "sneaker"],
  trainer: ["trainer", "sneaker"],
  trousers: ["trouser", "pants"],
  trouser: ["trouser", "pants"],
  pants: ["trouser", "pants"],
  cargos: ["cargo"],
  cargo: ["cargo"],
  loafers: ["loafer"],
  loafer: ["loafer"],
  hoodie: ["hoodie", "sweatshirt"],
  shirt: ["shirt", "polo", "kaftan"],
  ankara: ["ankara"],
  bag: ["bag", "crossbody", "tote", "sling"],
  watch: ["watch"],
  slides: ["slide"],
  boots: ["boot"],
};

function normalise(value: string) {
  return value.trim().toLowerCase();
}

export function detectRequiredItems(text: string) {
  const normalised = text.toLowerCase();
  return Object.keys(ITEM_ALIASES).filter((item) => normalised.includes(item));
}

export function termMatchesOutfit(term: string, outfit: Outfit) {
  const key = normalise(term);
  const aliases = ITEM_ALIASES[key] || [key];

  const haystack = [
    outfit.title,
    outfit.description,
    outfit.occasion,
    ...outfit.style,
    ...outfit.mood,
    ...outfit.items.flatMap((item) => [
      item.name,
      item.colour,
      item.fit || "",
      item.material || "",
    ]),
  ].join(" ").toLowerCase();

  return aliases.some((alias) => haystack.includes(alias));
}
