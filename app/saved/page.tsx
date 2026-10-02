"use client";

import { useEffect, useState } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { OutfitBoard } from "@/components/outfit-board";
import { Icon } from "@/components/icon";
import { formatNaira } from "@/lib/data";
import { getSavedLooks, removeSavedLook } from "@/lib/store";
import type { SavedLook } from "@/lib/types";
import Link from "next/link";

export default function SavedPage() {
  const [looks, setLooks] = useState<SavedLook[]>([]);

  useEffect(() => setLooks(getSavedLooks()), []);

  function remove(id: string) {
    removeSavedLook(id);
    setLooks(getSavedLooks());
  }

  return (
    <main className="app-page">
      <header className="topbar">
        <div>
          <p className="eyebrow">Your references</p>
          <h1 className="display">Saved looks</h1>
        </div>
      </header>

      {looks.length ? (
        <div className="saved-grid">
          {looks.map((look) => (
            <article key={look.sourceId} className="saved-card">
              <Link href={`/outfit/${look.sourceId}`} className="saved-visual">
                <OutfitBoard items={look.items} compact showLabels={false} />
              </Link>
              <div className="saved-copy">
                <div>
                  <p>{look.occasion}</p>
                  <h3>{look.title}</h3>
                  <span>{formatNaira(look.budgetMin)}–{formatNaira(look.budgetMax)}</span>
                </div>
                <button onClick={() => remove(look.sourceId)} aria-label="Remove saved look"><Icon name="trash" size={19} /></button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          Save a look you want to recreate and it will appear here.
        </div>
      )}

      <BottomNav />
      <style jsx>{`
        .saved-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
        .saved-card { min-width: 0; }
        .saved-visual {
          display: block;
          height: 330px;
          overflow: hidden;
          border-radius: 20px;
          background: #ede5da;
          border: 1px solid rgba(42,33,29,.09);
        }
        .saved-copy { display: flex; justify-content: space-between; gap: 10px; padding: 11px 2px; }
        .saved-copy p { margin: 0 0 4px; color: #766d67; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; }
        .saved-copy h3 { margin: 0; font-size: 15px; }
        .saved-copy span { display: block; margin-top: 5px; color: #766d67; font-size: 11px; }
        .saved-copy button { flex: 0 0 38px; width: 38px; height: 38px; display: grid; place-items: center; border: 1px solid rgba(42,33,29,.12); border-radius: 50%; background: transparent; }
        @media (min-width: 720px) { .saved-grid { grid-template-columns: repeat(3, 1fr); gap: 18px; } .saved-visual { height: 380px; } }
        @media (min-width: 980px) { .saved-grid { grid-template-columns: repeat(4, 1fr); } }
      `}</style>
    </main>
  );
}
