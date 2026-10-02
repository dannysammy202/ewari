"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/icon";
import { WardrobeLookBoard } from "@/components/wardrobe-look-board";
import {
  isWardrobeLookSaved,
  removeSavedWardrobeLook,
  saveWardrobeLook,
} from "@/lib/store";
import type { WardrobeLook } from "@/lib/wardrobe/types";

type WardrobeLookCardProps = {
  look: WardrobeLook;
  removable?: boolean;
  onRemoved?: (id: string) => void;
};

export function WardrobeLookCard({
  look,
  removable = false,
  onRemoved,
}: WardrobeLookCardProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isWardrobeLookSaved(look.id));
  }, [look.id]);

  function toggleSaved() {
    if (saved) {
      removeSavedWardrobeLook(look.id);
      setSaved(false);
      return;
    }

    saveWardrobeLook(look);
    setSaved(true);
  }

  function remove() {
    removeSavedWardrobeLook(look.id);
    setSaved(false);
    onRemoved?.(look.id);
  }

  return (
    <article className="look-card">
      <WardrobeLookBoard look={look} />

      <div className="meta">
        <div className="copy">
          <p>{look.occasion}</p>
          <h3>{look.title}</h3>
        </div>
        <span className="ready">{look.completeness}% ready</span>
      </div>

      <p className="reason">{look.explanation}</p>

      <div className="actions">
        {removable ? (
          <button className="remove-button" onClick={remove}>
            <Icon name="trash" size={17} />
            Remove
          </button>
        ) : (
          <button className={`save-button ${saved ? "saved" : ""}`} onClick={toggleSaved}>
            <Icon name="bookmark" active={saved} size={17} />
            {saved ? "Saved" : "Save look"}
          </button>
        )}
      </div>

      <style jsx>{`
        .look-card {
          min-width: 0;
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 10px;
          border: 1px solid rgba(42,33,29,.1);
          border-radius: 20px;
          background: #fffdf9;
        }
        .meta {
          display: flex;
          align-items: start;
          justify-content: space-between;
          gap: 10px;
          padding: 12px 2px 0;
        }
        .copy { min-width: 0; }
        .copy p {
          margin: 0 0 3px;
          color: #766d67;
          font-size: 9px;
          font-weight: 800;
          line-height: 1.2;
          text-transform: uppercase;
          letter-spacing: .08em;
        }
        h3 {
          margin: 0;
          min-height: 36px;
          font-size: 15px;
          line-height: 1.2;
          letter-spacing: -.02em;
        }
        .ready {
          flex: 0 0 auto;
          padding: 5px 7px;
          border-radius: 999px;
          background: #dfe7c5;
          font-size: 9px;
          font-weight: 800;
          white-space: nowrap;
        }
        .reason {
          flex: 1;
          min-height: 42px;
          margin: 8px 2px 12px;
          color: #766d67;
          font-size: 10px;
          line-height: 1.45;
        }
        .actions {
          margin-top: auto;
          padding: 0 2px 2px;
        }
        .save-button,
        .remove-button {
          width: 100%;
          min-height: 42px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          border-radius: 12px;
          border: 1px solid rgba(42,33,29,.12);
          background: transparent;
          font-size: 11px;
          font-weight: 780;
        }
        .save-button.saved {
          border-color: #2a211d;
          background: #2a211d;
          color: #c7f24a;
        }
        .remove-button {
          color: #6d4740;
        }
      `}</style>
    </article>
  );
}
