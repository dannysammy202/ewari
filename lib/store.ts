import type { SavedLook, StyleProfile } from "@/lib/types";

const PROFILE_KEY = "ewari-style-profile";
const SAVED_KEY = "ewari-saved-looks";

export function saveProfile(profile: StyleProfile) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function getProfile(): StyleProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getSavedLooks(): SavedLook[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isSaved(sourceId: string) {
  return getSavedLooks().some((look) => look.sourceId === sourceId);
}

export function saveLook(look: SavedLook) {
  if (typeof window === "undefined") return;
  const current = getSavedLooks().filter((item) => item.sourceId !== look.sourceId);
  localStorage.setItem(SAVED_KEY, JSON.stringify([look, ...current]));
}

export function removeSavedLook(sourceId: string) {
  if (typeof window === "undefined") return;
  const current = getSavedLooks().filter((item) => item.sourceId !== sourceId);
  localStorage.setItem(SAVED_KEY, JSON.stringify(current));
}
