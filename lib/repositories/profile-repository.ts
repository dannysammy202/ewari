import { readLocalJson, writeLocalJson } from "@/lib/storage/local-json";
import type { StyleProfile } from "@/lib/types";

const PROFILE_KEY = "ewari-style-profile";

export function saveProfile(profile: StyleProfile) {
  writeLocalJson(PROFILE_KEY, profile);
}

export function getProfile(): StyleProfile | null {
  return readLocalJson<StyleProfile | null>(PROFILE_KEY, null);
}
