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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!items.length) {
        setImages({});
        setLoading(false);
        return;
      }

      setLoading(true);

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

        if (!response.ok) throw new Error("Image search failed");

        const data = await response.json();

        if (!cancelled) {
          setImages(data?.images || {});
          setBroken({});
        }
      } catch {
        if (!cancelled) setImages({});
      } finally {
        if (!cancelled) setLoading(false);
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

  return { getImage, markBroken, loading };
}
