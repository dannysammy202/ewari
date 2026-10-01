export type StyleProfile = {
  presentation: string;
  styles: string[];
  fits: string[];
  colours: string[];
  avoidedColours: string[];
  occasions: string[];
  footwear: string[];
  accessories: string[];
  budget: string;
};

export type OutfitItem = {
  id: string;
  name: string;
  category: "top" | "outerwear" | "bottom" | "shoes" | "bag" | "accessory";
  colour: string;
  fit?: string;
  material?: string;
  priceMin: number;
  priceMax: number;
  visualColour: string;
};

export type Outfit = {
  id: string;
  title: string;
  occasion: string;
  style: string[];
  mood: string[];
  dressLevel: "Relaxed" | "Balanced" | "Dressy";
  description: string;
  budgetMin: number;
  budgetMax: number;
  visual: {
    skin: string;
    top: string;
    bottom: string;
    shoes: string;
    accent: string;
  };
  items: OutfitItem[];
  note: string;
};

export type SavedLook = Outfit & {
  savedAt: string;
  sourceId: string;
};

export type StyleIntent = {
  occasion: string;
  mood: string;
  colours: string[];
  requiredItems: string[];
  dressLevel: "Relaxed" | "Balanced" | "Dressy";
  styleHints: string[];
  avoid: string[];
  stylingDirection: string;
};
