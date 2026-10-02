import type { StyleIntent, StyleProfile } from "@/lib/types";

export type WardrobeCategory =
  | "top"
  | "outerwear"
  | "bottom"
  | "dress"
  | "shoes"
  | "bag"
  | "accessory";

export type WardrobeItem = {
  id: string;
  name: string;
  category: WardrobeCategory;
  colour: string;
  fit?: string;
  material?: string;
  pattern?: string;
  styles: string[];
  imageDataUrl: string;
  addedAt: string;
};

export type WardrobeAnalysis = {
  name: string;
  category: WardrobeCategory;
  colour: string;
  fit: string;
  material: string;
  pattern: string;
  styles: string[];
  confidence: number;
};

export type WardrobeLook = {
  id: string;
  title: string;
  occasion: string;
  explanation: string;
  items: WardrobeItem[];
  completeness: number;
};

export type WardrobeGapRecommendation = {
  id: string;
  name: string;
  category: WardrobeCategory;
  reason: string;
  worksWith: number;
  priority: "High" | "Medium";
};

export type WardrobeContext = {
  intent: StyleIntent;
  profile?: StyleProfile | null;
  items: WardrobeItem[];
};


export type SavedWardrobeLook = {
  id: string;
  title: string;
  occasion: string;
  explanation: string;
  completeness: number;
  itemIds: string[];
  savedAt: string;
};
