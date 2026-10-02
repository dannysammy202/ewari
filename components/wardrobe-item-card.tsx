"use client";

import { Icon } from "@/components/icon";
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
          <button className="remove" onClick={() => onRemove(item.id)} aria-label={`Remove ${item.name}`}>
            <Icon name="trash" size={16} />
          </button>
        )}
      </div>

      <div className="copy">
        <p>{item.category}</p>
        <h3>{item.name}</h3>
        <span>{item.colour}{item.fit && item.fit !== "Unknown" ? ` · ${item.fit}` : ""}</span>
      </div>

      <style jsx>{`
        .wardrobe-card {
          min-width: 0;
          display: flex;
          flex-direction: column;
        }
        .photo {
          position: relative;
          aspect-ratio: 4 / 5;
          display: grid;
          place-items: center;
          overflow: hidden;
          border-radius: 17px;
          background: #fffdf9;
          border: 1px solid rgba(42,33,29,.1);
        }
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .remove {
          position: absolute;
          right: 8px;
          top: 8px;
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255,255,255,.18);
          border-radius: 50%;
          background: rgba(42,33,29,.9);
          color: #fffdf9;
        }
        .copy {
          min-height: 72px;
          padding: 9px 2px 2px;
        }
        p {
          margin: 0 0 3px;
          color: #766d67;
          font-size: 9px;
          font-weight: 800;
          line-height: 1.2;
          text-transform: uppercase;
          letter-spacing: .08em;
        }
        h3 {
          display: -webkit-box;
          margin: 0;
          overflow: hidden;
          font-size: 14px;
          line-height: 1.2;
          letter-spacing: -.02em;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        span {
          display: block;
          margin-top: 4px;
          overflow: hidden;
          color: #766d67;
          font-size: 10px;
          line-height: 1.2;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `}</style>
    </article>
  );
}
