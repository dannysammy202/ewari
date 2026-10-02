import { STYLE_OPTIONS } from "@/lib/data";
import type { WardrobeAnalysis, WardrobeCategory } from "@/lib/wardrobe/types";

export const WARDROBE_CATEGORIES: WardrobeCategory[] = [
  "top",
  "outerwear",
  "bottom",
  "dress",
  "shoes",
  "bag",
  "accessory",
];

export const WARDROBE_ANALYSIS_SCHEMA = {
  type: "OBJECT",
  properties: {
    name: { type: "STRING" },
    category: { type: "STRING", enum: WARDROBE_CATEGORIES },
    colour: { type: "STRING" },
    fit: { type: "STRING" },
    material: { type: "STRING" },
    pattern: { type: "STRING" },
    styles: {
      type: "ARRAY",
      items: { type: "STRING", enum: STYLE_OPTIONS },
    },
    confidence: { type: "NUMBER" },
  },
  required: [
    "name",
    "category",
    "colour",
    "fit",
    "material",
    "pattern",
    "styles",
    "confidence",
  ],
} as const;

export function isWardrobeAnalysis(value: unknown): value is WardrobeAnalysis {
  if (!value || typeof value !== "object") return false;
  const analysis = value as Partial<WardrobeAnalysis>;

  return (
    typeof analysis.name === "string" &&
    typeof analysis.category === "string" &&
    WARDROBE_CATEGORIES.includes(analysis.category as WardrobeCategory) &&
    typeof analysis.colour === "string" &&
    typeof analysis.fit === "string" &&
    typeof analysis.material === "string" &&
    typeof analysis.pattern === "string" &&
    Array.isArray(analysis.styles) &&
    typeof analysis.confidence === "number"
  );
}
