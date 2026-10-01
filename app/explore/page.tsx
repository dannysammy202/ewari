"use client";

import { useEffect, useMemo, useState } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { Icon } from "@/components/icon";
import { OutfitCard } from "@/components/outfit-card";
import { OCCASIONS, OUTFITS, STYLE_OPTIONS } from "@/lib/data";

export default function ExplorePage() {
  const [occasion, setOccasion] = useState("All");
  const [style, setStyle] = useState("All");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("occasion");
    if (requested) setOccasion(requested);
  }, []);

  const results = useMemo(() => {
    return OUTFITS.filter((outfit) => {
      const matchesOccasion = occasion === "All" || outfit.occasion === occasion;
      const matchesStyle = style === "All" || outfit.style.includes(style);
      const haystack = [outfit.title, outfit.occasion, ...outfit.style, ...outfit.items.map((item) => item.name)].join(" ").toLowerCase();
      const matchesQuery = !query.trim() || haystack.includes(query.trim().toLowerCase());
      return matchesOccasion && matchesStyle && matchesQuery;
    });
  }, [occasion, style, query]);

  return (
    <main className="app-page">
      <header className="topbar">
        <div>
          <p className="eyebrow">Browse freely</p>
          <h1 className="display">Explore</h1>
        </div>
      </header>

      <label className="search">
        <Icon name="search-normal-1" size={20} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search styles, occasions or pieces" />
      </label>

      <section className="filter-block">
        <p className="filter-label">Occasion</p>
        <div className="chip-row">
          {["All", ...OCCASIONS].map((value) => (
            <button key={value} className={`chip ${occasion === value ? "active" : ""}`} onClick={() => setOccasion(value)}>{value}</button>
          ))}
        </div>
      </section>

      <section className="filter-block">
        <p className="filter-label">Style</p>
        <div className="chip-row">
          {["All", ...STYLE_OPTIONS].map((value) => (
            <button key={value} className={`chip ${style === value ? "active" : ""}`} onClick={() => setStyle(value)}>{value}</button>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h3>{results.length} looks</h3>
          {(occasion !== "All" || style !== "All") && (
            <button className="clear" onClick={() => { setOccasion("All"); setStyle("All"); }}>Clear filters</button>
          )}
        </div>
        {results.length ? (
          <div className="outfit-grid">{results.map((outfit) => <OutfitCard key={outfit.id} outfit={outfit} />)}</div>
        ) : (
          <div className="empty-state">No looks match those filters yet.</div>
        )}
      </section>

      <BottomNav />
      <style jsx>{`
        .search {
          min-height: 54px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 15px;
          border: 1px solid rgba(42,33,29,.12);
          border-radius: 15px;
          background: #fffdf9;
        }
        .search input { flex: 1; min-width: 0; border: 0; outline: 0; background: transparent; font: inherit; }
        .filter-block { margin-top: 25px; }
        .filter-label { margin: 0 0 10px; font-size: 12px; font-weight: 800; color: #766d67; text-transform: uppercase; letter-spacing: .08em; }
        .clear { border: 0; background: transparent; text-decoration: underline; text-underline-offset: 3px; font-size: 12px; }
      `}</style>
    </main>
  );
}
