"use client";

import Link from "next/link";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { AppHeader } from "@/components/app-header";
import { BottomNav } from "@/components/bottom-nav";
import { PageSkeleton } from "@/components/page-skeleton";
import { WardrobeItemCard } from "@/components/wardrobe-item-card";
import { useHydrated } from "@/hooks/use-hydrated";
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
  const hydrated = useHydrated();
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [setupMode, setSetupMode] = useState(false);
  const [imageDataUrl, setImageDataUrl] = useState("");
  const [analysis, setAnalysis] = useState<WardrobeAnalysis | null>(null);
  const [analysing, setAnalysing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!hydrated) return;
    setItems(getWardrobeItems());
    setSetupMode(new URLSearchParams(window.location.search).get("setup") === "1");
  }, [hydrated]);

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
      setMessage("EWARI could not identify this item automatically. Check the details below before saving.");
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
      setMessage("Your device storage is full. Remove an older item, then try again.");
    } finally {
      setSaving(false);
    }
  }

  function cancelReview() {
    setAnalysis(null);
    setImageDataUrl("");
    setMessage("");
  }

  function removeItem(itemId: string) {
    const item = items.find((entry) => entry.id === itemId);
    if (!item) return;

    if (!window.confirm(`Remove ${item.name} from your wardrobe?`)) return;

    removeWardrobeItem(itemId);
    setItems(getWardrobeItems());
  }

  const action = hydrated && items.length > 0 ? (
    <button className="header-add" onClick={() => inputRef.current?.click()}>
      Add item
    </button>
  ) : undefined;

  return (
    <main className="app-page">
      <AppHeader
        eyebrow="Clothes you already own"
        title="Wardrobe"
        backHref={setupMode ? "/onboarding" : undefined}
        action={action}
      />

      <input
        ref={inputRef}
        className="hidden-input"
        type="file"
        accept="image/*"
        onChange={handleUpload}
      />

      {!hydrated ? (
        <PageSkeleton rows={4} />
      ) : (
        <>
          {setupMode && (
            <section className="setup-banner">
              <div>
                <p className="eyebrow">Last setup step</p>
                <h2>Add a few everyday pieces.</h2>
                <p>Start with a top, a bottom and shoes. Three to five items is enough for your first outfit suggestions.</p>
              </div>
              <div className="setup-actions">
                <Link href="/home" className="ghost-button">Skip for now</Link>
                <Link href="/home" className="primary-button">Continue to home</Link>
              </div>
            </section>
          )}

          {!items.length && !analysis && !analysing && (
            <section className="intro-card">
              <div>
                <p className="eyebrow">Make EWARI personal</p>
                <h2>Upload what you own.</h2>
                <p>Use a clear photo of one main clothing item. EWARI identifies it, then you check the details before saving.</p>
              </div>
              <button className="primary-button" onClick={() => inputRef.current?.click()}>
                Add my first item
              </button>
            </section>
          )}

          {items.length > 0 && !analysis && !analysing && (
            <div className="collection-note">
              <span>{items.length} {items.length === 1 ? "item" : "items"} saved on this device</span>
              <button onClick={() => inputRef.current?.click()}>Add another</button>
            </div>
          )}

          {message && <p className="message" role="status" aria-live="polite">{message}</p>}

          {(analysing || analysis) && (
            <section className="review card" aria-busy={analysing}>
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

                  <div className="style-field">
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
                    <button className="ghost-button" onClick={cancelReview}>Cancel</button>
                    <button className="primary-button" onClick={saveItem} disabled={saving}>
                      {saving ? "Saving…" : "Save item"}
                    </button>
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
                {items.map((item) => (
                  <WardrobeItemCard key={item.id} item={item} onRemove={removeItem} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                Add a top, a bottom and shoes to give EWARI enough pieces for your first complete look.
              </div>
            )}
          </section>
        </>
      )}

      <BottomNav />

      <style jsx>{`
        .header-add {
          min-height: 42px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 999px;
          padding: 0 14px;
          background: #2a211d;
          color: #c7f24a;
          font-size: 11px;
          font-weight: 800;
          white-space: nowrap;
        }
        .hidden-input { display: none; }
        .setup-banner,
        .intro-card {
          display: grid;
          gap: 20px;
          padding: 22px;
          border-radius: 22px;
          background: #dfe7c5;
        }
        .setup-banner h2,
        .intro-card h2 {
          margin: 0;
          font-size: 24px;
          line-height: 1.1;
          letter-spacing: -.03em;
        }
        .setup-banner p:last-child,
        .intro-card p:last-child {
          margin: 9px 0 0;
          max-width: 600px;
          color: #5d6250;
          line-height: 1.5;
          font-size: 12px;
        }
        .setup-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
        }
        .intro-card :global(.primary-button) { width: 100%; }
        .collection-note {
          min-height: 50px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 0 14px;
          border: 1px solid rgba(42,33,29,.1);
          border-radius: 15px;
          background: #fffdf9;
          color: #766d67;
          font-size: 11px;
        }
        .collection-note button {
          border: 0;
          background: transparent;
          color: #171412;
          font-weight: 800;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .message {
          margin: 14px 0 0;
          padding: 11px 13px;
          border-radius: 12px;
          background: #ede5da;
          color: #625a55;
          font-size: 11px;
          line-height: 1.45;
        }
        .review {
          display: grid;
          overflow: hidden;
          margin-top: 18px;
        }
        .preview {
          position: relative;
          aspect-ratio: 4 / 3;
          min-height: 250px;
          display: grid;
          place-items: center;
          background: #ede5da;
        }
        .preview img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .analyse-state {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          padding: 20px;
          background: rgba(247,243,236,.84);
          font-size: 12px;
          font-weight: 760;
          text-align: center;
        }
        .review-form { padding: 20px; }
        .review-head {
          min-height: 54px;
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 20px;
        }
        .review-head h3 {
          margin: 0;
          font-size: 20px;
          line-height: 1.15;
        }
        .review-head > span {
          height: max-content;
          padding: 6px 8px;
          border-radius: 999px;
          background: #dfe7c5;
          font-size: 9px;
          font-weight: 800;
          white-space: nowrap;
        }
        label, .field-label {
          display: block;
          margin: 0 0 7px;
          font-size: 11px;
          font-weight: 800;
        }
        label + label { margin-top: 14px; }
        .two-fields {
          display: grid;
          gap: 14px;
          margin-top: 14px;
        }
        .two-fields label { margin: 0; }
        .style-field { margin-top: 18px; }
        .review-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
          margin-top: 22px;
        }
        .wardrobe-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0,1fr));
          gap: 14px;
        }
        @media (min-width: 720px) {
          .setup-banner,
          .intro-card {
            grid-template-columns: 1fr auto;
            align-items: center;
            padding: 28px;
          }
          .setup-actions { min-width: 300px; }
          .intro-card :global(.primary-button) { width: auto; }
          .review { grid-template-columns: .82fr 1.18fr; }
          .preview { aspect-ratio: auto; min-height: 100%; }
          .two-fields { grid-template-columns: repeat(2, minmax(0,1fr)); }
          .wardrobe-grid {
            grid-template-columns: repeat(4, minmax(0,1fr));
            gap: 18px;
          }
        }
        @media (max-width: 430px) {
          .setup-actions { grid-template-columns: 1fr; }
        }
      `}</style>
    </main>
  );
}
