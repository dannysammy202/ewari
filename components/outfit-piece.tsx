"use client";

import Image from "next/image";
import type { OutfitImage } from "@/lib/outfit-images/types";
import type { OutfitItem } from "@/lib/types";

type OutfitPieceProps = {
  item: OutfitItem;
  image?: OutfitImage;
  variant: "top" | "bottom" | "shoes" | "accessory";
  compact?: boolean;
  loading?: boolean;
  onBroken: (itemId: string) => void;
};

export function OutfitPiece({
  item,
  image,
  variant,
  compact = false,
  loading = false,
  onBroken,
}: OutfitPieceProps) {
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
        <div className={`photo-state ${loading ? "loading" : ""}`}>
          <span>{loading ? "" : item.name}</span>
        </div>
      )}

      <style jsx>{`
        .outfit-piece {
          position: relative;
          display: grid;
          place-items: center;
          width: 100%;
          filter: drop-shadow(0 18px 16px rgba(42,33,29,.1));
        }
        .outfit-piece :global(img) {
          width: 100%;
          height: 100%;
          object-fit: contain;
          mix-blend-mode: multiply;
          border-radius: 16px;
        }
        .photo-state {
          width: 100%;
          height: 100%;
          display: grid;
          place-items: center;
          padding: 12px;
          border-radius: 16px;
          background: rgba(255,253,249,.62);
          color: #766d67;
          text-align: center;
          font-size: 10px;
          line-height: 1.25;
        }
        .photo-state.loading {
          background:
            linear-gradient(
              100deg,
              rgba(255,253,249,.45) 25%,
              rgba(255,255,255,.9) 40%,
              rgba(255,253,249,.45) 55%
            );
          background-size: 220% 100%;
          animation: shimmer 1.3s infinite linear;
        }
        @keyframes shimmer {
          to { background-position-x: -220%; }
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
