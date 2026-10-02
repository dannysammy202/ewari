import { OCCASIONS, STYLE_OPTIONS } from "@/lib/data";
import type { StyleIntent } from "@/lib/types";

export const STYLE_MOODS = [
  "Clean",
  "Relaxed",
  "Bold",
  "Minimal",
  "Smart",
  "Street",
  "Afrocentric",
] as const;

export const DRESS_LEVELS = ["Relaxed", "Balanced", "Dressy"] as const;

export function isStyleIntent(value: unknown): value is StyleIntent {
  if (!value || typeof value !== "object") return false;
  const intent = value as Partial<StyleIntent>;

  return (
    typeof intent.occasion === "string" &&
    typeof intent.mood === "string" &&
    Array.isArray(intent.colours) &&
    Array.isArray(intent.requiredItems) &&
    DRESS_LEVELS.includes(intent.dressLevel as (typeof DRESS_LEVELS)[number]) &&
    Array.isArray(intent.styleHints) &&
    Array.isArray(intent.avoid) &&
    typeof intent.stylingDirection === "string"
  );
}

export const GEMINI_STYLE_INTENT_SCHEMA = {
  type: "OBJECT",
  properties: {
    occasion: { type: "STRING", enum: OCCASIONS },
    mood: { type: "STRING", enum: STYLE_MOODS },
    colours: { type: "ARRAY", items: { type: "STRING" } },
    requiredItems: { type: "ARRAY", items: { type: "STRING" } },
    dressLevel: { type: "STRING", enum: DRESS_LEVELS },
    styleHints: {
      type: "ARRAY",
      items: { type: "STRING", enum: STYLE_OPTIONS },
    },
    avoid: { type: "ARRAY", items: { type: "STRING" } },
    stylingDirection: { type: "STRING" },
  },
  required: [
    "occasion",
    "mood",
    "colours",
    "requiredItems",
    "dressLevel",
    "styleHints",
    "avoid",
    "stylingDirection",
  ],
} as const;
