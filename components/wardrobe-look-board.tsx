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
          <img src={item.imageDataUrl} alt={item.name} />
          {!compact && (
            <div>
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
          gap: 8px;
          width: 100%;
          padding: 8px;
          border-radius: 20px;
          background: #ede5da;
        }
        .piece {
          min-width: 0;
          overflow: hidden;
          border-radius: 14px;
          background: #fffdf9;
        }
        img {
          width: 100%;
          aspect-ratio: 1 / 1;
          object-fit: cover;
        }
        .piece div { padding: 8px; }
        small {
          display: block;
          color: #766d67;
          font-size: 8px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: .08em;
        }
        strong {
          display: block;
          margin-top: 2px;
          font-size: 10px;
          line-height: 1.2;
        }
        .compact { gap: 5px; padding: 5px; border-radius: 16px; }
        .compact .piece { border-radius: 11px; }
      `}</style>
    </div>
  );
}
