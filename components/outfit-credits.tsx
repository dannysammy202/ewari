import type { OutfitImage } from "@/lib/outfit-images/types";

export function OutfitCredits({ images }: { images: OutfitImage[] }) {
  if (!images.length) return null;

  return (
    <details className="credits">
      <summary>Image credits</summary>
      <div>
        {images.map((image) => (
          <p key={image.itemId}>
            {image.sourceUrl ? (
              <a href={image.sourceUrl} target="_blank" rel="noreferrer">
                {image.title}
              </a>
            ) : (
              image.title
            )}
            {" · "}{image.creator} · {image.license}
          </p>
        ))}
        <p>Images sourced through Openverse.</p>
      </div>

      <style jsx>{`
        .credits {
          position: absolute;
          right: 12px;
          bottom: 10px;
          z-index: 8;
          max-width: 260px;
          font-size: 9px;
          color: #625a55;
        }
        summary {
          width: max-content;
          margin-left: auto;
          padding: 5px 8px;
          border-radius: 999px;
          background: rgba(255,253,249,.88);
          cursor: pointer;
          font-weight: 750;
        }
        .credits div {
          margin-top: 6px;
          padding: 9px 10px;
          border-radius: 12px;
          background: rgba(255,253,249,.96);
          box-shadow: 0 8px 24px rgba(42,33,29,.09);
        }
        p { margin: 0 0 5px; line-height: 1.25; }
        p:last-child { margin-bottom: 0; }
        a { text-decoration: underline; text-underline-offset: 2px; }
      `}</style>
    </details>
  );
}
