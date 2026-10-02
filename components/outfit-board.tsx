"use client";

import type { OutfitItem } from "@/lib/types";

type OutfitBoardProps = {
  items: OutfitItem[];
  compact?: boolean;
  showLabels?: boolean;
};

function pick(items: OutfitItem[], category: OutfitItem["category"]) {
  return items.find((item) => item.category === category);
}

function isPatterned(item?: OutfitItem) {
  if (!item) return false;
  const value = `${item.name} ${item.colour}`.toLowerCase();
  return value.includes("ankara") || value.includes("pattern");
}

function TopShape({ item }: { item: OutfitItem }) {
  const hoodie = /hoodie|sweatshirt/i.test(item.name);
  return (
    <svg viewBox="0 0 240 190" aria-hidden="true">
      <defs>
        <linearGradient id={`top-${item.id}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor={item.visualColour} stopOpacity="1" />
          <stop offset="1" stopColor={item.visualColour} stopOpacity=".78" />
        </linearGradient>
      </defs>
      {hoodie ? (
        <>
          <path d="M82 34c7-21 24-31 38-31s31 10 38 31l18 8 41 35-23 33-25-16v86H71V94l-25 16-23-33 41-35 18-8Z" fill={`url(#top-${item.id})`} />
          <path d="M93 34c6 13 15 20 27 20s21-7 27-20c-2-17-14-27-27-27S95 17 93 34Z" fill="rgba(255,255,255,.16)" />
          <path d="M101 122h38" stroke="rgba(255,255,255,.22)" strokeWidth="3" strokeLinecap="round" />
          <path d="M91 148h58" stroke="rgba(0,0,0,.08)" strokeWidth="3" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M83 29 104 14h32l21 15 45 22-18 43-27-12v93H83V82L56 94 38 51l45-22Z" fill={`url(#top-${item.id})`} />
          <path d="M104 14c3 17 29 17 32 0" fill="none" stroke="rgba(255,255,255,.32)" strokeWidth="4" />
          <path d="M120 36v122" stroke="rgba(255,255,255,.14)" strokeWidth="2" />
        </>
      )}
    </svg>
  );
}

function BottomShape({ item }: { item: OutfitItem }) {
  const patterned = isPatterned(item);
  return (
    <svg viewBox="0 0 210 260" aria-hidden="true">
      <defs>
        <linearGradient id={`bottom-${item.id}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor={item.visualColour} />
          <stop offset="1" stopColor={item.visualColour} stopOpacity=".78" />
        </linearGradient>
        <pattern id={`pattern-${item.id}`} width="28" height="28" patternUnits="userSpaceOnUse" patternTransform="rotate(18)">
          <rect width="28" height="28" fill={item.visualColour} />
          <path d="M0 14h28M14 0v28" stroke="rgba(255,244,205,.32)" strokeWidth="5" />
          <circle cx="14" cy="14" r="5" fill="rgba(42,33,29,.2)" />
        </pattern>
      </defs>
      <path d="M42 12h126l10 25-24 211H111l-7-128-7 128H54L32 37 42 12Z" fill={patterned ? `url(#pattern-${item.id})` : `url(#bottom-${item.id})`} />
      <path d="M42 34h126" stroke="rgba(255,255,255,.22)" strokeWidth="4" />
      <path d="M104 37v72" stroke="rgba(0,0,0,.08)" strokeWidth="3" />
      <path d="M62 62c12 7 24 9 37 8M147 62c-12 7-24 9-37 8" fill="none" stroke="rgba(255,255,255,.13)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function ShoeShape({ item, flipped = false }: { item: OutfitItem; flipped?: boolean }) {
  return (
    <svg viewBox="0 0 160 80" aria-hidden="true" style={{ transform: flipped ? "scaleX(-1)" : undefined }}>
      <defs>
        <linearGradient id={`shoe-${item.id}-${flipped ? "b" : "a"}`} x1="0" x2="1">
          <stop offset="0" stopColor={item.visualColour} />
          <stop offset="1" stopColor={item.visualColour} stopOpacity=".76" />
        </linearGradient>
      </defs>
      <path d="M13 46c13-5 25-18 34-32h38c9 17 21 27 42 34 14 5 24 11 24 21 0 7-6 10-17 10H25C12 79 5 74 5 65c0-8 3-14 8-19Z" fill={`url(#shoe-${item.id}-${flipped ? "b" : "a"})`} />
      <path d="M13 65h132" stroke="rgba(42,33,29,.22)" strokeWidth="5" strokeLinecap="round" />
      <path d="M53 28h38M48 36h51M43 44h63" stroke="rgba(255,255,255,.48)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function AccessoryShape({ item }: { item: OutfitItem }) {
  if (item.category === "bag") {
    return (
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <rect x="18" y="33" width="64" height="52" rx="15" fill={item.visualColour} />
        <path d="M34 38c0-18 32-18 32 0" fill="none" stroke="rgba(42,33,29,.35)" strokeWidth="5" strokeLinecap="round" />
        <path d="M28 48h44" stroke="rgba(255,255,255,.2)" strokeWidth="3" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="24" fill={item.visualColour} />
      <circle cx="50" cy="50" r="14" fill="rgba(255,255,255,.34)" />
      <path d="M47 12h6v17h-6zM47 71h6v17h-6z" fill={item.visualColour} />
      <path d="M50 50 59 42" stroke="rgba(42,33,29,.45)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function OutfitBoard({ items, compact = false, showLabels = true }: OutfitBoardProps) {
  const top = pick(items, "top") || pick(items, "outerwear");
  const bottom = pick(items, "bottom");
  const shoes = pick(items, "shoes");
  const accessories = items.filter((item) => item.category === "bag" || item.category === "accessory").slice(0, 3);

  return (
    <div className={`outfit-board ${compact ? "compact" : ""}`}>
      <div className="grain" />

      {top && (
        <div className="top-piece">
          {showLabels && <div className="piece-label top-label"><b>TOP</b><span>{top.name}</span></div>}
          <TopShape item={top} />
        </div>
      )}

      {bottom && (
        <div className="bottom-piece">
          {showLabels && <div className="piece-label bottom-label"><b>PANTS</b><span>{bottom.name}</span></div>}
          <BottomShape item={bottom} />
        </div>
      )}

      {shoes && (
        <div className="shoe-piece">
          {showLabels && <div className="piece-label shoe-label"><b>SHOES</b><span>{shoes.name}</span></div>}
          <div className="shoe-pair">
            <ShoeShape item={shoes} />
            <ShoeShape item={shoes} flipped />
          </div>
        </div>
      )}

      {accessories.map((item, index) => (
        <div className={`accessory accessory-${index + 1}`} key={item.id}>
          <AccessoryShape item={item} />
          {showLabels && !compact && <span>{item.name}</span>}
        </div>
      ))}

      <style jsx>{`
        .outfit-board {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 620px;
          overflow: hidden;
          border-radius: inherit;
          background:
            radial-gradient(circle at 20% 8%, rgba(255,255,255,.85), transparent 28%),
            linear-gradient(145deg, #eeeae3 0%, #e7e1d8 100%);
          color: #2a211d;
        }
        .grain {
          position: absolute;
          inset: 0;
          opacity: .2;
          pointer-events: none;
          background-image: radial-gradient(rgba(42,33,29,.18) .6px, transparent .6px);
          background-size: 5px 5px;
          mix-blend-mode: multiply;
        }
        .top-piece, .bottom-piece, .shoe-piece, .accessory { position: absolute; }
        .top-piece {
          top: 6.5%;
          left: 50%;
          width: 48%;
          max-width: 290px;
          transform: translateX(-50%) rotate(-1deg);
          filter: drop-shadow(0 18px 16px rgba(42,33,29,.1));
        }
        .bottom-piece {
          top: 39%;
          left: 50%;
          width: 42%;
          max-width: 245px;
          transform: translateX(-50%) rotate(.7deg);
          filter: drop-shadow(0 20px 18px rgba(42,33,29,.1));
        }
        .shoe-piece {
          left: 50%;
          bottom: 4.5%;
          width: 64%;
          max-width: 370px;
          transform: translateX(-50%) rotate(-1deg);
          filter: drop-shadow(0 15px 13px rgba(42,33,29,.11));
        }
        .shoe-pair { display: flex; align-items: end; gap: 2%; }
        .shoe-pair :global(svg) { width: 51%; }
        .piece-label {
          position: absolute;
          z-index: 4;
          display: grid;
          gap: 2px;
          width: 118px;
          line-height: 1.08;
        }
        .piece-label b {
          font-size: 12px;
          letter-spacing: .04em;
          font-weight: 900;
        }
        .piece-label span {
          color: #625a55;
          font-size: 10px;
          line-height: 1.2;
        }
        .top-label { left: -46%; top: 10%; }
        .bottom-label { right: -54%; top: 12%; }
        .shoe-label { left: -20%; bottom: 8%; }
        .accessory {
          z-index: 3;
          width: 72px;
          display: grid;
          justify-items: center;
          gap: 4px;
          filter: drop-shadow(0 12px 10px rgba(42,33,29,.09));
        }
        .accessory :global(svg) { width: 100%; }
        .accessory span {
          max-width: 92px;
          color: #625a55;
          font-size: 9px;
          line-height: 1.15;
          text-align: center;
        }
        .accessory-1 { top: 12%; right: 6%; transform: rotate(6deg); }
        .accessory-2 { top: 48%; left: 5%; transform: rotate(-8deg); }
        .accessory-3 { top: 49%; right: 5%; transform: rotate(9deg); }

        .compact {
          min-height: 100%;
        }
        .compact .top-piece { top: 8%; width: 53%; }
        .compact .bottom-piece { top: 38%; width: 46%; }
        .compact .shoe-piece { bottom: 4%; width: 68%; }
        .compact .piece-label { display: none; }
        .compact .accessory { width: 52px; }
        .compact .accessory-1 { top: 11%; right: 4%; }
        .compact .accessory-2 { top: 48%; left: 3%; }
        .compact .accessory-3 { top: 48%; right: 3%; }

        @media (max-width: 560px) {
          .outfit-board:not(.compact) { min-height: 650px; }
          .top-piece { width: 52%; }
          .bottom-piece { width: 46%; }
          .shoe-piece { width: 70%; }
          .top-label { left: -55%; }
          .bottom-label { right: -60%; }
          .shoe-label { left: -18%; }
          .accessory { width: 60px; }
        }
      `}</style>
    </div>
  );
}
