"use client";

import { useMemo, useState } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { OutfitCard } from "@/components/outfit-card";
import { OCCASIONS, OUTFITS } from "@/lib/data";

const moods = ["Clean", "Relaxed", "Bold", "Minimal", "Smart", "Street", "Afrocentric"];

export default function StyleMePage() {
  const [occasion, setOccasion] = useState("Church");
  const [mood, setMood] = useState("Relaxed");
  const [prompt, setPrompt] = useState("");
  const [generated, setGenerated] = useState(false);

  const results = useMemo(() => {
    const promptText = prompt.toLowerCase();
    return [...OUTFITS].sort((a, b) => {
      const score = (outfit: typeof a) => {
        let points = 0;
        if (outfit.occasion === occasion) points += 5;
        if (outfit.mood.some((value) => value.toLowerCase() === mood.toLowerCase())) points += 3;
        if (promptText && [outfit.title, outfit.description, ...outfit.style, ...outfit.items.map((item) => item.name + " " + item.colour)].join(" ").toLowerCase().includes(promptText)) points += 4;
        if (promptText.includes("black") && outfit.items.some((item) => item.colour.toLowerCase().includes("black"))) points += 2;
        if (promptText.includes("white sneaker") && outfit.items.some((item) => item.name.toLowerCase().includes("trainer"))) points += 2;
        return points;
      };
      return score(b) - score(a);
    }).slice(0, 3);
  }, [occasion, mood, prompt]);

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
            {OCCASIONS.map((value) => <button key={value} className={`chip ${occasion === value ? "active" : ""}`} onClick={() => setOccasion(value)}>{value}</button>)}
          </div>
        </div>

        <div className="field-block">
          <label>What mood are you going for?</label>
          <div className="chip-row">
            {moods.map((value) => <button key={value} className={`chip ${mood === value ? "active" : ""}`} onClick={() => setMood(value)}>{value}</button>)}
          </div>
        </div>

        <div className="field-block">
          <label htmlFor="prompt">Anything you want included?</label>
          <textarea
            id="prompt"
            className="prompt"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="For example: mostly black, with white sneakers."
          />
        </div>

        <button className="primary-button generate" onClick={() => setGenerated(true)}>Give me looks</button>
      </section>

      {generated && (
        <section className="section">
          <div className="section-head">
            <div>
              <p className="eyebrow">Built around your request</p>
              <h3>Here are three directions</h3>
            </div>
          </div>
          <div className="results">{results.map((outfit) => <OutfitCard key={outfit.id} outfit={outfit} />)}</div>
        </section>
      )}

      <BottomNav />
      <style jsx>{`
        .styler { padding: 18px; }
        .field-block + .field-block { margin-top: 26px; }
        label { display: block; margin-bottom: 11px; font-size: 14px; font-weight: 800; }
        .prompt {
          width: 100%;
          min-height: 112px;
          resize: vertical;
          padding: 14px;
          border: 1px solid rgba(42,33,29,.12);
          border-radius: 14px;
          background: #f7f3ec;
          color: #171412;
          outline: 0;
        }
        .prompt:focus { border-color: #2a211d; }
        .generate { width: 100%; margin-top: 22px; }
        .results { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
        @media (min-width: 680px) { .results { grid-template-columns: repeat(3, 1fr); } .styler { padding: 26px; } }
      `}</style>
    </main>
  );
}
