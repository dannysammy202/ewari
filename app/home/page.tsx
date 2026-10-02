"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { PageSkeleton } from "@/components/page-skeleton";
import { WardrobeGapList } from "@/components/wardrobe-gap-list";
import { WardrobeItemCard } from "@/components/wardrobe-item-card";
import { WardrobeLookBoard } from "@/components/wardrobe-look-board";
import { useHydrated } from "@/hooks/use-hydrated";
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
  const hydrated = useHydrated();
  const [profile, setProfile] = useState<StyleProfile | null>(null);
  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>([]);

  useEffect(() => {
    if (!hydrated) return;
    setProfile(getProfile());
    setWardrobe(getWardrobeItems());
  }, [hydrated]);

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
      <header className="home-header">
        <div>
          <div className="wordmark">ewari<span className="logo-dot">.</span></div>
          <p>Style what you already own.</p>
        </div>
      </header>

      {!hydrated ? (
        <PageSkeleton rows={4} />
      ) : (
        <>
          {!profile ? (
            <section className="empty-hero">
              <div>
                <p className="eyebrow">Start with your taste</p>
                <h1 className="display">Set up your style.</h1>
                <p>Tell EWARI how you like to dress, then add the clothes you already own.</p>
              </div>
              <Link href="/onboarding" className="secondary-button">Set up my style</Link>
            </section>
          ) : featured ? (
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
                <Link
                  key={occasion}
                  href={`/style-me?occasion=${encodeURIComponent(occasion)}`}
                  className="occasion-card"
                >
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
                {wardrobe.slice(0, 4).map((item) => (
                  <WardrobeItemCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          )}

          {profile && (
            <section className="section">
              <div className="section-head">
                <div>
                  <p className="eyebrow">Based on your taste and wardrobe</p>
                  <h3>Pieces worth adding</h3>
                </div>
              </div>
              <WardrobeGapList recommendations={gaps} />
            </section>
          )}
        </>
      )}

      <BottomNav />

      <style jsx>{`
        .home-header {
          min-height: 68px;
          display: flex;
          align-items: center;
          margin-bottom: 26px;
        }
        .home-header p {
          margin: 5px 0 0;
          color: #766d67;
          font-size: 12px;
        }
        .wardrobe-hero {
          display: grid;
          overflow: hidden;
          border-radius: 26px;
          background: #2a211d;
          color: #fffdf9;
        }
        .hero-copy { padding: 26px 24px; }
        .hero-copy :global(.eyebrow) { color: #c7f24a; }
        .hero-copy h1 { font-size: clamp(38px, 9vw, 60px); }
        .hero-copy > p:not(.eyebrow) {
          max-width: 440px;
          margin: 14px 0 0;
          color: rgba(255,255,255,.7);
          line-height: 1.5;
        }
        .hero-copy :global(a) { margin-top: 20px; }
        .hero-board {
          min-height: 300px;
          display: grid;
          align-items: stretch;
          padding: 12px;
        }
        .empty-hero {
          display: grid;
          gap: 22px;
          padding: 28px 24px;
          border-radius: 26px;
          background: #2a211d;
          color: #fffdf9;
        }
        .empty-hero :global(.eyebrow) { color: #c7f24a; }
        .empty-hero h1 { font-size: clamp(40px, 10vw, 64px); }
        .empty-hero p:last-child {
          max-width: 550px;
          margin: 14px 0 0;
          color: rgba(255,255,255,.68);
          line-height: 1.5;
        }
        .occasion-row {
          display: grid;
          grid-auto-flow: column;
          grid-auto-columns: minmax(136px, 1fr);
          gap: 10px;
          overflow-x: auto;
          overscroll-behavior-inline: contain;
          scroll-snap-type: x proximity;
          padding: 1px 1px 6px;
          scrollbar-width: none;
        }
        .occasion-row::-webkit-scrollbar { display: none; }
        .occasion-card {
          min-height: 112px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          scroll-snap-align: start;
          padding: 14px;
          border: 1px solid rgba(42,33,29,.12);
          border-radius: 17px;
          background: #fffdf9;
        }
        .occasion-card:nth-child(3n+1) { background: #ede5da; }
        .occasion-card:nth-child(3n+2) { background: #dfe7c5; }
        .occasion-card:nth-child(3n) { background: #e8d6cf; }
        .number {
          font-size: 10px;
          color: #766d67;
          font-weight: 760;
        }
        .occasion-card strong {
          font-size: 14px;
          line-height: 1.15;
        }
        .recent-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0,1fr));
          gap: 14px;
        }
        @media (min-width: 760px) {
          .wardrobe-hero {
            grid-template-columns: .82fr 1.18fr;
            align-items: center;
            min-height: 500px;
          }
          .hero-copy { padding: 38px; }
          .hero-board { min-height: 476px; }
          .empty-hero {
            grid-template-columns: 1fr auto;
            align-items: center;
            padding: 38px;
          }
          .recent-grid {
            grid-template-columns: repeat(4, minmax(0,1fr));
            gap: 18px;
          }
        }
      `}</style>
    </main>
  );
}
