import { OUTFITS } from "@/lib/data";
import { termMatchesOutfit } from "@/lib/recommendation/item-matcher";
import type { Outfit, StyleIntent, StyleProfile } from "@/lib/types";

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
