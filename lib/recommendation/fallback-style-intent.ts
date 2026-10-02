import { COLOUR_OPTIONS, STYLE_OPTIONS } from "@/lib/data";
import { detectRequiredItems } from "@/lib/recommendation/item-matcher";
import type { StyleIntent } from "@/lib/types";

export function fallbackStyleIntent(occasion: string, mood: string, prompt: string): StyleIntent {
  const text = prompt.toLowerCase();
  const colours = COLOUR_OPTIONS.filter((colour) => text.includes(colour.toLowerCase()));
  const styleHints = STYLE_OPTIONS.filter((style) => text.includes(style.toLowerCase()));
  const requiredItems = detectRequiredItems(text);
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
