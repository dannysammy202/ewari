import type { StyleIntent, StyleProfile } from "@/lib/types";
import type {
  WardrobeGapRecommendation,
  WardrobeItem,
  WardrobeLook,
} from "@/lib/wardrobe/types";

const NEUTRALS = ["black", "white", "grey", "gray", "cream", "brown", "beige", "stone", "charcoal", "navy", "tan"];

function text(value: string | undefined) {
  return (value || "").toLowerCase();
}

function itemScore(
  item: WardrobeItem,
  intent: StyleIntent,
  profile?: StyleProfile | null
) {
  let score = 0;
  const haystack = [
    item.name,
    item.colour,
    item.fit || "",
    item.material || "",
    item.pattern || "",
    ...item.styles,
  ].join(" ").toLowerCase();

  intent.colours.forEach((colour) => {
    if (haystack.includes(colour.toLowerCase())) score += 6;
  });

  intent.requiredItems.forEach((required) => {
    if (haystack.includes(required.toLowerCase())) score += 8;
  });

  intent.styleHints.forEach((style) => {
    if (item.styles.some((tag) => tag.toLowerCase() === style.toLowerCase())) score += 5;
  });

  intent.avoid.forEach((avoid) => {
    if (haystack.includes(avoid.toLowerCase())) score -= 12;
  });

  if (profile) {
    profile.colours.forEach((colour) => {
      if (haystack.includes(colour.toLowerCase())) score += 2;
    });
    profile.styles.forEach((style) => {
      if (item.styles.some((tag) => tag.toLowerCase() === style.toLowerCase())) score += 2;
    });
    if (item.fit && profile.fits.includes(item.fit)) score += 2;
  }

  if (NEUTRALS.some((neutral) => text(item.colour).includes(neutral))) score += 1;

  return score;
}

function rankCategory(
  items: WardrobeItem[],
  categories: WardrobeItem["category"][],
  intent: StyleIntent,
  profile?: StyleProfile | null
) {
  return items
    .filter((item) => categories.includes(item.category))
    .map((item) => ({ item, score: itemScore(item, intent, profile) }))
    .sort((a, b) => b.score - a.score || a.item.addedAt.localeCompare(b.item.addedAt))
    .map(({ item }) => item);
}

export function buildWardrobeLooks(
  items: WardrobeItem[],
  intent: StyleIntent,
  profile?: StyleProfile | null,
  limit = 3
): WardrobeLook[] {
  if (!items.length) return [];

  const dresses = rankCategory(items, ["dress"], intent, profile);
  const tops = rankCategory(items, ["top", "outerwear"], intent, profile);
  const bottoms = rankCategory(items, ["bottom"], intent, profile);
  const shoes = rankCategory(items, ["shoes"], intent, profile);
  const extras = rankCategory(items, ["bag", "accessory"], intent, profile);

  const looks: WardrobeLook[] = [];

  for (let index = 0; index < limit; index += 1) {
    const selected: WardrobeItem[] = [];

    if (dresses[index] || (dresses.length && (!tops.length || !bottoms.length))) {
      selected.push(dresses[index % dresses.length]);
    } else {
      if (tops.length) selected.push(tops[index % tops.length]);
      if (bottoms.length) selected.push(bottoms[(index + Math.min(index, bottoms.length - 1)) % bottoms.length]);
    }

    if (shoes.length) selected.push(shoes[index % shoes.length]);
    if (extras.length) selected.push(extras[index % extras.length]);

    const unique = selected.filter(
      (item, itemIndex, source) => source.findIndex((entry) => entry.id === item.id) === itemIndex
    );

    const hasBody = unique.some((item) => item.category === "dress") ||
      (
        unique.some((item) => item.category === "top" || item.category === "outerwear") &&
        unique.some((item) => item.category === "bottom")
      );
    const hasShoes = unique.some((item) => item.category === "shoes");
    const completeness = (hasBody ? 70 : 35) + (hasShoes ? 30 : 0);

    if (!unique.length || looks.some((look) => look.items.map((item) => item.id).join("|") === unique.map((item) => item.id).join("|"))) {
      continue;
    }

    const names = unique.slice(0, 3).map((item) => item.name.toLowerCase());
    looks.push({
      id: `wardrobe-${intent.occasion.toLowerCase().replace(/\s+/g, "-")}-${index}`,
      title: index === 0 ? `${intent.occasion} from your wardrobe` : `${intent.mood} option ${index + 1}`,
      occasion: intent.occasion,
      explanation: names.length
        ? `Built around your ${names.join(", ")}.`
        : "Built from pieces you already own.",
      items: unique,
      completeness,
    });
  }

  return looks.sort((a, b) => b.completeness - a.completeness);
}

type GapTemplate = {
  id: string;
  name: string;
  category: WardrobeItem["category"];
  styles: string[];
  colours: string[];
};

const GAP_LIBRARY: GapTemplate[] = [
  { id: "cream-polo", name: "Cream knitted polo", category: "top", styles: ["Smart casual", "Minimal"], colours: ["Cream"] },
  { id: "black-boxy-tee", name: "Black boxy T-shirt", category: "top", styles: ["Streetwear", "Minimal", "Relaxed"], colours: ["Black"] },
  { id: "neutral-overshirt", name: "Neutral overshirt", category: "outerwear", styles: ["Smart casual", "Minimal"], colours: ["Cream", "Brown"] },
  { id: "black-trouser", name: "Black relaxed trousers", category: "bottom", styles: ["Minimal", "Smart casual"], colours: ["Black"] },
  { id: "blue-jeans", name: "Straight blue jeans", category: "bottom", styles: ["Relaxed", "Vintage"], colours: ["Blue"] },
  { id: "black-cargo", name: "Black relaxed cargos", category: "bottom", styles: ["Streetwear", "Sporty"], colours: ["Black"] },
  { id: "white-sneakers", name: "Clean white sneakers", category: "shoes", styles: ["Minimal", "Relaxed", "Streetwear"], colours: ["White"] },
  { id: "brown-loafers", name: "Brown loafers", category: "shoes", styles: ["Smart casual", "Preppy", "Formal"], colours: ["Brown"] },
  { id: "black-bag", name: "Black everyday crossbody bag", category: "bag", styles: ["Streetwear", "Minimal"], colours: ["Black"] },
  { id: "simple-watch", name: "Simple everyday watch", category: "accessory", styles: ["Smart casual", "Minimal"], colours: ["Brown", "Black"] },
];

export function recommendWardrobeGaps(
  items: WardrobeItem[],
  profile?: StyleProfile | null,
  intent?: StyleIntent | null,
  limit = 4
): WardrobeGapRecommendation[] {
  const categoryCounts = items.reduce<Record<string, number>>((counts, item) => {
    counts[item.category] = (counts[item.category] || 0) + 1;
    return counts;
  }, {});

  const ownedText = items.map((item) => `${item.name} ${item.colour}`.toLowerCase());

  return GAP_LIBRARY
    .filter((candidate) => !ownedText.some((owned) => owned.includes(candidate.name.toLowerCase())))
    .map((candidate) => {
      let score = 0;
      const count = categoryCounts[candidate.category] || 0;

      if (count === 0) score += 10;
      else if (count === 1) score += 5;

      profile?.styles.forEach((style) => {
        if (candidate.styles.includes(style)) score += 4;
      });

      profile?.colours.forEach((colour) => {
        if (candidate.colours.includes(colour)) score += 2;
      });

      intent?.styleHints.forEach((style) => {
        if (candidate.styles.includes(style)) score += 4;
      });

      intent?.colours.forEach((colour) => {
        if (candidate.colours.includes(colour)) score += 3;
      });

      const worksWith = items.filter((item) => item.category !== candidate.category).length;

      return {
        candidate,
        score,
        recommendation: {
          id: candidate.id,
          name: candidate.name,
          category: candidate.category,
          reason: count === 0
            ? `You do not have a ${candidate.category} like this yet, and it fits your saved style preferences.`
            : `This adds another ${candidate.styles[0].toLowerCase()} option to the pieces you already own.`,
          worksWith,
          priority: score >= 10 ? "High" as const : "Medium" as const,
        },
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ recommendation }) => recommendation);
}
