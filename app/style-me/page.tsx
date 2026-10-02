"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { WardrobeGapList } from "@/components/wardrobe-gap-list";
import { WardrobeLookCard } from "@/components/wardrobe-look-card";
import { OCCASIONS } from "@/lib/data";
import { fallbackStyleIntent } from "@/lib/recommendation/fallback-style-intent";
import { getProfile, getWardrobeItems } from "@/lib/store";
import {
  buildWardrobeLooks,
  recommendWardrobeGaps,
} from "@/lib/wardrobe/recommendation";
import type { StyleIntent, StyleProfile } from "@/lib/types";
import type { WardrobeItem } from "@/lib/wardrobe/types";

const moods = ["Clean", "Relaxed", "Bold", "Minimal", "Smart", "Street", "Afrocentric"];

export default function StyleMePage() {
  const [occasion, setOccasion] = useState("Church");
  const [mood, setMood] = useState("Relaxed");
  const [prompt, setPrompt] = useState("");
  const [profile, setProfile] = useState<StyleProfile | null>(null);
  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>([]);
  const [intent, setIntent] = useState<StyleIntent | null>(null);
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<"gemini" | "fallback" | null>(null);

  useEffect(() => {
    setProfile(getProfile());
    setWardrobe(getWardrobeItems());

    const requested = new URLSearchParams(window.location.search).get("occasion");
    if (requested && OCCASIONS.includes(requested)) setOccasion(requested);
  }, []);

  const activeIntent = useMemo(
    () => intent || fallbackStyleIntent(occasion, mood, prompt),
    [intent, occasion, mood, prompt]
  );

  const wardrobeLooks = useMemo(
    () => buildWardrobeLooks(wardrobe, activeIntent, profile).filter((look) => look.completeness === 100),
    [wardrobe, activeIntent, profile]
  );

  const gaps = useMemo(
    () => recommendWardrobeGaps(wardrobe, profile, activeIntent, 4),
    [wardrobe, profile, activeIntent]
  );

  async function generateLooks() {
    const fallback = fallbackStyleIntent(occasion, mood, prompt);

    setLoading(true);
    setGenerated(false);
    setSource(null);

    try {
      const response = await fetch("/api/style-me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ occasion, mood, prompt }),
      });

      if (!response.ok) throw new Error("Gemini unavailable");

      const data = await response.json();
      if (!data?.intent) throw new Error("Missing intent");

      setIntent(data.intent);
      setSource("gemini");
    } catch {
      setIntent(fallback);
      setSource("fallback");
    } finally {
      setWardrobe(getWardrobeItems());
      setGenerated(true);
      setLoading(false);
    }
  }

  const summary = intent
    ? [
        intent.occasion,
        intent.mood,
        intent.dressLevel,
        ...intent.colours.slice(0, 2),
        ...intent.requiredItems.slice(0, 2),
      ].filter(Boolean)
    : [];

  return (
    <main className="app-page narrow">
      <header className="topbar">
        <div>
          <p className="eyebrow">Style what you already own</p>
          <h1 className="display">Style me</h1>
        </div>
      </header>

      {!wardrobe.length && (
        <section className="wardrobe-callout">
          <div>
            <p className="eyebrow">Your wardrobe is empty</p>
            <h3>Add your clothes first</h3>
            <p>EWARI needs your own pieces before it builds a personal outfit.</p>
          </div>
          <Link href="/wardrobe" className="primary-button">Add clothes</Link>
        </section>
      )}

      <section className="styler card">
        <div className="field-block">
          <label>What are you dressing for?</label>
          <div className="chip-row">
            {OCCASIONS.map((value) => (
              <button
                key={value}
                className={`chip ${occasion === value ? "active" : ""}`}
                onClick={() => setOccasion(value)}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        <div className="field-block">
          <label>What mood are you going for?</label>
          <div className="chip-row">
            {moods.map((value) => (
              <button
                key={value}
                className={`chip ${mood === value ? "active" : ""}`}
                onClick={() => setMood(value)}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        <div className="field-block">
          <label htmlFor="prompt">Anything specific?</label>
          <textarea
            id="prompt"
            className="prompt"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="For example: keep it mostly black, use my white sneakers, relaxed fit."
          />
          <p className="helper">EWARI checks your uploaded wardrobe first.</p>
        </div>

        <button className="primary-button generate" onClick={generateLooks} disabled={loading || !wardrobe.length}>
          {loading ? "Checking your wardrobe…" : "Style my wardrobe"}
        </button>
      </section>

      {generated && intent && (
        <section className="interpretation">
          <div className="interpretation-head">
            <div>
              <p className="eyebrow">{source === "gemini" ? "EWARI understood" : "Built-in matching"}</p>
              <p className="direction">{intent.stylingDirection}</p>
            </div>
            <span className={`source-badge ${source === "fallback" ? "fallback" : ""}`}>
              {source === "gemini" ? "AI" : "Fallback"}
            </span>
          </div>
          <div className="intent-chips">
            {summary.map((value, index) => <span key={`${value}-${index}`}>{value}</span>)}
          </div>
        </section>
      )}

      {generated && (
        <>
          <section className="section">
            <div className="section-head">
              <div>
                <p className="eyebrow">Using clothes you own</p>
                <h3>{wardrobeLooks.length ? "Your outfit options" : "No complete look yet"}</h3>
              </div>
            </div>

            {wardrobeLooks.length ? (
              <div className="results">
                {wardrobeLooks.map((look) => <WardrobeLookCard key={look.id} look={look} />)}
              </div>
            ) : (
              <div className="empty-state compact-empty">
                EWARI could not build a complete look from your current wardrobe for this request. The gaps below are the pieces with the highest value for your wardrobe.
              </div>
            )}
          </section>

          <section className="section">
            <div className="section-head">
              <div>
                <p className="eyebrow">Wardrobe gaps</p>
                <h3>Worth adding</h3>
              </div>
            </div>
            <WardrobeGapList recommendations={gaps} />
          </section>
        </>
      )}

      <BottomNav />

      <style jsx>{`
        .wardrobe-callout {
          display: grid;
          gap: 16px;
          margin-bottom: 18px;
          padding: 18px;
          border-radius: 20px;
          background: #dfe7c5;
        }
        .wardrobe-callout h3 { margin: 0; font-size: 20px; }
        .wardrobe-callout p:last-child { margin: 6px 0 0; color: #5d6250; font-size: 12px; line-height: 1.45; }
        .wardrobe-callout :global(a) { display: grid; place-items: center; }
        .styler { padding: 18px; }
        .field-block + .field-block { margin-top: 26px; }
        label { display: block; margin-bottom: 11px; font-size: 14px; font-weight: 800; }
        .prompt {
          width: 100%;
          min-height: 122px;
          resize: vertical;
          padding: 14px;
          border: 1px solid rgba(42,33,29,.12);
          border-radius: 14px;
          background: #f7f3ec;
          color: #171412;
          outline: 0;
        }
        .prompt:focus { border-color: #2a211d; box-shadow: 0 0 0 3px rgba(199,242,74,.28); }
        .helper { margin: 8px 0 0; color: #766d67; font-size: 11px; line-height: 1.45; }
        .generate { width: 100%; margin-top: 22px; }
        .generate:disabled { opacity: .42; cursor: not-allowed; }
        .interpretation {
          margin-top: 18px;
          padding: 18px;
          border-radius: 18px;
          background: #e8d6cf;
          border: 1px solid rgba(42,33,29,.08);
        }
        .interpretation-head {
          display: flex;
          align-items: start;
          justify-content: space-between;
          gap: 16px;
        }
        .direction { margin: 0; max-width: 520px; line-height: 1.5; font-size: 14px; }
        .source-badge {
          flex: 0 0 auto;
          padding: 6px 9px;
          border-radius: 999px;
          background: #2a211d;
          color: #c7f24a;
          font-size: 10px;
          font-weight: 850;
          text-transform: uppercase;
          letter-spacing: .07em;
        }
        .source-badge.fallback { background: #ede5da; color: #766d67; }
        .intent-chips { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 14px; }
        .intent-chips span {
          padding: 7px 10px;
          border-radius: 999px;
          background: rgba(255,253,249,.68);
          font-size: 11px;
          font-weight: 750;
        }
        .results { display: grid; grid-template-columns: 1fr; gap: 14px; }
        .compact-empty { padding: 30px 18px; font-size: 12px; line-height: 1.5; }
        @media (min-width: 680px) {
          .wardrobe-callout { grid-template-columns: 1fr auto; align-items: center; }
          .styler { padding: 26px; }
          .interpretation { padding: 22px; }
          .results { grid-template-columns: repeat(2, minmax(0,1fr)); }
        }
      `}</style>
    </main>
  );
}
