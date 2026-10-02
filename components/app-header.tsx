"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { Icon } from "@/components/icon";

type AppHeaderProps = {
  eyebrow?: string;
  title: string;
  backHref?: string;
  action?: ReactNode;
  compact?: boolean;
};

export function AppHeader({
  eyebrow,
  title,
  backHref,
  action,
  compact = false,
}: AppHeaderProps) {
  const router = useRouter();

  const backControl = backHref ? (
    <Link href={backHref} className="back-control" aria-label="Go back">
      <Icon name="arrow-left-2" size={20} />
    </Link>
  ) : null;

  return (
    <header className={`app-header ${compact ? "compact" : ""}`}>
      {backControl}
      <div className="title-block">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="display">{title}</h1>
      </div>
      {action && <div className="header-action">{action}</div>}
      {!backHref && !action && <div className="header-spacer" aria-hidden="true" />}

      <style jsx>{`
        .app-header {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          align-items: center;
          gap: 14px;
          min-height: 78px;
          margin-bottom: 26px;
        }
        .app-header:not(:has(.back-control)) {
          grid-template-columns: minmax(0, 1fr) auto;
        }
        .title-block { min-width: 0; }
        .title-block :global(.eyebrow) { margin-bottom: 5px; }
        .title-block h1 {
          font-size: clamp(38px, 8vw, 58px);
          line-height: .98;
          text-wrap: balance;
        }
        .app-header.compact .title-block h1 {
          font-size: clamp(34px, 7vw, 48px);
        }
        .back-control {
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(42,33,29,.12);
          border-radius: 50%;
          background: #fffdf9;
          color: #171412;
        }
        .header-action {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          min-width: 44px;
        }
        .header-spacer { width: 1px; }
        @media (max-width: 480px) {
          .app-header { gap: 10px; min-height: 70px; margin-bottom: 22px; }
          .title-block h1 { font-size: clamp(36px, 11vw, 48px); }
        }
      `}</style>
    </header>
  );
}
