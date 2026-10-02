"use client";

import { useEffect, useMemo, useState } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { OutfitCard } from "@/components/outfit-card";
import { OCCASIONS } from "@/lib/data";
import { fallbackStyleIntent } from "@/lib/recommendation/fallback-style-intent";\nimport { rankOutfitsForIntent } from "@/lib/recommendation/outfit-ranking";
import { getProfile } from "@/lib/store";
import type { StyleIntent, StyleProfile } from "@/lib/types";

const moods = ["Clean", "Relaxed", "Bold", "Minimal", "Smart", "Street", "Afrocentric"];

export default function StyleMePage() {
  const [occasion, setOccasion] = useState("Church");
  const [mood, setMood] = useState("Relaxed");
  const [prompt, setPrompt] = useState("");
  const [profile, setProfile] = useState<StyleProfile | null>(null);
  const [intent, setIntent] = useState<StyleIntent | null>(null);
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<"gemini" | "fallback" | null>(null);

  useEffect(() => setProfile(getProfile()), []);

  const results = useMemo(() => {
    const activeIntent = intent || fallbackStyleIntent(occasion, mood, prompt);
    return rankOutfitsForIntent(activeIntent, profile).slice(0, 3);
  }, [intent, occasion, mood, prompt, profile]);

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
          <p className="eyebrow">Your personal stylist</p>
          <h1 className="display">Style me</h1>
        </div>
      </header>

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
          <label htmlFor="prompt">Tell EWARI what you need</label>
          <textarea
            id="prompt"
            className="prompt"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="For example: something relaxed for church, mostly black, with white sneakers."
          />
          <p className="helper">Mention a colour, a piece you want included, or how dressed up you want to feel.</p>
        </div>

        <button className="primary-button generate" onClick={generateLooks} disabled={loading}>
          {loading ? "Styling your looks…" : "Give me looks"}
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
          {source === "fallback" && (
            <p className="fallback-note">Gemini was unavailable, so EWARI used its built-in recommendation engine.</p>
          )}
        </section>
      )}

      {generated && (
        <section className="section">
          <div className="section-head">
            <div>
              <p className="eyebrow">Built around your request</p>
              <h3>Here are three directions</h3>
            </div>
          </div>
          <div className="results">
            {results.map((outfit) => <OutfitCard key={outfit.id} outfit={outfit} />)}
          </div>
        </section>
      )}

      <BottomNav />

      <style jsx>{`
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
        .generate:disabled { opacity: .62; cursor: progress; }
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
        .fallback-note { margin: 12px 0 0; color: #766d67; font-size: 11px; line-height: 1.45; }
        .results { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
        @media (min-width: 680px) {
          .results { grid-template-columns: repeat(3, 1fr); }
          .styler { padding: 26px; }
          .interpretation { padding: 22px; }
        }
      `}</style>
    </main>
  );
}
