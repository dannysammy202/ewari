import type { OutfitItem } from "@/lib/types";

export type OutfitImageSearchItem = Pick<OutfitItem, "id" | "name" | "category" | "colour">;

export type OutfitImage = {
  itemId: string;
  imageUrl: string;
  fullImageUrl?: string | null;
  title: string;
  creator: string;
  license: string;
  licenseUrl?: string | null;
  sourceUrl?: string | null;
  attribution?: string | null;
};

export type OpenverseResult = {
  id?: string;
  title?: string | null;
  thumbnail?: string | null;
  url?: string | null;
  creator?: string | null;
  license?: string | null;
  license_url?: string | null;
  foreign_landing_url?: string | null;
  attribution?: string | null;
  tags?: Array<{ name?: string | null }>;
  width?: number | null;
  height?: number | null;
};
