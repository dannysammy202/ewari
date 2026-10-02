"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { Icon } from "@/components/icon";
import { OutfitBoard } from "@/components/outfit-board";
import { OutfitCard } from "@/components/outfit-card";
import { OCCASIONS } from "@/lib/data";
import { formatNaira } from "@/lib/currency";
import { recommendOutfits } from "@/lib/recommendation/profile-ranking";
import { getProfile } from "@/lib/store";
import type { StyleProfile } from "@/lib/types";

export default function HomePage() {
  const [profile, setProfile] = useState<StyleProfile | null>(null);

  useEffect(() => setProfile(getProfile()), []);

  const recommendations = useMemo(() => recommendOutfits(profile || undefined), [profile]);
  const featured = recommendations[0];

  return (
    <main className="app-page">
      <header className="topbar">
        <div>
          <div className="wordmark">ewari<span className="logo-dot">.</span></div>
          <p className="greeting">Your style, today.</p>
        </div>
        <button className="icon-button" aria-label="Notifications"><Icon name="notification" size={21} /></button>
      </header>

      <section className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow">Today’s look</p>
          <h1 className="display">{featured.title}</h1>
          <p>{featured.description}</p>
          <div className="hero-tags">
            {featured.style.slice(0, 2).map((tag) => <span key={tag}>{tag}</span>)}
          </div>
          <p className="hero-budget">{formatNaira(featured.budgetMin)}–{formatNaira(featured.budgetMax)}</p>
          <Link href={`/outfit/${featured.id}`} className="secondary-button">View look</Link>
        </div>
        <div className="hero-visual"><OutfitBoard items={featured.items} compact showLabels={false} /></div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <p className="eyebrow">Plans first</p>
            <h2 className="display">Dress for an occasion</h2>
          </div>
        </div>
        <div className="occasion-row">
          {OCCASIONS.slice(0, 10).map((occasion, index) => (
            <Link key={occasion} href={`/explore?occasion=${encodeURIComponent(occasion)}`} className="occasion-card">
              <span className="number">{String(index + 1).padStart(2, "0")}</span>
              <strong>{occasion}</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <p className="eyebrow">Picked from your profile</p>
            <h3>For your style</h3>
          </div>
          <Link href="/explore" className="small text-link">See all</Link>
        </div>
        <div className="outfit-grid">
          {recommendations.slice(0, 8).map((outfit) => <OutfitCard key={outfit.id} outfit={outfit} />)}
        </div>
      </section>

      <BottomNav />

      <style jsx>{`
        .greeting { margin: 4px 0 0; color: #766d67; font-size: 12px; }
        .hero-card {
          position: relative;
          min-height: 560px;
          display: grid;
          grid-template-rows: auto 1fr;
          overflow: hidden;
          border-radius: 28px;
          background: #2a211d;
          color: #fffdf9;
        }
        .hero-copy { position: relative; z-index: 2; padding: 25px 24px 0; }
        .hero-copy :global(.eyebrow) { color: #c7f24a; }
        .hero-copy h1 { max-width: 340px; font-size: clamp(38px, 10vw, 62px); }
        .hero-copy > p:not(.eyebrow):not(.hero-budget) {
          max-width: 400px;
          color: rgba(255,255,255,.68);
          line-height: 1.45;
        }
        .hero-tags { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 15px; }
        .hero-tags span {
          padding: 7px 10px;
          border: 1px solid rgba(255,255,255,.14);
          border-radius: 999px;
          color: rgba(255,255,255,.78);
          font-size: 11px;
        }
        .hero-budget { margin: 15px 0 18px; color: #c7f24a; font-weight: 750; }
        .hero-copy :global(.secondary-button) {
          display: inline-grid;
          place-items: center;
          min-width: 125px;
        }
        .hero-visual {
          min-height: 350px;
          margin: 20px 16px 16px;
          overflow: hidden;
          border-radius: 22px;
        }
        .occasion-row {
          display: grid;
          grid-auto-flow: column;
          grid-auto-columns: minmax(142px, 1fr);
          gap: 10px;
          overflow-x: auto;
          padding-bottom: 5px;
          scrollbar-width: none;
        }
        .occasion-row::-webkit-scrollbar { display: none; }
        .occasion-card {
          min-height: 122px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 15px;
          border: 1px solid rgba(42,33,29,.12);
          border-radius: 18px;
          background: #fffdf9;
        }
        .occasion-card:nth-child(3n+1) { background: #ede5da; }
        .occasion-card:nth-child(3n+2) { background: #dfe7c5; }
        .occasion-card:nth-child(3n) { background: #e8d6cf; }
        .number { font-size: 11px; color: #766d67; font-weight: 750; }
        .occasion-card strong { font-size: 15px; }
        @media (min-width: 760px) {
          .hero-card { grid-template-columns: .85fr 1.15fr; min-height: 560px; }
          .hero-copy { padding: 38px; align-self: center; }
          .hero-visual { min-height: 528px; margin: 16px; }
        }
      `}</style>
    </main>
  );
}
