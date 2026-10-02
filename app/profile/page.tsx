"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { Icon } from "@/components/icon";
import { getProfile, getWardrobeItems } from "@/lib/store";
import type { StyleProfile } from "@/lib/types";

export default function ProfilePage() {
  const [profile, setProfile] = useState<StyleProfile | null>(null);
  const [wardrobeCount, setWardrobeCount] = useState(0);

  useEffect(() => {
    setProfile(getProfile());
    setWardrobeCount(getWardrobeItems().length);
  }, []);

  return (
    <main className="app-page narrow">
      <header className="profile-head">
        <div className="avatar">E</div>
        <div>
          <p className="eyebrow">EWARI profile</p>
          <h1 className="display">Your style</h1>
        </div>
      </header>

      <section className="stats card">
        <div><strong>{profile?.styles.length || 0}</strong><span>Style directions</span></div>
        <div><strong>{profile?.occasions.length || 0}</strong><span>Occasions</span></div>
        <div><strong>{wardrobeCount}</strong><span>Wardrobe items</span></div>
      </section>

      <section className="section">
        <div className="section-head"><h3>Style profile</h3><Link href="/onboarding" className="small text-link">Edit</Link></div>
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
            Your style profile is empty. <Link href="/onboarding" className="text-link">Set it up</Link>.
          </div>
        )}
      </section>

      <section className="section wardrobe-link card"><Link href="/wardrobe"><Icon name="bag-2" size={20} /><span>Manage wardrobe</span><Icon name="arrow-right-3" size={18} /></Link></section>

      <section className="section settings card">
        <button><Icon name="notification" size={20} /><span>Notifications</span><Icon name="arrow-right-3" size={18} /></button>
        <button><Icon name="moon" size={20} /><span>Appearance</span><Icon name="arrow-right-3" size={18} /></button>
        <button><Icon name="shield-tick" size={20} /><span>Privacy</span><Icon name="arrow-right-3" size={18} /></button>
        <button><Icon name="message-question" size={20} /><span>Help</span><Icon name="arrow-right-3" size={18} /></button>
      </section>

      <BottomNav />
      <style jsx>{`
        .profile-head { display: flex; align-items: center; gap: 18px; margin: 12px 0 34px; }
        .avatar { width: 72px; height: 72px; display: grid; place-items: center; border-radius: 50%; background: #2a211d; color: #c7f24a; font-family: var(--font-display); font-size: 34px; }
        .stats { display: grid; grid-template-columns: repeat(3, 1fr); padding: 18px 6px; }
        .stats div { min-width: 0; padding: 4px 12px; text-align: center; border-right: 1px solid rgba(42,33,29,.1); }
        .stats div:last-child { border-right: 0; }
        .stats strong { display: block; font-size: 23px; }
        .stats span { display: block; margin-top: 4px; color: #766d67; font-size: 10px; line-height: 1.3; }
        .profile-card { overflow: hidden; }
        .wardrobe-link { overflow: hidden; }
        .wardrobe-link :global(a) { min-height: 58px; display: grid; grid-template-columns: 28px 1fr 22px; align-items: center; gap: 8px; padding: 0 15px; }
        .settings { overflow: hidden; }
        .settings button { width: 100%; min-height: 58px; display: grid; grid-template-columns: 28px 1fr 22px; align-items: center; gap: 8px; padding: 0 15px; border: 0; border-bottom: 1px solid rgba(42,33,29,.1); background: transparent; text-align: left; }
        .settings button:last-child { border-bottom: 0; }
      `}</style>
    </main>
  );
}

function ProfileRow({ title, values }: { title: string; values: string[] }) {
  return (
    <div className="profile-row">
      <span>{title}</span>
      <div>{values.filter(Boolean).length ? values.filter(Boolean).map((value) => <em key={value}>{value}</em>) : <em>Not set</em>}</div>
      <style jsx>{`
        .profile-row { display: grid; grid-template-columns: 88px 1fr; gap: 12px; padding: 16px; border-bottom: 1px solid rgba(42,33,29,.1); }
        .profile-row:last-child { border-bottom: 0; }
        span { color: #766d67; font-size: 12px; font-weight: 700; }
        div { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 6px; }
        em { padding: 5px 8px; border-radius: 999px; background: #ede5da; font-size: 11px; font-style: normal; font-weight: 700; }
      `}</style>
    </div>
  );
}
