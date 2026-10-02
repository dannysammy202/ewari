"use client";

import { useEffect, useMemo, useState } from "react";
import type { OutfitImage } from "@/lib/outfit-images/types";
import type { OutfitItem } from "@/lib/types";

export function useOutfitImages(items: OutfitItem[]) {
  const requestKey = useMemo(
    () => items.map((item) => item.id).join("|"),
    [items]
  );

  const [images, setImages] = useState<Record<string, OutfitImage>>({});
  const [broken, setBroken] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!items.length) {
        setImages({});
        return;
      }

      try {
        const response = await fetch("/api/outfit-images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: items.map(({ id, name, category, colour }) => ({
              id,
              name,
              category,
              colour,
            })),
          }),
        });

        if (!response.ok) return;

        const data = await response.json();

        if (!cancelled) {
          setImages(data?.images || {});
          setBroken({});
        }
      } catch {
        if (!cancelled) setImages({});
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [requestKey]);

  function markBroken(itemId: string) {
    setBroken((current) => ({ ...current, [itemId]: true }));
  }

  function getImage(itemId: string) {
    return broken[itemId] ? undefined : images[itemId];
  }

  return { getImage, markBroken };
}
