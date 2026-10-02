import { OUTFITS } from "@/lib/data";
import type { Outfit, StyleProfile } from "@/lib/types";

function budgetCeiling(label: string) {
  if (label.startsWith("Under")) return 20000;
  if (label.includes("20,000 to ₦50,000")) return 50000;
  if (label.includes("50,000 to ₦100,000")) return 100000;
  if (label.includes("100,000 to ₦200,000")) return 200000;
  return 999999;
}

export function recommendOutfits(
  profile?: Partial<StyleProfile>,
  source: Outfit[] = OUTFITS
) {
  if (!profile) return source;

  const score = (outfit: Outfit) => {
    let value = 0;
    value += outfit.style.filter((style) => profile.styles?.includes(style)).length * 5;
    if (profile.occasions?.includes(outfit.occasion)) value += 4;
    if (profile.budget && outfit.budgetMin <= budgetCeiling(profile.budget)) value += 2;
    return value;
  };

  return [...source].sort((a, b) => score(b) - score(a));
}
