import Link from "next/link";
import { Mannequin } from "@/components/mannequin";

export default function LandingPage() {
  const preview = {
    skin: "#6E4936",
    top: "#2A211D",
    bottom: "#B96A4B",
    shoes: "#F5F3EE",
    accent: "#C7F24A"
  };

  return (
    <main className="landing">
      <section className="landing-copy">
        <div className="brand">ewari<span>.</span></div>
        <p className="eyebrow">Personal styling inspiration</p>
        <h1 className="display">Style that feels like you.</h1>
        <p className="intro">
          EWARI learns your taste and gives you complete outfit ideas for your plans, your mood and your way of dressing.
        </p>
        <div className="actions">
          <Link href="/onboarding" className="primary-button">Set up my style</Link>
          <Link href="/home" className="ghost-button">Preview EWARI</Link>
        </div>
        <p className="footnote">No shopping cart. No marketplace. Find the look, then source the pieces your way.</p>
      </section>
      <section className="landing-visual" aria-label="EWARI outfit preview">
        <div className="visual-tag">Lagos Layer</div>
        <Mannequin palette={preview} />
        <div className="visual-meta">
          <span>Streetwear</span>
          <span>Afrocentric</span>
          <span>Relaxed</span>
        </div>
      </section>
      <style jsx>{`
        .landing {
          width: min(1180px, 100%);
          margin: 0 auto;
          min-height: 100vh;
          display: grid;
          align-items: center;
          gap: 34px;
          padding: 28px 20px 42px;
        }
        .brand {
          margin-bottom: 58px;
          font-size: 30px;
          font-weight: 900;
          letter-spacing: -.07em;
        }
        .brand span { color: #b96a4b; }
        h1 { max-width: 680px; }
        .intro {
          max-width: 590px;
          margin: 22px 0 0;
          color: #625a55;
          font-size: clamp(16px, 3.8vw, 19px);
          line-height: 1.55;
        }
        .actions {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
          margin-top: 30px;
          max-width: 440px;
        }
        .actions :global(a) {
          display: grid;
          place-items: center;
        }
        .footnote {
          max-width: 490px;
          margin: 18px 0 0;
          color: #766d67;
          font-size: 12px;
          line-height: 1.55;
        }
        .landing-visual {
          position: relative;
          height: 510px;
          overflow: hidden;
          border-radius: 30px;
          background: #ede5da;
          border: 1px solid rgba(42,33,29,.1);
          box-shadow: 0 28px 70px rgba(42,33,29,.08);
        }
        .visual-tag {
          position: absolute;
          top: 20px;
          left: 20px;
          z-index: 2;
          padding: 9px 13px;
          border-radius: 999px;
          background: #2a211d;
          color: #c7f24a;
          font-size: 12px;
          font-weight: 800;
        }
        .visual-meta {
          position: absolute;
          left: 18px;
          right: 18px;
          bottom: 18px;
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }
        .visual-meta span {
          padding: 8px 11px;
          border-radius: 999px;
          background: rgba(255,253,249,.86);
          font-size: 11px;
          font-weight: 750;
          backdrop-filter: blur(8px);
        }
        @media (min-width: 840px) {
          .landing {
            grid-template-columns: 1.05fr .75fr;
            padding: 40px 42px;
          }
          .brand { margin-bottom: 82px; }
          .actions { grid-template-columns: 1fr 1fr; }
          .landing-visual { height: min(76vh, 700px); }
        }
      `}</style>
    </main>
  );
}
