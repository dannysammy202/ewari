import type { OutfitImageSearchItem } from "@/lib/outfit-images/types";

function subjectFor(item: OutfitImageSearchItem) {
  const name = item.name.toLowerCase();

  if (item.category === "top" || item.category === "outerwear") {
    if (name.includes("hoodie")) return "hoodie";
    if (name.includes("sweatshirt")) return "sweatshirt";
    if (name.includes("polo")) return "polo shirt";
    if (name.includes("kaftan")) return "kaftan";
    if (name.includes("overshirt")) return "overshirt";
    if (name.includes("t-shirt") || name.includes("tee")) return "t-shirt";
    return "shirt";
  }

  if (item.category === "bottom") {
    if (name.includes("ankara")) return "ankara trousers";
    if (name.includes("cargo")) return "cargo pants";
    if (name.includes("denim") || name.includes("jean")) return "jeans";
    return "trousers";
  }

  if (item.category === "shoes") {
    if (name.includes("loafer")) return "loafers";
    if (name.includes("slide")) return "slides";
    if (name.includes("sandal")) return "sandals";
    if (name.includes("boot")) return "boots";
    return "sneakers";
  }

  if (item.category === "bag") {
    if (name.includes("crossbody")) return "crossbody bag";
    if (name.includes("tote")) return "tote bag";
    if (name.includes("sling")) return "sling bag";
    return "bag";
  }

  if (name.includes("watch")) return "watch";
  if (name.includes("cap")) return "cap";
  if (name.includes("sunglass")) return "sunglasses";
  if (name.includes("bracelet")) return "bracelet";
  if (name.includes("chain")) return "chain";
  if (name.includes("ring")) return "ring";

  return "fashion accessory";
}

export function buildOutfitImageQueries(item: OutfitImageSearchItem) {
  const subject = subjectFor(item);
  const colour = item.colour
    .replace(/pattern/gi, "")
    .replace(/washed/gi, "")
    .trim();

  const queries = [
    `${colour} ${subject}`,
    subject,
    item.name,
  ];

  return [...new Set(queries.map((query) => query.trim()).filter(Boolean))];
}
