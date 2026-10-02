"use client";

import Link from "next/link";

const demoItems = [
  { name: "Black hoodie", meta: "Streetwear · Oversized" },
  { name: "Ankara trousers", meta: "Afrocentric · Loose" },
  { name: "White sneakers", meta: "Everyday · Relaxed" },
  { name: "Crossbody bag", meta: "Minimal · Black" },
];

export default function LandingPage() {
  return (
    <main className="landing">
      <section className="landing-copy">
        <div className="brand">ewari<span>.</span></div>
        <p className="eyebrow">Your wardrobe, styled around you</p>
        <h1 className="display">Wear more of what you own.</h1>
        <p className="intro">
          Add your clothes, tell EWARI how you like to dress, then get outfit combinations for church, work, dates, events and everyday plans.
        </p>

        <div className="actions">
          <Link href="/onboarding" className="primary-button">Set up my style</Link>
          <Link href="/home" className="ghost-button">Open EWARI</Link>
        </div>

        <p className="footnote">
          EWARI does not sell clothes. It styles your wardrobe first, then points out useful gaps worth filling.
        </p>
      </section>

      <section className="product-preview" aria-label="EWARI wardrobe preview">
        <div className="preview-head">
          <div>
            <p>Your wardrobe</p>
            <strong>4 pieces ready</strong>
          </div>
          <span>Personal</span>
        </div>

        <div className="preview-grid">
          {demoItems.map((item, index) => (
            <article key={item.name} className={`preview-item item-${index + 1}`}>
              <div className="item-shape" aria-hidden="true" />
              <div>
                <strong>{item.name}</strong>
                <span>{item.meta}</span>
              </div>
            </article>
          ))}
        </div>

        <div className="style-prompt">
          <div>
            <p>Style me for</p>
            <strong>Church · Relaxed</strong>
          </div>
          <span>Use my wardrobe</span>
        </div>
      </section>

      <style jsx>{`
        .landing {
          width: min(1180px, 100%);
          min-height: 100vh;
          margin: 0 auto;
          display: grid;
          align-items: center;
          gap: 34px;
          padding:
            max(26px, env(safe-area-inset-top))
            20px
            max(38px, env(safe-area-inset-bottom));
        }
        .brand {
          margin-bottom: 54px;
          font-size: 30px;
          font-weight: 900;
          line-height: 1;
          letter-spacing: -.07em;
        }
        .brand span { color: #b96a4b; }
        h1 {
          max-width: 680px;
          font-size: clamp(52px, 11vw, 88px);
        }
        .intro {
          max-width: 610px;
          margin: 22px 0 0;
          color: #625a55;
          font-size: clamp(15px, 3.8vw, 18px);
          line-height: 1.55;
        }
        .actions {
          display: grid;
          grid-template-columns: 1fr;
          gap: 9px;
          max-width: 440px;
          margin-top: 28px;
        }
        .footnote {
          max-width: 500px;
          margin: 17px 0 0;
          color: #766d67;
          font-size: 11px;
          line-height: 1.5;
        }
        .product-preview {
          padding: 18px;
          border: 1px solid rgba(42,33,29,.1);
          border-radius: 28px;
          background: #2a211d;
          box-shadow: 0 26px 60px rgba(42,33,29,.12);
        }
        .preview-head,
        .style-prompt {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .preview-head {
          min-height: 62px;
          color: #fffdf9;
        }
        .preview-head p,
        .style-prompt p {
          margin: 0 0 3px;
          color: rgba(255,255,255,.6);
          font-size: 9px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: .08em;
        }
        .preview-head strong,
        .style-prompt strong {
          display: block;
          font-size: 14px;
        }
        .preview-head > span {
          padding: 7px 9px;
          border-radius: 999px;
          background: #c7f24a;
          color: #171412;
          font-size: 9px;
          font-weight: 850;
        }
        .preview-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0,1fr));
          gap: 8px;
          margin-top: 10px;
        }
        .preview-item {
          min-width: 0;
          padding: 9px;
          border-radius: 16px;
          background: #fffdf9;
        }
        .item-shape {
          aspect-ratio: 1 / .78;
          margin-bottom: 9px;
          border-radius: 11px;
          background: #ede5da;
        }
        .item-2 .item-shape { background: #b96a4b; }
        .item-3 .item-shape { background: #f0eee9; }
        .item-4 .item-shape { background: #292521; }
        .preview-item strong,
        .preview-item span {
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .preview-item strong { font-size: 11px; }
        .preview-item span {
          margin-top: 3px;
          color: #766d67;
          font-size: 8px;
        }
        .style-prompt {
          margin-top: 10px;
          padding: 14px;
          border-radius: 16px;
          background: #3a302b;
          color: #fffdf9;
        }
        .style-prompt > span {
          padding: 8px 10px;
          border-radius: 999px;
          background: #c7f24a;
          color: #171412;
          font-size: 9px;
          font-weight: 850;
          white-space: nowrap;
        }
        @media (min-width: 840px) {
          .landing {
            grid-template-columns: 1.05fr .82fr;
            gap: 64px;
            padding-left: 42px;
            padding-right: 42px;
          }
          .brand { margin-bottom: 78px; }
          .actions { grid-template-columns: 1fr 1fr; }
          .product-preview { padding: 20px; }
        }
      `}</style>
    </main>
  );
}
