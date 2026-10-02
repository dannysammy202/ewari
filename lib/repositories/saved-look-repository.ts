import { readLocalJson, writeLocalJson } from "@/lib/storage/local-json";
import type { SavedLook } from "@/lib/types";

const SAVED_KEY = "ewari-saved-looks";

export function getSavedLooks(): SavedLook[] {
  return readLocalJson<SavedLook[]>(SAVED_KEY, []);
}

export function isSaved(sourceId: string) {
  return getSavedLooks().some((look) => look.sourceId === sourceId);
}

export function saveLook(look: SavedLook) {
  const current = getSavedLooks().filter((item) => item.sourceId !== look.sourceId);
  writeLocalJson(SAVED_KEY, [look, ...current]);
}

export function removeSavedLook(sourceId: string) {
  const current = getSavedLooks().filter((item) => item.sourceId !== sourceId);
  writeLocalJson(SAVED_KEY, current);
}
