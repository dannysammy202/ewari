"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/app-header";
import { BottomNav } from "@/components/bottom-nav";
import { Icon } from "@/components/icon";
import { PageSkeleton } from "@/components/page-skeleton";
import { useHydrated } from "@/hooks/use-hydrated";
import { getProfile, getWardrobeItems } from "@/lib/store";
import type { StyleProfile } from "@/lib/types";

export default function ProfilePage() {
  const hydrated = useHydrated();
  const [profile, setProfile] = useState<StyleProfile | null>(null);
  const [wardrobeCount, setWardrobeCount] = useState(0);

  useEffect(() => {
    if (!hydrated) return;
    setProfile(getProfile());
    setWardrobeCount(getWardrobeItems().length);
  }, [hydrated]);

  return (
    <main className="app-page narrow">
      <AppHeader eyebrow="EWARI profile" title="Your style" />

      {!hydrated ? (
        <PageSkeleton rows={2} />
      ) : (
        <>
          <section className="stats card">
            <div><strong>{profile?.styles.length || 0}</strong><span>Style directions</span></div>
            <div><strong>{profile?.occasions.length || 0}</strong><span>Occasions</span></div>
            <div><strong>{wardrobeCount}</strong><span>Wardrobe items</span></div>
          </section>

          <section className="section">
            <div className="section-head">
              <h3>Style profile</h3>
              <Link href="/onboarding" className="small text-link">{profile ? "Edit" : "Set up"}</Link>
            </div>

            {profile ? (
              <div className="profile-card card">
                <ProfileRow title="Clothing" values={[profile.presentation]} />
                <ProfileRow title="Styles" values={profile.styles} />
                <ProfileRow title="Fits" values={profile.fits} />
                <ProfileRow title="Colours" values={profile.colours} />
                <ProfileRow title="Footwear" values={profile.footwear} />
                <ProfileRow title="Budget" values={[profile.budget]} />
              </div>
            ) : (
              <div className="empty-state">
                Set up your style profile so EWARI has preferences to use alongside your wardrobe.
              </div>
            )}
          </section>

          <section className="section action-list card">
            <Link href="/wardrobe">
              <Icon name="bag-2" size={20} />
              <span>
                <strong>Manage wardrobe</strong>
                <small>Add or remove clothes you own</small>
              </span>
              <Icon name="arrow-right-3" size={18} />
            </Link>
            <Link href="/saved">
              <Icon name="bookmark" size={20} />
              <span>
                <strong>Saved looks</strong>
                <small>Return to outfit combinations you kept</small>
              </span>
              <Icon name="arrow-right-3" size={18} />
            </Link>
          </section>

          <section className="section privacy-card">
            <Icon name="shield-tick" size={20} />
            <div>
              <strong>Your wardrobe stays on this device</strong>
              <p>This MVP stores your style profile, wardrobe photos and saved looks in your browser storage.</p>
            </div>
          </section>
        </>
      )}

      <BottomNav />

      <style jsx>{`
        .stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          padding: 16px 5px;
        }
        .stats div {
          min-width: 0;
          padding: 5px 10px;
          text-align: center;
          border-right: 1px solid rgba(42,33,29,.1);
        }
        .stats div:last-child { border-right: 0; }
        .stats strong {
          display: block;
          font-size: 22px;
          line-height: 1;
        }
        .stats span {
          display: block;
          min-height: 26px;
          margin-top: 6px;
          color: #766d67;
          font-size: 9px;
          line-height: 1.3;
        }
        .profile-card { overflow: hidden; }
        .action-list { overflow: hidden; }
        .action-list :global(a) {
          min-height: 68px;
          display: grid;
          grid-template-columns: 28px minmax(0,1fr) 22px;
          align-items: center;
          gap: 10px;
          padding: 0 15px;
          border-bottom: 1px solid rgba(42,33,29,.1);
        }
        .action-list :global(a:last-child) { border-bottom: 0; }
        .action-list span { min-width: 0; }
        .action-list strong,
        .action-list small { display: block; }
        .action-list strong {
          font-size: 12px;
          line-height: 1.2;
        }
        .action-list small {
          margin-top: 3px;
          color: #766d67;
          font-size: 9px;
          line-height: 1.3;
        }
        .privacy-card {
          display: grid;
          grid-template-columns: 24px 1fr;
          gap: 11px;
          padding: 17px;
          border-radius: 18px;
          background: #dfe7c5;
        }
        .privacy-card strong {
          display: block;
          font-size: 12px;
        }
        .privacy-card p {
          margin: 5px 0 0;
          color: #5d6250;
          font-size: 10px;
          line-height: 1.45;
        }
      `}</style>
    </main>
  );
}

function ProfileRow({ title, values }: { title: string; values: string[] }) {
  const cleanValues = values.filter(Boolean);

  return (
    <div className="profile-row">
      <span>{title}</span>
      <div>
        {cleanValues.length
          ? cleanValues.map((value) => <em key={value}>{value}</em>)
          : <em>Not set</em>}
      </div>

      <style jsx>{`
        .profile-row {
          display: grid;
          grid-template-columns: 82px minmax(0,1fr);
          gap: 12px;
          padding: 14px 15px;
          border-bottom: 1px solid rgba(42,33,29,.1);
        }
        .profile-row:last-child { border-bottom: 0; }
        span {
          color: #766d67;
          font-size: 11px;
          font-weight: 700;
        }
        div {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 5px;
        }
        em {
          padding: 5px 8px;
          border-radius: 999px;
          background: #ede5da;
          font-size: 10px;
          font-style: normal;
          font-weight: 700;
          line-height: 1.2;
        }
      `}</style>
    </div>
  );
}
