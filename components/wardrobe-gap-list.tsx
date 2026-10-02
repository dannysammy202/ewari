import type { WardrobeGapRecommendation } from "@/lib/wardrobe/types";

export function WardrobeGapList({
  recommendations,
}: {
  recommendations: WardrobeGapRecommendation[];
}) {
  if (!recommendations.length) return null;

  return (
    <div className="gap-list">
      {recommendations.map((item) => (
        <article key={item.id} className="gap-row">
          <div className="priority">{item.priority}</div>
          <div className="copy">
            <small>{item.category}</small>
            <strong>{item.name}</strong>
            <p>{item.reason}</p>
          </div>
          <span>{item.worksWith ? `${item.worksWith} pieces` : "Starter piece"}</span>
        </article>
      ))}

      <style jsx>{`
        .gap-list {
          overflow: hidden;
          border: 1px solid rgba(42,33,29,.1);
          border-radius: 20px;
          background: #fffdf9;
        }
        .gap-row {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: start;
          gap: 12px;
          padding: 15px;
          border-bottom: 1px solid rgba(42,33,29,.09);
        }
        .gap-row:last-child { border-bottom: 0; }
        .priority {
          padding: 5px 7px;
          border-radius: 999px;
          background: #dfe7c5;
          font-size: 8px;
          font-weight: 850;
          text-transform: uppercase;
        }
        .copy { min-width: 0; }
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
          font-size: 13px;
        }
        p {
          margin: 5px 0 0;
          color: #766d67;
          font-size: 10px;
          line-height: 1.4;
        }
        .gap-row > span {
          align-self: center;
          color: #766d67;
          font-size: 9px;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}
