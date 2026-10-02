"use client";

import { useMemo } from "react";
import { OutfitCredits } from "@/components/outfit-credits";
import { OutfitPiece } from "@/components/outfit-piece";
import { useOutfitImages } from "@/hooks/use-outfit-images";
import type { OutfitImage } from "@/lib/outfit-images/types";
import type { OutfitItem } from "@/lib/types";

type OutfitBoardProps = {
  items: OutfitItem[];
  compact?: boolean;
  showLabels?: boolean;
};

function pick(items: OutfitItem[], category: OutfitItem["category"]) {
  return items.find((item) => item.category === category);
}

export function OutfitBoard({ items, compact = false, showLabels = true }: OutfitBoardProps) {
  const top = pick(items, "top") || pick(items, "outerwear");
  const bottom = pick(items, "bottom");
  const shoes = pick(items, "shoes");
  const accessories = items
    .filter((item) => item.category === "bag" || item.category === "accessory")
    .slice(0, 3);

  const visibleItems = useMemo(
    () => [top, bottom, shoes, ...accessories].filter(Boolean) as OutfitItem[],
    [top, bottom, shoes, accessories]
  );

  const { getImage, markBroken, loading } = useOutfitImages(visibleItems);
  const credits = visibleItems
    .map((item) => getImage(item.id))
    .filter((image): image is OutfitImage => Boolean(image));

  return (
    <div className={`outfit-board ${compact ? "compact" : ""}`}>
      <div className="grain" />

      {top && (
        <div className="piece top-piece">
          {showLabels && <div className="piece-label top-label"><b>TOP</b><span>{top.name}</span></div>}
          <OutfitPiece item={top} image={getImage(top.id)} variant="top" compact={compact} loading={loading} onBroken={markBroken} />
        </div>
      )}

      {bottom && (
        <div className="piece bottom-piece">
          {showLabels && <div className="piece-label bottom-label"><b>PANTS</b><span>{bottom.name}</span></div>}
          <OutfitPiece item={bottom} image={getImage(bottom.id)} variant="bottom" compact={compact} loading={loading} onBroken={markBroken} />
        </div>
      )}

      {shoes && (
        <div className="piece shoe-piece">
          {showLabels && <div className="piece-label shoe-label"><b>SHOES</b><span>{shoes.name}</span></div>}
          <OutfitPiece item={shoes} image={getImage(shoes.id)} variant="shoes" compact={compact} loading={loading} onBroken={markBroken} />
        </div>
      )}

      {accessories.map((item, index) => (
        <div className={`accessory accessory-${index + 1}`} key={item.id}>
          <OutfitPiece item={item} image={getImage(item.id)} variant="accessory" compact={compact} loading={loading} onBroken={markBroken} />
          {showLabels && !compact && <span>{item.name}</span>}
        </div>
      ))}

      {showLabels && !compact && <OutfitCredits images={credits} />}

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
        .top-piece { top: 5%; left: 50%; width: 52%; max-width: 310px; transform: translateX(-50%) rotate(-1deg); }
        .bottom-piece { top: 38%; left: 50%; width: 44%; max-width: 260px; transform: translateX(-50%) rotate(.6deg); }
        .shoe-piece { left: 50%; bottom: 4%; width: 60%; max-width: 355px; transform: translateX(-50%) rotate(-1deg); }
        .piece-label { position: absolute; z-index: 5; display: grid; gap: 2px; width: 122px; line-height: 1.08; }
        .piece-label b { font-size: 12px; letter-spacing: .04em; font-weight: 900; }
        .piece-label span { color: #625a55; font-size: 10px; line-height: 1.2; }
        .top-label { left: -46%; top: 14%; }
        .bottom-label { right: -57%; top: 13%; }
        .shoe-label { left: -25%; bottom: 18%; }
        .accessory { z-index: 3; width: 82px; display: grid; justify-items: center; gap: 5px; }
        .accessory span { max-width: 100px; color: #625a55; font-size: 9px; line-height: 1.15; text-align: center; }
        .accessory-1 { top: 12%; right: 4%; transform: rotate(4deg); }
        .accessory-2 { top: 49%; left: 3%; transform: rotate(-6deg); }
        .accessory-3 { top: 51%; right: 3%; transform: rotate(7deg); }
        .compact { min-height: 100%; }
        .compact .top-piece { top: 6%; width: 55%; }
        .compact .bottom-piece { top: 38%; width: 48%; }
        .compact .shoe-piece { bottom: 3%; width: 65%; }
        .compact .piece-label { display: none; }
        .compact .accessory { width: 54px; }
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
