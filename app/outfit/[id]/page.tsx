"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Icon } from "@/components/icon";
import { Mannequin } from "@/components/mannequin";
import { SWAPS, formatNaira, getOutfit } from "@/lib/data";
import { saveLook } from "@/lib/store";
import type { OutfitItem } from "@/lib/types";

export default function OutfitDetailPage() {
  const params = useParams<{ id: string }>();
  const outfit = getOutfit(params.id);
  const [items, setItems] = useState<OutfitItem[]>(outfit?.items || []);
  const [swapCategory, setSwapCategory] = useState<OutfitItem["category"] | null>(null);
  const [saved, setSaved] = useState(false);

  const visual = useMemo(() => {
    if (!outfit) return null;
    const top = items.find((item) => item.category === "top")?.visualColour || outfit.visual.top;
    const bottom = items.find((item) => item.category === "bottom")?.visualColour || outfit.visual.bottom;
    const shoes = items.find((item) => item.category === "shoes")?.visualColour || outfit.visual.shoes;
    const accent = items.find((item) => item.category === "bag" || item.category === "accessory")?.visualColour || outfit.visual.accent;
    return { ...outfit.visual, top, bottom, shoes, accent };
  }, [items, outfit]);

  if (!outfit || !visual) {
    return <main className="app-page narrow"><div className="empty-state">This look is unavailable.</div></main>;
  }

  const min = items.reduce((total, current) => total + current.priceMin, 0);
  const max = items.reduce((total, current) => total + current.priceMax, 0);

  function swapItem(next: OutfitItem) {
    setItems((current) => {
      const index = current.findIndex((entry) => entry.category === next.category);
      if (index === -1) return [...current, next];
      const clone = [...current];
      clone[index] = next;
      return clone;
    });
    setSwapCategory(null);
    setSaved(false);
  }

  function saveCurrent() {
    saveLook({
      ...outfit,
      items,
      visual,
      budgetMin: min,
      budgetMax: max,
      sourceId: outfit.id,
      savedAt: new Date().toISOString()
    });
    setSaved(true);
  }

  return (
    <main className="detail-page">
      <section className="detail-visual">
        <div className="detail-actions">
          <Link href="/home" className="round" aria-label="Go back"><Icon name="arrow-left-2" size={21} /></Link>
          <button className={`round ${saved ? "saved" : ""}`} onClick={saveCurrent} aria-label="Save look"><Icon name="bookmark" active={saved} size={21} /></button>
        </div>
        <Mannequin palette={visual} />
      </section>

      <section className="detail-copy">
        <p className="eyebrow">{outfit.occasion}</p>
        <h1 className="display">{outfit.title}</h1>
        <p className="description">{outfit.description}</p>
        <div className="tags">{outfit.style.map((tag) => <span key={tag}>{tag}</span>)}</div>

        <div className="budget">
          <span>Estimated recreation budget</span>
          <strong>{formatNaira(min)}–{formatNaira(max)}</strong>
        </div>

        <section className="breakdown">
          <div className="section-head"><h3>Build the look</h3><span className="small muted">Tap swap to change one piece</span></div>
          {items.map((entry) => (
            <div className="item-row" key={entry.id}>
              <span className="swatch" style={{ background: entry.visualColour }} />
              <div className="item-copy">
                <small>{entry.category}</small>
                <strong>{entry.name}</strong>
                <span>{entry.colour}{entry.fit ? ` · ${entry.fit}` : ""}</span>
              </div>
              {SWAPS[entry.category].length ? <button onClick={() => setSwapCategory(entry.category)}>Swap</button> : null}
            </div>
          ))}
        </section>

        <section className="note">
          <p className="eyebrow">Styling note</p>
          <p>{outfit.note}</p>
        </section>

        <button className="primary-button save-main" onClick={saveCurrent}>{saved ? "Saved" : "Save look"}</button>
      </section>

      {swapCategory && (
        <div className="sheet-backdrop" onClick={() => setSwapCategory(null)}>
          <section className="swap-sheet" onClick={(event) => event.stopPropagation()}>
            <div className="sheet-handle" />
            <div className="section-head">
              <div><p className="eyebrow">Replace one piece</p><h3>Choose a {swapCategory}</h3></div>
              <button className="icon-button" onClick={() => setSwapCategory(null)}><Icon name="close-circle" size={20} /></button>
            </div>
            <div className="swap-list">
              {SWAPS[swapCategory].map((option) => (
                <button key={option.id} className="swap-option" onClick={() => swapItem(option)}>
                  <span className="swatch large" style={{ background: option.visualColour }} />
                  <span><strong>{option.name}</strong><small>{option.colour} · {formatNaira(option.priceMin)}–{formatNaira(option.priceMax)}</small></span>
                  <Icon name="arrow-right-3" size={19} />
                </button>
              ))}
            </div>
          </section>
        </div>
      )}

      <style jsx>{`
        .detail-page { width: min(100%, 1100px); margin: 0 auto; min-height: 100vh; }
        .detail-visual { position: relative; height: 56vh; min-height: 430px; background: #ede5da; }
        .detail-actions { position: absolute; top: 18px; left: 18px; right: 18px; z-index: 5; display: flex; justify-content: space-between; }
        .round { width: 44px; height: 44px; display: grid; place-items: center; border: 1px solid rgba(42,33,29,.1); border-radius: 50%; background: rgba(255,253,249,.9); color: #171412; }
        button.round { padding: 0; }
        .round.saved { background: #2a211d; color: #c7f24a; }
        .detail-copy { padding: 28px 20px 52px; }
        .description { max-width: 520px; color: #766d67; line-height: 1.55; }
        .tags { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 16px; }
        .tags span { padding: 7px 10px; border: 1px solid rgba(42,33,29,.12); border-radius: 999px; font-size: 11px; font-weight: 700; }
        .budget { display: flex; align-items: end; justify-content: space-between; gap: 20px; margin: 30px 0; padding: 18px 0; border-block: 1px solid rgba(42,33,29,.1); }
        .budget span { color: #766d67; font-size: 12px; }
        .budget strong { text-align: right; }
        .breakdown { margin-top: 30px; }
        .item-row { display: grid; grid-template-columns: 42px 1fr auto; align-items: center; gap: 12px; padding: 14px 0; border-bottom: 1px solid rgba(42,33,29,.09); }
        .swatch { width: 40px; height: 40px; border-radius: 12px; border: 1px solid rgba(42,33,29,.12); }
        .swatch.large { width: 48px; height: 48px; }
        .item-copy { min-width: 0; }
        .item-copy small { display: block; margin-bottom: 2px; color: #766d67; font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; }
        .item-copy strong { display: block; font-size: 13px; }
        .item-copy span { display: block; margin-top: 3px; color: #766d67; font-size: 11px; }
        .item-row > button { border: 0; background: #ede5da; border-radius: 999px; padding: 8px 11px; font-size: 11px; font-weight: 800; }
        .note { margin-top: 30px; padding: 20px; border-radius: 18px; background: #e8d6cf; }
        .note p:last-child { margin-bottom: 0; line-height: 1.55; }
        .save-main { width: 100%; margin-top: 28px; }
        .sheet-backdrop { position: fixed; inset: 0; z-index: 60; display: flex; align-items: end; justify-content: center; background: rgba(23,20,18,.44); }
        .swap-sheet { width: min(100%, 620px); max-height: 80vh; overflow-y: auto; padding: 10px 18px 28px; border-radius: 26px 26px 0 0; background: #f7f3ec; }
        .sheet-handle { width: 44px; height: 4px; margin: 0 auto 19px; border-radius: 99px; background: rgba(42,33,29,.18); }
        .swap-option { width: 100%; display: grid; grid-template-columns: 50px 1fr 20px; align-items: center; gap: 12px; padding: 12px 0; border: 0; border-bottom: 1px solid rgba(42,33,29,.09); background: transparent; text-align: left; }
        .swap-option strong, .swap-option small { display: block; }
        .swap-option small { margin-top: 4px; color: #766d67; }
        @media (min-width: 800px) {
          .detail-page { display: grid; grid-template-columns: 1fr 1fr; align-items: start; padding: 26px; gap: 30px; }
          .detail-visual { position: sticky; top: 26px; height: calc(100vh - 52px); border-radius: 28px; overflow: hidden; }
          .detail-copy { padding: 32px 10px 70px; }
        }
      `}</style>
    </main>
  );
}
