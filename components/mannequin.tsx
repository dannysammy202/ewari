type MannequinProps = {
  palette: {
    skin: string;
    top: string;
    bottom: string;
    shoes: string;
    accent: string;
  };
  className?: string;
};

export function Mannequin({ palette, className = "" }: MannequinProps) {
  return (
    <div className={`mannequin-wrap ${className}`} aria-label="Outfit mannequin">
      <svg viewBox="0 0 280 420" role="img">
        <ellipse cx="140" cy="395" rx="82" ry="10" fill="rgba(42,33,29,.08)" />
        <circle cx="140" cy="54" r="30" fill={palette.skin} />
        <path d="M127 82h26l7 27h-40z" fill={palette.skin} />
        <path d="M94 110c14-16 78-16 92 0l12 117H82z" fill={palette.top} />
        <path d="M91 113 58 211c-4 12 10 18 16 7l38-88z" fill={palette.skin} />
        <path d="m189 113 33 98c4 12-10 18-16 7l-38-88z" fill={palette.skin} />
        <path d="M90 220h100l-10 126h-40l-5-88-6 88H90z" fill={palette.bottom} />
        <path d="M88 343h43l-8 39H78c-4-17 1-29 10-39Z" fill={palette.shoes} />
        <path d="M149 343h43c9 10 14 22 10 39h-45z" fill={palette.shoes} />
        <path d="M185 134c-20 24-45 43-75 57" fill="none" stroke={palette.accent} strokeWidth="6" strokeLinecap="round" opacity=".85" />
        <rect x="103" y="183" width="36" height="31" rx="8" fill={palette.accent} opacity=".95" />
        <path d="M106 115c17 9 51 9 68 0" fill="none" stroke="rgba(255,255,255,.22)" strokeWidth="3" />
      </svg>
      <style jsx>{`
        .mannequin-wrap {
          display: grid;
          place-items: center;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        svg { width: min(100%, 300px); height: 100%; }
      `}</style>
    </div>
  );
}
