export type OutfitPhoto = {
  imageUrl: string;
  sourceUrl: string;
  sourceName: string;
  objectPosition?: string;
};

const pexels = (id: string) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1200`;

export const OUTFIT_PHOTOS: Record<string, OutfitPhoto> = {
  "sunday-ease": {
    imageUrl: pexels("9537209"),
    sourceUrl: "https://www.pexels.com/photo/a-man-posing-in-a-smart-casual-outfit-9537209/",
    sourceName: "Pexels",
    objectPosition: "50% 36%",
  },
  "lagos-layer": {
    imageUrl: pexels("15360023"),
    sourceUrl: "https://www.pexels.com/photo/man-in-black-hoodie-15360023/",
    sourceName: "Pexels",
    objectPosition: "50% 34%",
  },
  "after-six": {
    imageUrl: pexels("19864718"),
    sourceUrl: "https://www.pexels.com/photo/man-wearing-black-outfit-on-a-street-19864718/",
    sourceName: "Pexels",
    objectPosition: "50% 32%",
  },
  "gallery-day": {
    imageUrl: pexels("36510878"),
    sourceUrl: "https://www.pexels.com/photo/urban-casual-fashion-street-style-portrait-36510878/",
    sourceName: "Pexels",
    objectPosition: "50% 42%",
  },
  "office-soft": {
    imageUrl: pexels("30678211"),
    sourceUrl: "https://www.pexels.com/photo/professional-man-working-on-laptop-in-lagos-office-30678211/",
    sourceName: "Pexels",
    objectPosition: "48% 45%",
  },
  "owambe-calm": {
    imageUrl: pexels("21852751"),
    sourceUrl: "https://www.pexels.com/photo/a-man-in-traditional-clothing-21852751/",
    sourceName: "Pexels",
    objectPosition: "50% 30%",
  },
  "terminal-fit": {
    imageUrl: pexels("14296965"),
    sourceUrl: "https://www.pexels.com/photo/casual-style-man-14296965/",
    sourceName: "Pexels",
    objectPosition: "50% 36%",
  },
  "night-signal": {
    imageUrl: pexels("19112108"),
    sourceUrl: "https://www.pexels.com/photo/man-in-black-clothes-19112108/",
    sourceName: "Pexels",
    objectPosition: "50% 34%",
  },
  "dinner-line": {
    imageUrl: pexels("20752498"),
    sourceUrl: "https://www.pexels.com/photo/man-in-dinner-jacket-and-white-shirt-20752498/",
    sourceName: "Pexels",
    objectPosition: "50% 28%",
  },
  "native-motion": {
    imageUrl: pexels("36673298"),
    sourceUrl: "https://www.pexels.com/photo/stylish-african-man-in-traditional-nigerian-attire-36673298/",
    sourceName: "Pexels",
    objectPosition: "50% 28%",
  },
};

export function getOutfitPhoto(outfitId: string) {
  return OUTFIT_PHOTOS[outfitId];
}
