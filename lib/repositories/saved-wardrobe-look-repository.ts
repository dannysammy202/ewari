import { readLocalJson, writeLocalJson } from "@/lib/storage/local-json";
import type { SavedWardrobeLook, WardrobeLook } from "@/lib/wardrobe/types";

const KEY = "ewari-saved-wardrobe-looks";

export function getSavedWardrobeLooks(): SavedWardrobeLook[] {
  return readLocalJson<SavedWardrobeLook[]>(KEY, []);
}

export function isWardrobeLookSaved(id: string) {
  return getSavedWardrobeLooks().some((look) => look.id === id);
}

export function saveWardrobeLook(look: WardrobeLook) {
  const current = getSavedWardrobeLooks();
  const saved: SavedWardrobeLook = {
    id: look.id,
    title: look.title,
    occasion: look.occasion,
    explanation: look.explanation,
    completeness: look.completeness,
    itemIds: look.items.map((item) => item.id),
    savedAt: new Date().toISOString(),
  };

  writeLocalJson(KEY, [saved, ...current.filter((item) => item.id !== look.id)].slice(0, 30));
}

export function removeSavedWardrobeLook(id: string) {
  writeLocalJson(KEY, getSavedWardrobeLooks().filter((look) => look.id !== id));
}
