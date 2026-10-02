"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "@/components/app-header";
import { BottomNav } from "@/components/bottom-nav";
import { PageSkeleton } from "@/components/page-skeleton";
import { WardrobeGapList } from "@/components/wardrobe-gap-list";
import { WardrobeLookCard } from "@/components/wardrobe-look-card";
import { useHydrated } from "@/hooks/use-hydrated";
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
  const hydrated = useHydrated();
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
    if (!hydrated) return;

    setProfile(getProfile());
    setWardrobe(getWardrobeItems());

    const requested = new URLSearchParams(window.location.search).get("occasion");
    if (requested && OCCASIONS.includes(requested)) setOccasion(requested);
  }, [hydrated]);

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
      <AppHeader eyebrow="Style what you already own" title="Style me" backHref="/home" />

      {!hydrated ? (
        <PageSkeleton rows={2} />
      ) : !wardrobe.length ? (
        <section className="empty-wardrobe">
          <p className="eyebrow">Your wardrobe is empty</p>
          <h2>Add your clothes first.</h2>
          <p>EWARI needs your own pieces before it builds a personal outfit. Start with a top, a bottom and shoes.</p>
          <Link href="/wardrobe" className="primary-button">Add clothes</Link>
        </section>
      ) : (
        <>
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

            <button className="primary-button generate" onClick={generateLooks} disabled={loading}>
              {loading ? "Checking your wardrobe…" : "Style my wardrobe"}
            </button>
          </section>

          {generated && intent && (
            <section className="interpretation" aria-live="polite">
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
                    {wardrobeLooks.map((look) => (
                      <WardrobeLookCard key={look.id} look={look} />
                    ))}
                  </div>
                ) : (
                  <div className="empty-state compact-empty">
                    Your wardrobe is missing one or more core pieces for this request. The suggestions below fill the biggest gaps.
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
        </>
      )}

      <BottomNav />

      <style jsx>{`
        .empty-wardrobe {
          padding: 26px;
          border-radius: 22px;
          background: #dfe7c5;
        }
        .empty-wardrobe h2 {
          margin: 0;
          font-size: 26px;
          line-height: 1.08;
          letter-spacing: -.03em;
        }
        .empty-wardrobe p:not(.eyebrow) {
          max-width: 520px;
          margin: 12px 0 20px;
          color: #5d6250;
          font-size: 12px;
          line-height: 1.55;
        }
        .styler { padding: 20px; }
        .field-block + .field-block { margin-top: 25px; }
        label {
          display: block;
          margin-bottom: 10px;
          font-size: 13px;
          font-weight: 800;
        }
        .prompt {
          width: 100%;
          min-height: 116px;
          resize: vertical;
          padding: 13px 14px;
          border: 1px solid rgba(42,33,29,.12);
          border-radius: 13px;
          background: #f7f3ec;
          color: #171412;
          outline: 0;
        }
        .prompt:focus {
          border-color: #2a211d;
          box-shadow: 0 0 0 3px rgba(199,242,74,.28);
        }
        .helper {
          margin: 7px 0 0;
          color: #766d67;
          font-size: 10px;
          line-height: 1.45;
        }
        .generate {
          width: 100%;
          margin-top: 22px;
        }
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
        .interpretation-head > div { min-width: 0; }
        .direction {
          margin: 0;
          max-width: 520px;
          line-height: 1.5;
          font-size: 13px;
        }
        .source-badge {
          flex: 0 0 auto;
          padding: 6px 9px;
          border-radius: 999px;
          background: #2a211d;
          color: #c7f24a;
          font-size: 9px;
          font-weight: 850;
          text-transform: uppercase;
          letter-spacing: .07em;
        }
        .source-badge.fallback {
          background: #ede5da;
          color: #766d67;
        }
        .intent-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-top: 14px;
        }
        .intent-chips span {
          padding: 7px 10px;
          border-radius: 999px;
          background: rgba(255,253,249,.68);
          font-size: 10px;
          font-weight: 750;
        }
        .results {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
        }
        .compact-empty {
          padding: 28px 18px;
          font-size: 12px;
        }
        @media (min-width: 680px) {
          .styler { padding: 25px; }
          .interpretation { padding: 22px; }
          .results { grid-template-columns: repeat(2, minmax(0,1fr)); }
        }
      `}</style>
    </main>
  );
}
