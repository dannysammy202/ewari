"use client";

import type { WardrobeItem } from "@/lib/wardrobe/types";

export function WardrobeItemCard({
  item,
  onRemove,
}: {
  item: WardrobeItem;
  onRemove?: (itemId: string) => void;
}) {
  return (
    <article className="wardrobe-card">
      <div className="photo">
        <img src={item.imageDataUrl} alt={item.name} />
        {onRemove && (
          <button onClick={() => onRemove(item.id)} aria-label={`Remove ${item.name}`}>
            Remove
          </button>
        )}
      </div>
      <div className="copy">
        <p>{item.category}</p>
        <h3>{item.name}</h3>
        <span>{item.colour}{item.fit && item.fit !== "Unknown" ? ` · ${item.fit}` : ""}</span>
      </div>

      <style jsx>{`
        .wardrobe-card { min-width: 0; }
        .photo {
          position: relative;
          aspect-ratio: 4 / 5;
          overflow: hidden;
          border-radius: 18px;
          background: #ede5da;
          border: 1px solid rgba(42,33,29,.1);
        }
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        button {
          position: absolute;
          right: 8px;
          top: 8px;
          border: 0;
          border-radius: 999px;
          padding: 7px 9px;
          background: rgba(42,33,29,.88);
          color: #fffdf9;
          font-size: 9px;
          font-weight: 750;
        }
        .copy { padding: 9px 2px 2px; }
        p {
          margin: 0 0 3px;
          color: #766d67;
          font-size: 9px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: .08em;
        }
        h3 {
          margin: 0;
          font-size: 14px;
          line-height: 1.2;
          letter-spacing: -.02em;
        }
        span {
          display: block;
          margin-top: 4px;
          color: #766d67;
          font-size: 10px;
        }
      `}</style>
    </article>
  );
}
