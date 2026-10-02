"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import { Icon } from "@/components/icon";
import { OutfitPhoto } from "@/components/outfit-photo";
import { OUTFITS, getOutfit } from "@/lib/data";
import { formatNaira } from "@/lib/currency";
import { saveLook } from "@/lib/store";

export default function OutfitDetailPage() {
  const params = useParams<{ id: string }>();
  const outfit = getOutfit(params.id);
  const [saved, setSaved] = useState(false);

  if (!outfit) {
    return <main className="app-page narrow"><div className="empty-state">This look is unavailable.</div></main>;
  }

  const currentOutfit = outfit;
  const alternatives = OUTFITS.filter(
    (candidate) => candidate.id !== currentOutfit.id && candidate.occasion === currentOutfit.occasion
  );

  function saveCurrent() {
    saveLook({
      ...currentOutfit,
      sourceId: currentOutfit.id,
      savedAt: new Date().toISOString()
    });
    setSaved(true);
  }

  return (
    <main className="detail-page">
      <section className="detail-visual">
        <div className="detail-actions">
          <Link href="/home" className="round" aria-label="Go back"><Icon name="arrow-left-2" size={21} /></Link>
          <button className={`round ${saved ? "saved" : ""}`} onClick={saveCurrent} aria-label="Save look">
            <Icon name="bookmark" active={saved} size={21} />
          </button>
        </div>
        <OutfitPhoto outfitId={outfit.id} title={outfit.title} priority showCredit />
      </section>

      <section className="detail-copy">
        <p className="eyebrow">{outfit.occasion}</p>
        <h1 className="display">{outfit.title}</h1>
        <p className="description">{outfit.description}</p>
        <div className="tags">{outfit.style.map((tag) => <span key={tag}>{tag}</span>)}</div>

        <div className="budget">
          <span>Estimated recreation budget</span>
          <strong>{formatNaira(outfit.budgetMin)}–{formatNaira(outfit.budgetMax)}</strong>
        </div>

        <section className="breakdown">
          <div className="section-head">
            <div>
              <p className="eyebrow">What to look for</p>
              <h3>Recreate the direction</h3>
            </div>
          </div>

          {outfit.items.map((entry) => (
            <div className="item-row" key={entry.id}>
              <span className="swatch" style={{ background: entry.visualColour }} />
              <div className="item-copy">
                <small>{entry.category}</small>
                <strong>{entry.name}</strong>
                <span>{entry.colour}{entry.fit ? ` · ${entry.fit}` : ""}</span>
              </div>
              <span className="range">{formatNaira(entry.priceMin)}–{formatNaira(entry.priceMax)}</span>
            </div>
          ))}
        </section>

        <section className="note">
          <p className="eyebrow">Styling note</p>
          <p>{outfit.note}</p>
        </section>

        <div className="actions-row">
          <button className="primary-button save-main" onClick={saveCurrent}>{saved ? "Saved" : "Save look"}</button>
          <Link
            className="ghost-button alternate"
            href={alternatives[0] ? `/outfit/${alternatives[0].id}` : `/explore?occasion=${encodeURIComponent(outfit.occasion)}`}
          >
            Another {outfit.occasion.toLowerCase()} look
          </Link>
        </div>
      </section>

      <style jsx>{`
        .detail-page { width: min(100%, 1100px); margin: 0 auto; min-height: 100vh; }
        .detail-visual { position: relative; min-height: 690px; background: #ede5da; overflow: hidden; }
        .detail-actions {
          position: absolute;
          top: 18px;
          left: 18px;
          right: 18px;
          z-index: 5;
          display: flex;
          justify-content: space-between;
        }
        .round {
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(42,33,29,.1);
          border-radius: 50%;
          background: rgba(255,253,249,.92);
          color: #171412;
        }
        button.round { padding: 0; }
        .round.saved { background: #2a211d; color: #c7f24a; }
        .detail-copy { padding: 28px 20px 52px; }
        .description { max-width: 520px; color: #766d67; line-height: 1.55; }
        .tags { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 16px; }
        .tags span {
          padding: 7px 10px;
          border: 1px solid rgba(42,33,29,.12);
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
        }
        .budget {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 20px;
          margin: 30px 0;
          padding: 18px 0;
          border-block: 1px solid rgba(42,33,29,.1);
        }
        .budget span { color: #766d67; font-size: 12px; }
        .budget strong { text-align: right; }
        .breakdown { margin-top: 30px; }
        .item-row {
          display: grid;
          grid-template-columns: 42px 1fr auto;
          align-items: center;
          gap: 12px;
          padding: 14px 0;
          border-bottom: 1px solid rgba(42,33,29,.09);
        }
        .swatch {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          border: 1px solid rgba(42,33,29,.12);
        }
        .item-copy { min-width: 0; }
        .item-copy small {
          display: block;
          margin-bottom: 2px;
          color: #766d67;
          font-size: 9px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: .08em;
        }
        .item-copy strong { display: block; font-size: 13px; }
        .item-copy span { display: block; margin-top: 3px; color: #766d67; font-size: 11px; }
        .range { color: #766d67; font-size: 10px; text-align: right; }
        .note { margin-top: 30px; padding: 20px; border-radius: 18px; background: #e8d6cf; }
        .note p:last-child { margin-bottom: 0; line-height: 1.55; }
        .actions-row { display: grid; gap: 10px; margin-top: 28px; }
        .save-main, .alternate { width: 100%; }
        .alternate { display: grid; place-items: center; }

        @media (min-width: 800px) {
          .detail-page {
            display: grid;
            grid-template-columns: 1fr 1fr;
            align-items: start;
            padding: 26px;
            gap: 30px;
          }
          .detail-visual {
            position: sticky;
            top: 26px;
            height: calc(100vh - 52px);
            min-height: 690px;
            border-radius: 28px;
            overflow: hidden;
          }
          .detail-copy { padding: 32px 10px 70px; }
          .actions-row { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </main>
  );
}
