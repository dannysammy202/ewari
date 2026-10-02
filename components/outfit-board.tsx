"use client";

import { useEffect, useMemo, useState } from "react";
import type { OutfitItem } from "@/lib/types";

type OutfitBoardProps = {
  items: OutfitItem[];
  compact?: boolean;
  showLabels?: boolean;
};

type ItemImage = {
  itemId: string;
  imageUrl: string;
  fullImageUrl?: string | null;
  title: string;
  creator: string;
  license: string;
  licenseUrl?: string | null;
  sourceUrl?: string | null;
  attribution?: string | null;
};

function pick(items: OutfitItem[], category: OutfitItem["category"]) {
  return items.find((item) => item.category === category);
}

function TopShape({ item }: { item: OutfitItem }) {
  const hoodie = /hoodie|sweatshirt/i.test(item.name);
  return (
    <svg viewBox="0 0 240 190" aria-hidden="true">
      {hoodie ? (
        <path d="M82 34c7-21 24-31 38-31s31 10 38 31l18 8 41 35-23 33-25-16v86H71V94l-25 16-23-33 41-35 18-8Z" fill={item.visualColour} />
      ) : (
        <path d="M83 29 104 14h32l21 15 45 22-18 43-27-12v93H83V82L56 94 38 51l45-22Z" fill={item.visualColour} />
      )}
    </svg>
  );
}

function BottomShape({ item }: { item: OutfitItem }) {
  return (
    <svg viewBox="0 0 210 260" aria-hidden="true">
      <path d="M42 12h126l10 25-24 211H111l-7-128-7 128H54L32 37 42 12Z" fill={item.visualColour} />
    </svg>
  );
}

function ShoeShape({ item }: { item: OutfitItem }) {
  return (
    <svg viewBox="0 0 200 105" aria-hidden="true">
      <path d="M18 57c17-7 32-23 44-42h47c11 21 27 34 53 42 18 6 30 15 30 28 0 9-8 13-22 13H34C17 98 8 92 8 80c0-10 4-18 10-23Z" fill={item.visualColour} />
      <path d="M18 80h165" stroke="rgba(42,33,29,.22)" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

function AccessoryShape({ item }: { item: OutfitItem }) {
  if (item.category === "bag") {
    return (
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <rect x="18" y="33" width="64" height="52" rx="15" fill={item.visualColour} />
        <path d="M34 38c0-18 32-18 32 0" fill="none" stroke="rgba(42,33,29,.35)" strokeWidth="5" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="24" fill={item.visualColour} />
      <circle cx="50" cy="50" r="14" fill="rgba(255,255,255,.34)" />
      <path d="M47 12h6v17h-6zM47 71h6v17h-6z" fill={item.visualColour} />
    </svg>
  );
}

function FallbackShape({ item }: { item: OutfitItem }) {
  if (item.category === "top" || item.category === "outerwear") return <TopShape item={item} />;
  if (item.category === "bottom") return <BottomShape item={item} />;
  if (item.category === "shoes") return <ShoeShape item={item} />;
  return <AccessoryShape item={item} />;
}

function ItemPhoto({
  item,
  image,
  className,
  onBroken,
}: {
  item: OutfitItem;
  image?: ItemImage;
  className: string;
  onBroken: (id: string) => void;
}) {
  if (!image?.imageUrl) {
    return <div className={`${className} fallback`}><FallbackShape item={item} /></div>;
  }

  return (
    <div className={className}>
      <img
        src={image.imageUrl}
        alt={item.name}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => onBroken(item.id)}
      />
    </div>
  );
}

export function OutfitBoard({ items, compact = false, showLabels = true }: OutfitBoardProps) {
  const top = pick(items, "top") || pick(items, "outerwear");
  const bottom = pick(items, "bottom");
  const shoes = pick(items, "shoes");
  const accessories = items.filter((item) => item.category === "bag" || item.category === "accessory").slice(0, 3);

  const searchedItems = useMemo(
    () => [top, bottom, shoes, ...accessories].filter(Boolean) as OutfitItem[],
    [top, bottom, shoes, accessories]
  );

  const requestKey = useMemo(
    () => searchedItems.map((item) => item.id).join("|"),
    [searchedItems]
  );

  const [images, setImages] = useState<Record<string, ItemImage>>({});
  const [broken, setBroken] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let cancelled = false;

    async function loadImages() {
      if (!searchedItems.length) return;

      try {
        const response = await fetch("/api/outfit-images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: searchedItems.map(({ id, name, category, colour }) => ({ id, name, category, colour })),
          }),
        });

        if (!response.ok) return;
        const data = await response.json();

        if (!cancelled && data?.images) {
          setImages(data.images);
          setBroken({});
        }
      } catch {
        // Keep the built-in visual fallback.
      }
    }

    loadImages();
    return () => { cancelled = true; };
  }, [requestKey]);

  function usableImage(id: string) {
    return broken[id] ? undefined : images[id];
  }

  const credits = searchedItems
    .map((item) => usableImage(item.id))
    .filter(Boolean) as ItemImage[];

  return (
    <div className={`outfit-board ${compact ? "compact" : ""}`}>
      <div className="grain" />

      {top && (
        <div className="piece top-piece">
          {showLabels && <div className="piece-label top-label"><b>TOP</b><span>{top.name}</span></div>}
          <ItemPhoto item={top} image={usableImage(top.id)} className="photo top-photo" onBroken={(id) => setBroken((current) => ({ ...current, [id]: true }))} />
        </div>
      )}

      {bottom && (
        <div className="piece bottom-piece">
          {showLabels && <div className="piece-label bottom-label"><b>PANTS</b><span>{bottom.name}</span></div>}
          <ItemPhoto item={bottom} image={usableImage(bottom.id)} className="photo bottom-photo" onBroken={(id) => setBroken((current) => ({ ...current, [id]: true }))} />
        </div>
      )}

      {shoes && (
        <div className="piece shoe-piece">
          {showLabels && <div className="piece-label shoe-label"><b>SHOES</b><span>{shoes.name}</span></div>}
          <ItemPhoto item={shoes} image={usableImage(shoes.id)} className="photo shoe-photo" onBroken={(id) => setBroken((current) => ({ ...current, [id]: true }))} />
        </div>
      )}

      {accessories.map((item, index) => (
        <div className={`accessory accessory-${index + 1}`} key={item.id}>
          <ItemPhoto item={item} image={usableImage(item.id)} className="photo accessory-photo" onBroken={(id) => setBroken((current) => ({ ...current, [id]: true }))} />
          {showLabels && !compact && <span>{item.name}</span>}
        </div>
      ))}

      {showLabels && !compact && credits.length > 0 && (
        <details className="credits">
          <summary>Image credits</summary>
          <div>
            {credits.map((credit) => (
              <p key={credit.itemId}>
                {credit.sourceUrl ? <a href={credit.sourceUrl} target="_blank" rel="noreferrer">{credit.title}</a> : credit.title}
                {" · "}{credit.creator} · {credit.license}
              </p>
            ))}
            <p>Images sourced through Openverse.</p>
          </div>
        </details>
      )}

      <style jsx>{`
        .outfit-board {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 620px;
          overflow: hidden;
          border-radius: inherit;
          background:
            radial-gradient(circle at 20% 8%, rgba(255,255,255,.94), transparent 30%),
            linear-gradient(145deg, #f0ece6 0%, #e8e2da 100%);
          color: #2a211d;
        }
        .grain {
          position: absolute;
          inset: 0;
          opacity: .13;
          pointer-events: none;
          background-image: radial-gradient(rgba(42,33,29,.16) .55px, transparent .55px);
          background-size: 5px 5px;
          mix-blend-mode: multiply;
        }
        .piece, .accessory { position: absolute; }
        .top-piece {
          top: 5%;
          left: 50%;
          width: 52%;
          max-width: 310px;
          transform: translateX(-50%) rotate(-1deg);
        }
        .bottom-piece {
          top: 38%;
          left: 50%;
          width: 44%;
          max-width: 260px;
          transform: translateX(-50%) rotate(.6deg);
        }
        .shoe-piece {
          left: 50%;
          bottom: 4%;
          width: 60%;
          max-width: 355px;
          transform: translateX(-50%) rotate(-1deg);
        }
        .photo {
          display: grid;
          place-items: center;
          width: 100%;
          filter: drop-shadow(0 18px 16px rgba(42,33,29,.13));
        }
        .photo :global(img) {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
          mix-blend-mode: multiply;
          border-radius: 16px;
        }
        .top-photo { height: 220px; }
        .bottom-photo { height: 275px; }
        .shoe-photo { height: 120px; }
        .accessory-photo { height: 76px; }
        .fallback :global(svg) { width: 100%; max-height: 100%; }
        .piece-label {
          position: absolute;
          z-index: 5;
          display: grid;
          gap: 2px;
          width: 122px;
          line-height: 1.08;
        }
        .piece-label b { font-size: 12px; letter-spacing: .04em; font-weight: 900; }
        .piece-label span { color: #625a55; font-size: 10px; line-height: 1.2; }
        .top-label { left: -46%; top: 14%; }
        .bottom-label { right: -57%; top: 13%; }
        .shoe-label { left: -25%; bottom: 18%; }
        .accessory {
          z-index: 3;
          width: 82px;
          display: grid;
          justify-items: center;
          gap: 5px;
        }
        .accessory span {
          max-width: 100px;
          color: #625a55;
          font-size: 9px;
          line-height: 1.15;
          text-align: center;
        }
        .accessory-1 { top: 12%; right: 4%; transform: rotate(4deg); }
        .accessory-2 { top: 49%; left: 3%; transform: rotate(-6deg); }
        .accessory-3 { top: 51%; right: 3%; transform: rotate(7deg); }
        .credits {
          position: absolute;
          right: 12px;
          bottom: 10px;
          z-index: 8;
          max-width: 260px;
          font-size: 9px;
          color: #625a55;
        }
        .credits summary {
          width: max-content;
          margin-left: auto;
          padding: 5px 8px;
          border-radius: 999px;
          background: rgba(255,253,249,.88);
          cursor: pointer;
          font-weight: 750;
        }
        .credits div {
          margin-top: 6px;
          padding: 9px 10px;
          border-radius: 12px;
          background: rgba(255,253,249,.96);
          box-shadow: 0 8px 24px rgba(42,33,29,.09);
        }
        .credits p { margin: 0 0 5px; line-height: 1.25; }
        .credits p:last-child { margin-bottom: 0; }
        .credits a { text-decoration: underline; text-underline-offset: 2px; }

        .compact { min-height: 100%; }
        .compact .top-piece { top: 6%; width: 55%; }
        .compact .bottom-piece { top: 38%; width: 48%; }
        .compact .shoe-piece { bottom: 3%; width: 65%; }
        .compact .piece-label { display: none; }
        .compact .top-photo { height: 128px; }
        .compact .bottom-photo { height: 150px; }
        .compact .shoe-photo { height: 72px; }
        .compact .accessory { width: 54px; }
        .compact .accessory-photo { height: 50px; }
        .compact .accessory-1 { top: 9%; right: 2%; }
        .compact .accessory-2 { top: 50%; left: 2%; }
        .compact .accessory-3 { top: 49%; right: 2%; }

        @media (max-width: 560px) {
          .outfit-board:not(.compact) { min-height: 650px; }
          .top-piece { width: 56%; }
          .bottom-piece { width: 49%; }
          .shoe-piece { width: 68%; }
          .top-label { left: -56%; }
          .bottom-label { right: -62%; }
          .shoe-label { left: -19%; }
          .accessory { width: 65px; }
        }
      `}</style>
    </div>
  );
}
