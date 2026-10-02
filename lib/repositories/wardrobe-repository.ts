import { readLocalJson, writeLocalJson } from "@/lib/storage/local-json";
import type { WardrobeItem } from "@/lib/wardrobe/types";

const WARDROBE_KEY = "ewari-wardrobe";
const MAX_ITEMS = 24;

export function getWardrobeItems(): WardrobeItem[] {
  return readLocalJson<WardrobeItem[]>(WARDROBE_KEY, []);
}

export function saveWardrobeItems(items: WardrobeItem[]) {
  writeLocalJson(WARDROBE_KEY, items.slice(0, MAX_ITEMS));
}

export function addWardrobeItem(item: WardrobeItem) {
  const current = getWardrobeItems();

  if (current.length >= MAX_ITEMS) {
    throw new Error("Wardrobe limit reached");
  }

  saveWardrobeItems([item, ...current.filter((entry) => entry.id !== item.id)]);
}

export function removeWardrobeItem(itemId: string) {
  saveWardrobeItems(getWardrobeItems().filter((item) => item.id !== itemId));
}

export function updateWardrobeItem(item: WardrobeItem) {
  saveWardrobeItems(
    getWardrobeItems().map((entry) => entry.id === item.id ? item : entry)
  );
}

export function wardrobeItemCount() {
  return getWardrobeItems().length;
}
