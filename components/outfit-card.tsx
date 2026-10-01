"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Outfit } from "@/lib/types";
import { Mannequin } from "@/components/mannequin";
import { Icon } from "@/components/icon";
import { formatNaira } from "@/lib/data";
import { isSaved, removeSavedLook, saveLook } from "@/lib/store";

export function OutfitCard({ outfit }: { outfit: Outfit }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => setSaved(isSaved(outfit.id)), [outfit.id]);

  function toggleSave() {
    if (saved) {
      removeSavedLook(outfit.id);
      setSaved(false);
      return;
    }

    saveLook({
      ...outfit,
      sourceId: outfit.id,
      savedAt: new Date().toISOString()
    });
    setSaved(true);
  }

  return (
    <article className="outfit-card">
      <div className="visual">
        <Link href={`/outfit/${outfit.id}`} aria-label={`Open ${outfit.title}`}>
          <Mannequin palette={outfit.visual} />
        </Link>
        <button className={`save ${saved ? "saved" : ""}`} onClick={toggleSave} aria-label="Save look">
          <Icon name={saved ? "bookmark-2" : "bookmark"} active={saved} size={19} />
        </button>
      </div>
      <Link href={`/outfit/${outfit.id}`} className="copy">
        <p className="occasion">{outfit.occasion}</p>
        <h3>{outfit.title}</h3>
        <p className="price">{formatNaira(outfit.budgetMin)}–{formatNaira(outfit.budgetMax)}</p>
      </Link>
      <style jsx>{`
        .outfit-card { min-width: 0; }
        .visual {
          position: relative;
          height: 250px;
          overflow: hidden;
          border-radius: 20px;
          background: #ede5da;
          border: 1px solid rgba(42,33,29,.09);
        }
        .visual :global(a) { display: block; height: 100%; }
        .save {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border: 0;
          border-radius: 50%;
          background: rgba(255,253,249,.88);
          color: #171412;
          backdrop-filter: blur(8px);
        }
        .save.saved { background: #2a211d; color: #c7f24a; }
        .copy { display: block; padding: 11px 2px 4px; }
        .occasion {
          margin: 0 0 4px;
          color: #766d67;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .08em;
        }
        h3 { margin: 0; font-size: 16px; letter-spacing: -.025em; }
        .price { margin: 5px 0 0; color: #766d67; font-size: 12px; }
        @media (min-width: 720px) {
          .visual { height: 300px; }
        }
      `}</style>
    </article>
  );
}
