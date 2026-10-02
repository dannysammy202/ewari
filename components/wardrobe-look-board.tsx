"use client";

import type { WardrobeLook } from "@/lib/wardrobe/types";

export function WardrobeLookBoard({
  look,
  compact = false,
}: {
  look: WardrobeLook;
  compact?: boolean;
}) {
  return (
    <div className={`look-board ${compact ? "compact" : ""}`}>
      {look.items.slice(0, 4).map((item) => (
        <div className="piece" key={item.id}>
          <div className="image-wrap">
            <img src={item.imageDataUrl} alt={item.name} />
          </div>
          {!compact && (
            <div className="piece-copy">
              <small>{item.category}</small>
              <strong>{item.name}</strong>
            </div>
          )}
        </div>
      ))}

      <style jsx>{`
        .look-board {
          display: grid;
          grid-template-columns: repeat(2, minmax(0,1fr));
          gap: 7px;
          width: 100%;
          padding: 7px;
          border-radius: 17px;
          background: #ede5da;
        }
        .piece {
          min-width: 0;
          overflow: hidden;
          border-radius: 12px;
          background: #fffdf9;
          border: 1px solid rgba(42,33,29,.06);
        }
        .image-wrap {
          aspect-ratio: 1 / 1;
          display: grid;
          place-items: center;
          overflow: hidden;
          background: #f7f3ec;
        }
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .piece-copy {
          min-height: 54px;
          padding: 7px 8px 8px;
        }
        small {
          display: block;
          color: #766d67;
          font-size: 8px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: .07em;
        }
        strong {
          display: -webkit-box;
          margin-top: 3px;
          overflow: hidden;
          font-size: 10px;
          line-height: 1.25;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .compact {
          gap: 5px;
          padding: 5px;
          border-radius: 15px;
        }
        .compact .piece { border-radius: 10px; }
      `}</style>
    </div>
  );
}
