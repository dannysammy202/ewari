import { COLOUR_OPTIONS, OUTFITS, STYLE_OPTIONS } from "@/lib/data";
import type { Outfit, StyleIntent, StyleProfile } from "@/lib/types";

const itemAliases: Record<string, string[]> = {
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

function termMatchesOutfit(term: string, outfit: Outfit) {
  const key = normalise(term);
  const aliases = itemAliases[key] || [key];
  const haystack = [
    outfit.title,
    outfit.description,
    outfit.occasion,
    ...outfit.style,
    ...outfit.mood,
    ...outfit.items.flatMap((item) => [item.name, item.colour, item.fit || "", item.material || ""]),
  ].join(" ").toLowerCase();

  return aliases.some((alias) => haystack.includes(alias));
}

export function fallbackStyleIntent(occasion: string, mood: string, prompt: string): StyleIntent {
  const text = prompt.toLowerCase();
  const colours = COLOUR_OPTIONS.filter((colour) => text.includes(colour.toLowerCase()));
  const styleHints = STYLE_OPTIONS.filter((style) => text.includes(style.toLowerCase()));

  const requiredItems = Object.keys(itemAliases).filter((item) => text.includes(item));
  const avoid: string[] = [];

  const avoidMatch = text.match(/(?:avoid|no|without)\s+([a-z -]+)/i);
  if (avoidMatch?.[1]) avoid.push(avoidMatch[1].trim());

  let dressLevel: StyleIntent["dressLevel"] = "Balanced";
  if (/(formal|dressy|sharp|smart)/i.test(prompt)) dressLevel = "Dressy";
  if (/(casual|easy|relaxed|laid back|laid-back)/i.test(prompt)) dressLevel = "Relaxed";

  return {
    occasion,
    mood,
    colours,
    requiredItems,
    dressLevel,
    styleHints,
    avoid,
    stylingDirection: prompt.trim() || `${mood} styling for ${occasion.toLowerCase()}.`,
  };
}

export function rankOutfitsForIntent(
  intent: StyleIntent,
  profile?: StyleProfile | null,
  source: Outfit[] = OUTFITS
) {
  const score = (outfit: Outfit) => {
    let points = 0;

    if (outfit.occasion.toLowerCase() === intent.occasion.toLowerCase()) points += 10;
    if (outfit.mood.some((value) => value.toLowerCase() === intent.mood.toLowerCase())) points += 6;
    if (outfit.dressLevel === intent.dressLevel) points += 4;

    points += intent.styleHints.filter((style) =>
      outfit.style.some((value) => value.toLowerCase() === style.toLowerCase())
    ).length * 4;

    points += intent.colours.filter((colour) =>
      outfit.items.some((item) =>
        `${item.name} ${item.colour}`.toLowerCase().includes(colour.toLowerCase())
      )
    ).length * 3;

    points += intent.requiredItems.filter((item) => termMatchesOutfit(item, outfit)).length * 6;
    points -= intent.avoid.filter((item) => termMatchesOutfit(item, outfit)).length * 8;

    if (profile) {
      points += outfit.style.filter((style) => profile.styles.includes(style)).length * 2;
      points += outfit.items.filter((item) =>
        profile.colours.some((colour) =>
          `${item.name} ${item.colour}`.toLowerCase().includes(colour.toLowerCase())
        )
      ).length;
    }

    return points;
  };

  return [...source]
    .map((outfit, index) => ({ outfit, index, score: score(outfit) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ outfit }) => outfit);
}
