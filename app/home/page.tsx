"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { Icon } from "@/components/icon";
import { WardrobeGapList } from "@/components/wardrobe-gap-list";
import { WardrobeItemCard } from "@/components/wardrobe-item-card";
import { WardrobeLookBoard } from "@/components/wardrobe-look-board";
import { OCCASIONS } from "@/lib/data";
import { fallbackStyleIntent } from "@/lib/recommendation/fallback-style-intent";
import { getProfile, getWardrobeItems } from "@/lib/store";
import {
  buildWardrobeLooks,
  recommendWardrobeGaps,
} from "@/lib/wardrobe/recommendation";
import type { StyleProfile } from "@/lib/types";
import type { WardrobeItem } from "@/lib/wardrobe/types";

export default function HomePage() {
  const [profile, setProfile] = useState<StyleProfile | null>(null);
  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>([]);

  useEffect(() => {
    setProfile(getProfile());
    setWardrobe(getWardrobeItems());
  }, []);

  const defaultOccasion = profile?.occasions[0] || "Casual outing";
  const intent = useMemo(
    () => fallbackStyleIntent(defaultOccasion, "Relaxed", ""),
    [defaultOccasion]
  );

  const looks = useMemo(
    () => buildWardrobeLooks(wardrobe, intent, profile).filter((look) => look.completeness === 100),
    [wardrobe, intent, profile]
  );

  const gaps = useMemo(
    () => recommendWardrobeGaps(wardrobe, profile, null, 3),
    [wardrobe, profile]
  );

  const featured = looks[0];

  return (
    <main className="app-page">
      <header className="topbar">
        <div>
          <div className="wordmark">ewari<span className="logo-dot">.</span></div>
          <p className="greeting">Style what you already own.</p>
        </div>
        <button className="icon-button" aria-label="Notifications"><Icon name="notification" size={21} /></button>
      </header>

      {featured ? (
        <section className="wardrobe-hero">
          <div className="hero-copy">
            <p className="eyebrow">From your wardrobe</p>
            <h1 className="display">{featured.title}</h1>
            <p>{featured.explanation}</p>
            <Link href={`/style-me?occasion=${encodeURIComponent(featured.occasion)}`} className="secondary-button">
              Style another look
            </Link>
          </div>
          <div className="hero-board"><WardrobeLookBoard look={featured} compact /></div>
        </section>
      ) : (
        <section className="empty-hero">
          <div>
            <p className="eyebrow">Start with what you own</p>
            <h1 className="display">Build your wardrobe.</h1>
            <p>Add a few tops, bottoms and shoes. EWARI will combine your exact clothes into looks for different occasions.</p>
          </div>
          <Link href="/wardrobe" className="secondary-button">Add my clothes</Link>
        </section>
      )}

      <section className="section">
        <div className="section-head">
          <div>
            <p className="eyebrow">Plans first</p>
            <h2 className="display">Dress for an occasion</h2>
          </div>
        </div>
        <div className="occasion-row">
          {OCCASIONS.slice(0, 10).map((occasion, index) => (
            <Link key={occasion} href={`/style-me?occasion=${encodeURIComponent(occasion)}`} className="occasion-card">
              <span className="number">{String(index + 1).padStart(2, "0")}</span>
              <strong>{occasion}</strong>
            </Link>
          ))}
        </div>
      </section>

      {wardrobe.length > 0 && (
        <section className="section">
          <div className="section-head">
            <div>
              <p className="eyebrow">Recently added</p>
              <h3>Your wardrobe</h3>
            </div>
            <Link href="/wardrobe" className="small text-link">See all</Link>
          </div>
          <div className="recent-grid">
            {wardrobe.slice(0, 4).map((item) => <WardrobeItemCard key={item.id} item={item} />)}
          </div>
        </section>
      )}

      <section className="section">
        <div className="section-head">
          <div>
            <p className="eyebrow">Based on your taste and wardrobe</p>
            <h3>Pieces worth adding</h3>
          </div>
        </div>
        <WardrobeGapList recommendations={gaps} />
      </section>

      <BottomNav />

      <style jsx>{`
        .greeting { margin: 4px 0 0; color: #766d67; font-size: 12px; }
        .wardrobe-hero {
          display: grid;
          overflow: hidden;
          border-radius: 28px;
          background: #2a211d;
          color: #fffdf9;
        }
        .hero-copy { padding: 26px 24px; }
        .hero-copy :global(.eyebrow) { color: #c7f24a; }
        .hero-copy h1 { font-size: clamp(38px, 9vw, 62px); }
        .hero-copy > p:not(.eyebrow) { max-width: 440px; color: rgba(255,255,255,.7); line-height: 1.5; }
        .hero-copy :global(a) { display: inline-grid; place-items: center; margin-top: 15px; }
        .hero-board { min-height: 330px; padding: 12px; }
        .empty-hero {
          display: grid;
          gap: 22px;
          padding: 28px 24px;
          border-radius: 28px;
          background: #2a211d;
          color: #fffdf9;
        }
        .empty-hero :global(.eyebrow) { color: #c7f24a; }
        .empty-hero h1 { font-size: clamp(42px, 10vw, 68px); }
        .empty-hero p:last-child { max-width: 550px; color: rgba(255,255,255,.68); line-height: 1.5; }
        .empty-hero :global(a) { display: grid; place-items: center; }
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
        .recent-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0,1fr));
          gap: 14px;
        }
        @media (min-width: 760px) {
          .wardrobe-hero { grid-template-columns: .8fr 1.2fr; align-items: center; min-height: 520px; }
          .hero-copy { padding: 38px; }
          .hero-board { min-height: 500px; }
          .empty-hero { grid-template-columns: 1fr auto; align-items: center; padding: 40px; }
          .recent-grid { grid-template-columns: repeat(4, minmax(0,1fr)); gap: 18px; }
        }
      `}</style>
    </main>
  );
}
