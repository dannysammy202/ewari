"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "@/components/app-header";
import { BottomNav } from "@/components/bottom-nav";
import { PageSkeleton } from "@/components/page-skeleton";
import { WardrobeLookCard } from "@/components/wardrobe-look-card";
import { useHydrated } from "@/hooks/use-hydrated";
import {
  getSavedWardrobeLooks,
  getWardrobeItems,
} from "@/lib/store";
import type {
  SavedWardrobeLook,
  WardrobeItem,
  WardrobeLook,
} from "@/lib/wardrobe/types";

export default function SavedPage() {
  const hydrated = useHydrated();
  const [saved, setSaved] = useState<SavedWardrobeLook[]>([]);
  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>([]);

  function reload() {
    setSaved(getSavedWardrobeLooks());
    setWardrobe(getWardrobeItems());
  }

  useEffect(() => {
    if (!hydrated) return;
    reload();
  }, [hydrated]);

  const looks = useMemo(() => {
    const itemMap = new Map(wardrobe.map((item) => [item.id, item]));

    return saved
      .map<WardrobeLook | null>((entry) => {
        const items = entry.itemIds
          .map((id) => itemMap.get(id))
          .filter((item): item is WardrobeItem => Boolean(item));

        if (!items.length) return null;

        return {
          id: entry.id,
          title: entry.title,
          occasion: entry.occasion,
          explanation: entry.explanation,
          completeness: entry.completeness,
          items,
        };
      })
      .filter((look): look is WardrobeLook => Boolean(look));
  }, [saved, wardrobe]);

  return (
    <main className="app-page">
      <AppHeader eyebrow="Outfits you want to keep" title="Saved" backHref="/home" />

      {!hydrated ? (
        <PageSkeleton rows={3} />
      ) : looks.length ? (
        <div className="saved-grid">
          {looks.map((look) => (
            <WardrobeLookCard
              key={look.id}
              look={look}
              removable
              onRemoved={reload}
            />
          ))}
        </div>
      ) : (
        <section className="saved-empty">
          <p className="eyebrow">Nothing saved yet</p>
          <h2>Keep the looks that work.</h2>
          <p>Build an outfit from your wardrobe in Style Me, then save it here for later.</p>
          <Link href="/style-me" className="primary-button">Style my wardrobe</Link>
        </section>
      )}

      <BottomNav />

      <style jsx>{`
        .saved-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
        }
        .saved-empty {
          padding: 28px;
          border-radius: 22px;
          background: #ede5da;
        }
        .saved-empty h2 {
          margin: 0;
          font-size: 26px;
          line-height: 1.08;
          letter-spacing: -.03em;
        }
        .saved-empty p:not(.eyebrow) {
          max-width: 500px;
          margin: 12px 0 20px;
          color: #766d67;
          font-size: 12px;
          line-height: 1.55;
        }
        @media (min-width: 680px) {
          .saved-grid { grid-template-columns: repeat(2, minmax(0,1fr)); gap: 18px; }
        }
        @media (min-width: 980px) {
          .saved-grid { grid-template-columns: repeat(3, minmax(0,1fr)); }
        }
      `}</style>
    </main>
  );
}
