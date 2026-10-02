"use client";

import { WardrobeLookBoard } from "@/components/wardrobe-look-board";
import type { WardrobeLook } from "@/lib/wardrobe/types";

export function WardrobeLookCard({ look }: { look: WardrobeLook }) {
  return (
    <article className="look-card">
      <WardrobeLookBoard look={look} />
      <div className="copy">
        <div>
          <p>{look.occasion}</p>
          <h3>{look.title}</h3>
        </div>
        <span>{look.completeness}% ready</span>
      </div>
      <p className="reason">{look.explanation}</p>

      <style jsx>{`
        .look-card {
          min-width: 0;
          padding: 10px;
          border: 1px solid rgba(42,33,29,.1);
          border-radius: 22px;
          background: #fffdf9;
        }
        .copy {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 10px;
          padding: 12px 2px 0;
        }
        .copy p {
          margin: 0 0 3px;
          color: #766d67;
          font-size: 9px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: .08em;
        }
        h3 {
          margin: 0;
          font-size: 15px;
          letter-spacing: -.02em;
        }
        .copy > span {
          flex: 0 0 auto;
          padding: 5px 7px;
          border-radius: 999px;
          background: #dfe7c5;
          font-size: 9px;
          font-weight: 800;
        }
        .reason {
          margin: 9px 2px 2px;
          color: #766d67;
          font-size: 10px;
          line-height: 1.4;
        }
      `}</style>
    </article>
  );
}
