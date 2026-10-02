"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { WardrobeItemCard } from "@/components/wardrobe-item-card";
import { STYLE_OPTIONS } from "@/lib/data";
import { WARDROBE_CATEGORIES } from "@/lib/ai/wardrobe-analysis-schema";
import { prepareWardrobeImage } from "@/lib/wardrobe/image";
import {
  addWardrobeItem,
  getWardrobeItems,
  removeWardrobeItem,
} from "@/lib/store";
import type {
  WardrobeAnalysis,
  WardrobeCategory,
  WardrobeItem,
} from "@/lib/wardrobe/types";

const emptyAnalysis: WardrobeAnalysis = {
  name: "New wardrobe item",
  category: "top",
  colour: "",
  fit: "Unknown",
  material: "Unknown",
  pattern: "Solid",
  styles: [],
  confidence: 0,
};

export default function WardrobePage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [imageDataUrl, setImageDataUrl] = useState("");
  const [analysis, setAnalysis] = useState<WardrobeAnalysis | null>(null);
  const [analysing, setAnalysing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setItems(getWardrobeItems());
  }, []);

  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setMessage("");
    setAnalysing(true);
    setAnalysis(null);

    try {
      const prepared = await prepareWardrobeImage(file);
      setImageDataUrl(prepared.dataUrl);

      const response = await fetch("/api/wardrobe/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base64: prepared.base64,
          mimeType: prepared.mimeType,
        }),
      });

      if (!response.ok) throw new Error("AI unavailable");

      const data = await response.json();
      setAnalysis(data.analysis || emptyAnalysis);
    } catch {
      setAnalysis(emptyAnalysis);
      setMessage("EWARI could not identify this item automatically. Review the details below and save it manually.");
    } finally {
      setAnalysing(false);
    }
  }

  function update<K extends keyof WardrobeAnalysis>(key: K, value: WardrobeAnalysis[K]) {
    setAnalysis((current) => current ? { ...current, [key]: value } : current);
  }

  function toggleStyle(style: string) {
    if (!analysis) return;
    const styles = analysis.styles.includes(style)
      ? analysis.styles.filter((value) => value !== style)
      : [...analysis.styles, style].slice(0, 3);
    update("styles", styles);
  }

  function saveItem() {
    if (!analysis || !imageDataUrl || !analysis.name.trim()) return;

    setSaving(true);
    setMessage("");

    try {
      const id = typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `wardrobe-${Date.now()}`;

      addWardrobeItem({
        id,
        name: analysis.name.trim(),
        category: analysis.category,
        colour: analysis.colour.trim() || "Unknown",
        fit: analysis.fit,
        material: analysis.material,
        pattern: analysis.pattern,
        styles: analysis.styles,
        imageDataUrl,
        addedAt: new Date().toISOString(),
      });

      setItems(getWardrobeItems());
      setAnalysis(null);
      setImageDataUrl("");
      setMessage("Added to your wardrobe.");
    } catch {
      setMessage("Your local wardrobe storage is full. Remove an older item before adding another.");
    } finally {
      setSaving(false);
    }
  }

  function removeItem(itemId: string) {
    removeWardrobeItem(itemId);
    setItems(getWardrobeItems());
  }

  return (
    <main className="app-page">
      <header className="topbar">
        <div>
          <p className="eyebrow">Clothes you already own</p>
          <h1 className="display">Wardrobe</h1>
        </div>
        <button className="add-button" onClick={() => inputRef.current?.click()}>Add item</button>
      </header>

      <input
        ref={inputRef}
        className="hidden-input"
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleUpload}
      />

      <section className="intro-card">
        <div>
          <p className="eyebrow">Make EWARI personal</p>
          <h2>Upload what you own.</h2>
          <p>EWARI uses these exact clothes when it builds looks for you. Clear product-style photos work best.</p>
        </div>
        <button className="primary-button" onClick={() => inputRef.current?.click()}>
          {items.length ? "Add another item" : "Add my first item"}
        </button>
      </section>

      {message && <p className="message">{message}</p>}

      {(analysing || analysis) && (
        <section className="review card">
          <div className="preview">
            {imageDataUrl && <img src={imageDataUrl} alt="Wardrobe upload preview" />}
            {analysing && <div className="analyse-state">EWARI is identifying this item…</div>}
          </div>

          {analysis && !analysing && (
            <div className="review-form">
              <div className="review-head">
                <div>
                  <p className="eyebrow">Check before saving</p>
                  <h3>Does this look right?</h3>
                </div>
                {analysis.confidence > 0 && <span>{Math.round(analysis.confidence * 100)}% match</span>}
              </div>

              <label>
                Item name
                <input className="field" value={analysis.name} onChange={(event) => update("name", event.target.value)} />
              </label>

              <div className="two-fields">
                <label>
                  Category
                  <select className="field" value={analysis.category} onChange={(event) => update("category", event.target.value as WardrobeCategory)}>
                    {WARDROBE_CATEGORIES.map((value) => <option key={value} value={value}>{value}</option>)}
                  </select>
                </label>
                <label>
                  Colour
                  <input className="field" value={analysis.colour} onChange={(event) => update("colour", event.target.value)} />
                </label>
              </div>

              <div className="two-fields">
                <label>
                  Fit
                  <select className="field" value={analysis.fit} onChange={(event) => update("fit", event.target.value)}>
                    {["Unknown", "Fitted", "Regular", "Relaxed", "Oversized", "Loose"].map((value) => <option key={value}>{value}</option>)}
                  </select>
                </label>
                <label>
                  Material
                  <input className="field" value={analysis.material} onChange={(event) => update("material", event.target.value)} />
                </label>
              </div>

              <div>
                <p className="field-label">Style tags</p>
                <div className="chip-row">
                  {STYLE_OPTIONS.map((style) => (
                    <button
                      key={style}
                      className={`chip ${analysis.styles.includes(style) ? "active" : ""}`}
                      onClick={() => toggleStyle(style)}
                      type="button"
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              <div className="review-actions">
                <button className="ghost-button" onClick={() => { setAnalysis(null); setImageDataUrl(""); }}>Cancel</button>
                <button className="primary-button" onClick={saveItem} disabled={saving}>{saving ? "Saving…" : "Save to wardrobe"}</button>
              </div>
            </div>
          )}
        </section>
      )}

      <section className="section">
        <div className="section-head">
          <div>
            <p className="eyebrow">Your collection</p>
            <h3>{items.length} {items.length === 1 ? "item" : "items"}</h3>
          </div>
        </div>

        {items.length ? (
          <div className="wardrobe-grid">
            {items.map((item) => <WardrobeItemCard key={item.id} item={item} onRemove={removeItem} />)}
          </div>
        ) : (
          <div className="empty-state">
            Your wardrobe is empty. Add a few tops, bottoms and shoes so EWARI has enough pieces to start styling.
          </div>
        )}
      </section>

      <BottomNav />

      <style jsx>{`
        .add-button {
          min-height: 42px;
          border: 0;
          border-radius: 999px;
          padding: 0 15px;
          background: #2a211d;
          color: #c7f24a;
          font-weight: 800;
        }
        .hidden-input { display: none; }
        .intro-card {
          display: grid;
          gap: 20px;
          padding: 22px;
          border-radius: 24px;
          background: #dfe7c5;
        }
        .intro-card h2 { margin: 0; font-size: 25px; letter-spacing: -.03em; }
        .intro-card p:last-child { margin: 8px 0 0; max-width: 580px; color: #5d6250; line-height: 1.5; font-size: 13px; }
        .intro-card button { width: 100%; }
        .message {
          margin: 14px 0 0;
          padding: 11px 13px;
          border-radius: 12px;
          background: #ede5da;
          color: #625a55;
          font-size: 11px;
          line-height: 1.4;
        }
        .review {
          display: grid;
          overflow: hidden;
          margin-top: 18px;
        }
        .preview {
          position: relative;
          min-height: 320px;
          background: #ede5da;
        }
        .preview img {
          width: 100%;
          height: 100%;
          max-height: 520px;
          object-fit: contain;
        }
        .analyse-state {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          padding: 20px;
          background: rgba(247,243,236,.78);
          font-size: 12px;
          font-weight: 750;
        }
        .review-form { padding: 20px; }
        .review-head {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 20px;
        }
        .review-head h3 { margin: 0; font-size: 20px; }
        .review-head > span {
          height: max-content;
          padding: 6px 8px;
          border-radius: 999px;
          background: #dfe7c5;
          font-size: 9px;
          font-weight: 800;
        }
        label, .field-label {
          display: block;
          margin: 0 0 7px;
          font-size: 11px;
          font-weight: 800;
        }
        label + label { margin-top: 14px; }
        .two-fields { display: grid; gap: 14px; margin-top: 14px; }
        .two-fields label { margin: 0; }
        .review-form > div + div:not(.review-head) { margin-top: 18px; }
        .review-actions { display: grid; grid-template-columns: 1fr 1.3fr; gap: 10px; }
        .wardrobe-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0,1fr));
          gap: 14px;
        }
        @media (min-width: 720px) {
          .intro-card { grid-template-columns: 1fr auto; align-items: center; padding: 28px; }
          .intro-card button { width: auto; }
          .review { grid-template-columns: .8fr 1.2fr; }
          .two-fields { grid-template-columns: repeat(2, minmax(0,1fr)); }
          .wardrobe-grid { grid-template-columns: repeat(4, minmax(0,1fr)); gap: 18px; }
        }
      `}</style>
    </main>
  );
}
