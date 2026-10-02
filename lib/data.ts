import type { Outfit, OutfitItem } from "@/lib/types";

export const STYLE_OPTIONS = [
  "Streetwear", "Minimal", "Smart casual", "Afrocentric", "Relaxed",
  "Vintage", "Sporty", "Preppy", "Formal", "Y2K"
];

export const FIT_OPTIONS = ["Fitted", "Regular", "Relaxed", "Oversized", "Loose"];

export const COLOUR_OPTIONS = [
  "Black", "White", "Grey", "Cream", "Brown", "Green",
  "Blue", "Red", "Pastels", "Earth tones", "Bright colours"
];

export const OCCASIONS = [
  "Church", "Work", "Date", "Wedding", "Dinner", "Party",
  "Casual outing", "Travel", "Concert", "Traditional event", "Interview", "Weekend"
];

export const FOOTWEAR = [
  "Sneakers", "Loafers", "Boots", "Slides", "Sandals", "Formal shoes", "Heels", "Flats"
];

export const ACCESSORIES = [
  "Watches", "Chains", "Bracelets", "Rings", "Caps", "Bags", "Sunglasses", "Earrings"
];

export const BUDGETS = [
  "Under ₦20,000",
  "₦20,000 to ₦50,000",
  "₦50,000 to ₦100,000",
  "₦100,000 to ₦200,000",
  "Above ₦200,000"
];

const item = (
  id: string,
  name: string,
  category: OutfitItem["category"],
  colour: string,
  visualColour: string,
  priceMin: number,
  priceMax: number,
  fit?: string,
  material?: string
): OutfitItem => ({ id, name, category, colour, visualColour, priceMin, priceMax, fit, material });

export const OUTFITS: Outfit[] = [
  {
    id: "sunday-ease",
    title: "Sunday Ease",
    occasion: "Church",
    style: ["Smart casual", "Relaxed", "Minimal"],
    mood: ["Clean", "Relaxed"],
    dressLevel: "Balanced",
    description: "Soft tailoring with a relaxed Sunday feel.",
    budgetMin: 45000,
    budgetMax: 70000,
    visual: { skin: "#6E4936", top: "#E8DDC7", bottom: "#6D5541", shoes: "#F5F3EE", accent: "#231F1B" },
    items: [
      item("cream-knit-polo", "Cream knitted polo", "top", "Cream", "#E8DDC7", 14000, 22000, "Relaxed", "Knit cotton"),
      item("brown-relaxed-trouser", "Brown relaxed trousers", "bottom", "Brown", "#6D5541", 16000, 25000, "Relaxed", "Cotton twill"),
      item("white-low-trainer", "White low-top trainers", "shoes", "White", "#F5F3EE", 18000, 30000),
      item("leather-watch", "Leather watch", "accessory", "Brown", "#2D211C", 7000, 13000)
    ],
    note: "Let the trousers fall slightly over the trainers. Keep the accessories quiet so the cream and brown remain the focus."
  },
  {
    id: "lagos-layer",
    title: "Lagos Layer",
    occasion: "Casual outing",
    style: ["Streetwear", "Afrocentric", "Relaxed"],
    mood: ["Street", "Bold"],
    dressLevel: "Relaxed",
    description: "A loose streetwear base with an Ankara-led statement.",
    budgetMin: 38000,
    budgetMax: 65000,
    visual: { skin: "#68432F", top: "#30302E", bottom: "#B96A4B", shoes: "#EEECE7", accent: "#171412" },
    items: [
      item("charcoal-hoodie", "Charcoal oversized hoodie", "top", "Charcoal", "#30302E", 12000, 20000, "Oversized", "Cotton fleece"),
      item("ankara-baggy", "Baggy Ankara trousers", "bottom", "Terracotta pattern", "#B96A4B", 14000, 24000, "Loose", "Cotton"),
      item("retro-white-trainer", "Retro white trainers", "shoes", "White", "#EEECE7", 18000, 30000),
      item("black-crossbody", "Black crossbody bag", "bag", "Black", "#171412", 7000, 12000)
    ],
    note: "Keep the hoodie plain so the patterned trousers carry the outfit. A compact black bag keeps the silhouette balanced."
  },
  {
    id: "after-six",
    title: "After Six",
    occasion: "Date",
    style: ["Minimal", "Smart casual"],
    mood: ["Clean", "Smart"],
    dressLevel: "Dressy",
    description: "Dark neutrals with a softer evening finish.",
    budgetMin: 52000,
    budgetMax: 90000,
    visual: { skin: "#8A5C44", top: "#171412", bottom: "#D7CDBF", shoes: "#2A211D", accent: "#B79A70" },
    items: [
      item("black-open-collar", "Black open-collar shirt", "top", "Black", "#171412", 14000, 22000, "Regular", "Viscose blend"),
      item("stone-wide-trouser", "Stone wide-leg trousers", "bottom", "Stone", "#D7CDBF", 18000, 28000, "Relaxed", "Twill"),
      item("black-loafers", "Black leather loafers", "shoes", "Black", "#2A211D", 22000, 38000),
      item("gold-watch", "Gold-tone watch", "accessory", "Gold", "#B79A70", 8000, 16000)
    ],
    note: "Keep the shirt untucked or lightly tucked at the front. The contrast between black and stone gives the outfit its shape."
  },
  {
    id: "gallery-day",
    title: "Gallery Day",
    occasion: "Weekend",
    style: ["Minimal", "Relaxed"],
    mood: ["Clean", "Relaxed"],
    dressLevel: "Relaxed",
    description: "A light neutral combination built for an easy day out.",
    budgetMin: 32000,
    budgetMax: 56000,
    visual: { skin: "#6B4533", top: "#F0ECE2", bottom: "#9C9A8A", shoes: "#FFFFFF", accent: "#31302B" },
    items: [
      item("ivory-box-tee", "Ivory boxy T-shirt", "top", "Ivory", "#F0ECE2", 8000, 14000, "Oversized", "Heavy cotton"),
      item("sage-wide-trouser", "Muted sage wide trousers", "bottom", "Sage", "#9C9A8A", 14000, 22000, "Loose", "Cotton"),
      item("plain-white-trainer", "Plain white trainers", "shoes", "White", "#FFFFFF", 17000, 28000),
      item("charcoal-tote", "Charcoal tote bag", "bag", "Charcoal", "#31302B", 5000, 9000)
    ],
    note: "Keep the T-shirt structured and the trousers loose. The clean proportions matter more than extra accessories."
  },
  {
    id: "office-soft",
    title: "Office Soft",
    occasion: "Work",
    style: ["Smart casual", "Minimal"],
    mood: ["Smart", "Clean"],
    dressLevel: "Balanced",
    description: "Workwear without the stiff corporate feel.",
    budgetMin: 55000,
    budgetMax: 88000,
    visual: { skin: "#79503A", top: "#E5DED2", bottom: "#33312E", shoes: "#4C3528", accent: "#7C6A58" },
    items: [
      item("sand-overshirt", "Sand structured overshirt", "top", "Sand", "#E5DED2", 17000, 26000, "Regular", "Cotton"),
      item("charcoal-tailored", "Charcoal tailored trousers", "bottom", "Charcoal", "#33312E", 19000, 30000, "Relaxed", "Twill"),
      item("brown-loafer", "Dark brown loafers", "shoes", "Brown", "#4C3528", 22000, 35000),
      item("brown-watch", "Minimal brown watch", "accessory", "Brown", "#7C6A58", 7000, 12000)
    ],
    note: "Keep the overshirt clean and structured. The relaxed trouser cut stops the look from feeling too formal."
  },
  {
    id: "owambe-calm",
    title: "Owambe Calm",
    occasion: "Wedding",
    style: ["Afrocentric", "Smart casual"],
    mood: ["Bold", "Clean"],
    dressLevel: "Dressy",
    description: "A modern event look with Nigerian texture at the centre.",
    budgetMin: 70000,
    budgetMax: 125000,
    visual: { skin: "#5F3C2C", top: "#345846", bottom: "#E5D8BE", shoes: "#332820", accent: "#C6A15B" },
    items: [
      item("forest-kaftan-top", "Forest textured short kaftan", "top", "Forest", "#345846", 28000, 48000, "Regular", "Woven cotton"),
      item("cream-tailored", "Cream tailored trousers", "bottom", "Cream", "#E5D8BE", 18000, 30000, "Regular", "Cotton blend"),
      item("dark-brown-loafers", "Dark brown loafers", "shoes", "Brown", "#332820", 22000, 36000),
      item("brass-watch", "Brass-tone watch", "accessory", "Brass", "#C6A15B", 9000, 17000)
    ],
    note: "Keep the trousers plain and let the textured top lead. Avoid adding another patterned piece."
  },
  {
    id: "terminal-fit",
    title: "Terminal Fit",
    occasion: "Travel",
    style: ["Streetwear", "Relaxed", "Sporty"],
    mood: ["Relaxed", "Street"],
    dressLevel: "Relaxed",
    description: "Loose layers designed around comfort and movement.",
    budgetMin: 42000,
    budgetMax: 76000,
    visual: { skin: "#744B36", top: "#B8B1A6", bottom: "#252523", shoes: "#EDEAE4", accent: "#4E514C" },
    items: [
      item("grey-sweatshirt", "Washed grey sweatshirt", "top", "Grey", "#B8B1A6", 13000, 22000, "Oversized", "Cotton fleece"),
      item("black-cargo", "Black relaxed cargos", "bottom", "Black", "#252523", 16000, 25000, "Loose", "Ripstop cotton"),
      item("runner-trainers", "Neutral running trainers", "shoes", "Off-white", "#EDEAE4", 21000, 36000),
      item("olive-sling", "Olive sling bag", "bag", "Olive", "#4E514C", 7000, 12000)
    ],
    note: "Keep the layers soft and the trouser hem clear of the floor. The sling bag keeps travel essentials close without adding bulk."
  },
  {
    id: "night-signal",
    title: "Night Signal",
    occasion: "Concert",
    style: ["Streetwear", "Y2K"],
    mood: ["Bold", "Street"],
    dressLevel: "Relaxed",
    description: "A dark concert base with one sharp colour hit.",
    budgetMin: 39000,
    budgetMax: 72000,
    visual: { skin: "#81553F", top: "#191918", bottom: "#4F4D4B", shoes: "#D9D6CF", accent: "#C7F24A" },
    items: [
      item("black-graphic-tee", "Black oversized graphic tee", "top", "Black", "#191918", 10000, 17000, "Oversized", "Cotton"),
      item("washed-baggy-denim", "Washed baggy denim", "bottom", "Washed black", "#4F4D4B", 17000, 28000, "Loose", "Denim"),
      item("chunky-neutral-trainer", "Chunky neutral trainers", "shoes", "Neutral", "#D9D6CF", 20000, 34000),
      item("lime-mini-bag", "Lime mini crossbody", "bag", "Lime", "#C7F24A", 6000, 11000)
    ],
    note: "Let the lime accessory do the colour work. Keep every other piece dark and loose."
  },
  {
    id: "dinner-line",
    title: "Dinner Line",
    occasion: "Dinner",
    style: ["Minimal", "Smart casual"],
    mood: ["Smart", "Clean"],
    dressLevel: "Dressy",
    description: "Simple evening tailoring with warm tonal contrast.",
    budgetMin: 60000,
    budgetMax: 98000,
    visual: { skin: "#704936", top: "#6C3F31", bottom: "#20201E", shoes: "#191816", accent: "#B19A7B" },
    items: [
      item("rust-knit-shirt", "Rust knitted shirt", "top", "Rust", "#6C3F31", 16000, 26000, "Regular", "Knit cotton"),
      item("black-pleated-trouser", "Black pleated trousers", "bottom", "Black", "#20201E", 19000, 30000, "Relaxed", "Twill"),
      item("black-minimal-loafer", "Black minimal loafers", "shoes", "Black", "#191816", 22000, 35000),
      item("taupe-watch", "Taupe leather watch", "accessory", "Taupe", "#B19A7B", 7000, 12000)
    ],
    note: "Keep the shirt fitted through the shoulder, then let the trousers open up through the leg."
  },
  {
    id: "native-motion",
    title: "Native Motion",
    occasion: "Traditional event",
    style: ["Afrocentric", "Relaxed"],
    mood: ["Bold", "Relaxed"],
    dressLevel: "Balanced",
    description: "A contemporary Nigerian look with a relaxed silhouette.",
    budgetMin: 58000,
    budgetMax: 105000,
    visual: { skin: "#65412F", top: "#D2A85D", bottom: "#2F4238", shoes: "#2A211D", accent: "#E8D8B7" },
    items: [
      item("ochre-native-top", "Ochre woven native top", "top", "Ochre", "#D2A85D", 22000, 38000, "Relaxed", "Woven cotton"),
      item("deep-green-trouser", "Deep green relaxed trousers", "bottom", "Deep green", "#2F4238", 18000, 28000, "Relaxed", "Cotton"),
      item("brown-leather-slide", "Dark leather slides", "shoes", "Brown", "#2A211D", 14000, 23000),
      item("cream-cap", "Cream textured cap", "accessory", "Cream", "#E8D8B7", 7000, 12000)
    ],
    note: "Keep the top untucked and the trouser line clean. Use one light accessory to break up the deeper colours."
  }
];

export const SWAPS: Record<OutfitItem["category"], OutfitItem[]> = {
  top: [
    item("swap-black-tee", "Black boxy T-shirt", "top", "Black", "#1D1C1A", 8000, 14000, "Oversized", "Cotton"),
    item("swap-cream-shirt", "Cream relaxed shirt", "top", "Cream", "#E9E0D0", 12000, 19000, "Relaxed", "Cotton"),
    item("swap-forest-polo", "Forest knitted polo", "top", "Forest", "#344B3D", 14000, 22000, "Regular", "Knit cotton")
  ],
  outerwear: [],
  bottom: [
    item("swap-black-cargo", "Black relaxed cargos", "bottom", "Black", "#292825", 15000, 25000, "Loose", "Cotton"),
    item("swap-stone-wide", "Stone wide-leg trousers", "bottom", "Stone", "#CFC5B6", 17000, 27000, "Relaxed", "Twill"),
    item("swap-dark-denim", "Dark baggy denim", "bottom", "Dark denim", "#44494B", 16000, 26000, "Loose", "Denim"),
    item("swap-ankara", "Baggy Ankara trousers", "bottom", "Terracotta pattern", "#B96A4B", 15000, 26000, "Loose", "Cotton")
  ],
  shoes: [
    item("swap-white-sneaker", "White low-top trainers", "shoes", "White", "#F6F4EF", 18000, 30000),
    item("swap-black-loafer", "Black loafers", "shoes", "Black", "#24211F", 22000, 36000),
    item("swap-brown-slide", "Brown leather slides", "shoes", "Brown", "#604332", 13000, 22000)
  ],
  bag: [
    item("swap-black-bag", "Black crossbody bag", "bag", "Black", "#1D1C1A", 7000, 12000),
    item("swap-tan-bag", "Tan shoulder bag", "bag", "Tan", "#A47C57", 8000, 14000)
  ],
  accessory: [
    item("swap-silver-watch", "Silver watch", "accessory", "Silver", "#A9AAA7", 7000, 14000),
    item("swap-black-cap", "Black cap", "accessory", "Black", "#1D1C1A", 5000, 9000)
  ]
};

export function getOutfit(id: string) {
  return OUTFITS.find((outfit) => outfit.id === id);
}
