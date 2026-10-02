export function PageSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="page-skeleton" aria-hidden="true">
      <div className="hero" />
      <div className="line short" />
      <div className="line" />
      <div className="grid">
        {Array.from({ length: rows }).map((_, index) => (
          <div className="tile" key={index} />
        ))}
      </div>
      <style jsx>{`
        .page-skeleton { min-height: 520px; }
        .hero, .line, .tile {
          background: linear-gradient(90deg, #ede5da 20%, #f3eee7 45%, #ede5da 70%);
          background-size: 220% 100%;
          animation: shimmer 1.2s linear infinite;
        }
        .hero { height: 220px; border-radius: 24px; }
        .line { height: 16px; margin-top: 26px; border-radius: 999px; }
        .line.short { width: 34%; margin-top: 32px; }
        .grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-top: 16px;
        }
        .tile { height: 170px; border-radius: 18px; }
        @keyframes shimmer { to { background-position: -220% 0; } }
        @media (min-width: 720px) {
          .hero { height: 300px; }
          .grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          .tile { height: 210px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero, .line, .tile { animation: none; }
        }
      `}</style>
    </div>
  );
}
