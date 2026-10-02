"use client";

import Image from "next/image";
import type { OutfitImage } from "@/lib/outfit-images/types";
import type { OutfitItem } from "@/lib/types";

type OutfitPieceProps = {
  item: OutfitItem;
  image?: OutfitImage;
  variant: "top" | "bottom" | "shoes" | "accessory";
  compact?: boolean;
  onBroken: (itemId: string) => void;
};

function TopFallback({ item }: { item: OutfitItem }) {
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

function BottomFallback({ item }: { item: OutfitItem }) {
  return (
    <svg viewBox="0 0 210 260" aria-hidden="true">
      <path d="M42 12h126l10 25-24 211H111l-7-128-7 128H54L32 37 42 12Z" fill={item.visualColour} />
    </svg>
  );
}

function ShoeFallback({ item }: { item: OutfitItem }) {
  return (
    <svg viewBox="0 0 200 105" aria-hidden="true">
      <path d="M18 57c17-7 32-23 44-42h47c11 21 27 34 53 42 18 6 30 15 30 28 0 9-8 13-22 13H34C17 98 8 92 8 80c0-10 4-18 10-23Z" fill={item.visualColour} />
      <path d="M18 80h165" stroke="rgba(42,33,29,.22)" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

function AccessoryFallback({ item }: { item: OutfitItem }) {
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

function Fallback({ item, variant }: Pick<OutfitPieceProps, "item" | "variant">) {
  if (variant === "top") return <TopFallback item={item} />;
  if (variant === "bottom") return <BottomFallback item={item} />;
  if (variant === "shoes") return <ShoeFallback item={item} />;
  return <AccessoryFallback item={item} />;
}

export function OutfitPiece({ item, image, variant, compact = false, onBroken }: OutfitPieceProps) {
  return (
    <div className={`outfit-piece ${variant} ${compact ? "compact" : ""}`}>
      {image?.imageUrl ? (
        <Image
          src={image.imageUrl}
          alt={item.name}
          width={420}
          height={420}
          unoptimized
          onError={() => onBroken(item.id)}
        />
      ) : (
        <Fallback item={item} variant={variant} />
      )}

      <style jsx>{`
        .outfit-piece {
          position: relative;
          display: grid;
          place-items: center;
          width: 100%;
          filter: drop-shadow(0 18px 16px rgba(42,33,29,.13));
        }
        .outfit-piece :global(img) {
          width: 100%;
          height: 100%;
          object-fit: contain;
          mix-blend-mode: multiply;
          border-radius: 16px;
        }
        .outfit-piece :global(svg) {
          width: 100%;
          max-height: 100%;
        }
        .top { height: 220px; }
        .bottom { height: 275px; }
        .shoes { height: 120px; }
        .accessory { height: 76px; }
        .compact.top { height: 128px; }
        .compact.bottom { height: 150px; }
        .compact.shoes { height: 72px; }
        .compact.accessory { height: 50px; }
      `}</style>
    </div>
  );
}
