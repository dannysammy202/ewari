"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ACCESSORIES,
  BUDGETS,
  COLOUR_OPTIONS,
  FIT_OPTIONS,
  FOOTWEAR,
  OCCASIONS,
  STYLE_OPTIONS
} from "@/lib/data";
import { getProfile, saveProfile } from "@/lib/store";
import type { StyleProfile } from "@/lib/types";
import { Icon } from "@/components/icon";

type MultiKey = "styles" | "fits" | "colours" | "occasions" | "footwear" | "accessories";

const initialProfile: StyleProfile = {
  presentation: "",
  styles: [],
  fits: [],
  colours: [],
  avoidedColours: [],
  occasions: [],
  footwear: [],
  accessories: [],
  budget: ""
};

const steps = [
  { key: "presentation", title: "Who are you dressing for?", subtitle: "Choose the clothing direction you want EWARI to learn.", options: ["Menswear", "Womenswear", "Both"], multi: false },
  { key: "styles", title: "Which styles feel most like you?", subtitle: "Pick up to five. EWARI uses these with your wardrobe.", options: STYLE_OPTIONS, multi: true },
  { key: "fits", title: "How do you like your clothes to fit?", subtitle: "Select every fit you enjoy wearing.", options: FIT_OPTIONS, multi: true },
  { key: "colours", title: "Which colours do you reach for?", subtitle: "These guide combinations and wardrobe-gap suggestions.", options: COLOUR_OPTIONS, multi: true },
  { key: "occasions", title: "What do you dress for most?", subtitle: "EWARI will prioritise useful combinations for your routine.", options: OCCASIONS, multi: true },
  { key: "footwear", title: "What shoes do you reach for?", subtitle: "Choose the footwear you enjoy wearing most.", options: FOOTWEAR, multi: true },
  { key: "accessories", title: "Which accessories are your thing?", subtitle: "These help EWARI finish your outfit combinations.", options: ACCESSORIES, multi: true },
  { key: "budget", title: "What do you usually spend on a full outfit?", subtitle: "EWARI uses this when it suggests wardrobe gaps worth buying.", options: BUDGETS, multi: false }
] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<StyleProfile>(initialProfile);
  const [readyToRender, setReadyToRender] = useState(false);

  useEffect(() => {
    const existing = getProfile();
    if (existing) setProfile(existing);
    setReadyToRender(true);
  }, []);

  const current = steps[step];
  const progress = ((step + 1) / steps.length) * 100;

  const selected = useMemo(() => {
    const key = current.key;
    const value = profile[key as keyof StyleProfile];
    return Array.isArray(value) ? value : value ? [value] : [];
  }, [current.key, profile]);

  function choose(option: string) {
    const key = current.key;

    if (current.multi) {
      const multiKey = key as MultiKey;
      const existing = profile[multiKey];
      const next = existing.includes(option)
        ? existing.filter((value) => value !== option)
        : [...existing, option];
      const limited = multiKey === "styles" ? next.slice(0, 5) : next;

      setProfile({ ...profile, [multiKey]: limited });
      return;
    }

    setProfile({ ...profile, [key]: option });
  }

  function next() {
    if (step < steps.length - 1) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    saveProfile(profile);
    router.push("/wardrobe?setup=1");
  }

  function back() {
    if (step === 0) {
      router.back();
      return;
    }

    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const ready = readyToRender && selected.length > 0;

  return (
    <main className="onboarding">
      <header className="onboarding-top">
        <button className="back" onClick={back} aria-label="Go back">
          <Icon name="arrow-left-2" size={20} />
        </button>
        <div className="brand">ewari<span>.</span></div>
        <div className="step-count">{step + 1}/{steps.length}</div>
      </header>

      <div className="progress-track" aria-hidden="true">
        <div style={{ width: `${progress}%` }} />
      </div>

      <section className="question">
        <div className="question-copy">
          <p className="eyebrow">Your style profile</p>
          <h1 className="display">{current.title}</h1>
          <p className="subtitle">{current.subtitle}</p>
        </div>

        {!readyToRender ? (
          <div className="options-loading" aria-hidden="true">
            {Array.from({ length: 6 }).map((_, index) => <div key={index} />)}
          </div>
        ) : (
          <div className="options">
            {current.options.map((option) => {
              const active = selected.includes(option);

              return (
                <button
                  key={option}
                  className={`option ${active ? "active" : ""}`}
                  onClick={() => choose(option)}
                  aria-pressed={active}
                >
                  <span>{option}</span>
                  <span className="check">
                    {active ? <Icon name="tick-circle" active size={19} /> : null}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </section>

      <footer className="onboarding-footer">
        <button className="primary-button" onClick={next} disabled={!ready}>
          {step === steps.length - 1 ? "Save and add my clothes" : "Continue"}
        </button>
      </footer>

      <style jsx>{`
        .onboarding {
          width: min(760px, 100%);
          margin: 0 auto;
          min-height: 100vh;
          padding:
            max(18px, env(safe-area-inset-top))
            20px
            calc(112px + env(safe-area-inset-bottom));
        }
        .onboarding-top {
          display: grid;
          grid-template-columns: 44px 1fr 44px;
          align-items: center;
          gap: 12px;
          min-height: 44px;
        }
        .back {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(42,33,29,.12);
          border-radius: 50%;
          background: #fffdf9;
        }
        .brand {
          text-align: center;
          font-size: 22px;
          font-weight: 900;
          line-height: 1;
          letter-spacing: -.06em;
        }
        .brand span { color: #b96a4b; }
        .step-count {
          text-align: right;
          color: #766d67;
          font-size: 11px;
          font-weight: 700;
        }
        .progress-track {
          height: 4px;
          margin: 20px 0 46px;
          overflow: hidden;
          border-radius: 99px;
          background: #e4dbcf;
        }
        .progress-track div {
          height: 100%;
          border-radius: inherit;
          background: #2a211d;
          transition: width .22s ease;
        }
        .question { max-width: 650px; }
        .question-copy {
          min-height: 176px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
        }
        h1 {
          max-width: 620px;
          font-size: clamp(38px, 8vw, 58px);
        }
        .subtitle {
          max-width: 560px;
          margin: 16px 0 0;
          color: #766d67;
          font-size: 13px;
          line-height: 1.5;
        }
        .options,
        .options-loading {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-top: 24px;
        }
        .option,
        .options-loading div {
          min-height: 68px;
          border-radius: 15px;
        }
        .option {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 13px 14px;
          border: 1px solid rgba(42,33,29,.12);
          background: #fffdf9;
          color: #171412;
          text-align: left;
          font-size: 13px;
          font-weight: 720;
          line-height: 1.2;
        }
        .option.active {
          border-color: #2a211d;
          background: #2a211d;
          color: #c7f24a;
        }
        .check {
          flex: 0 0 20px;
          min-height: 20px;
          display: grid;
          place-items: center;
        }
        .options-loading div {
          background: linear-gradient(90deg, #ede5da 20%, #f3eee7 45%, #ede5da 70%);
          background-size: 220% 100%;
          animation: shimmer 1.2s linear infinite;
        }
        .onboarding-footer {
          position: fixed;
          left: 50%;
          bottom: 0;
          z-index: 10;
          width: min(760px, 100%);
          transform: translateX(-50%);
          padding:
            18px 20px
            max(20px, env(safe-area-inset-bottom));
          background: linear-gradient(180deg, rgba(247,243,236,0), #f7f3ec 30%);
        }
        .onboarding-footer button { width: 100%; }
        @keyframes shimmer { to { background-position: -220% 0; } }
        @media (min-width: 620px) {
          .options,
          .options-loading {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
          .onboarding { padding-top: 30px; }
        }
        @media (max-width: 420px) {
          .onboarding { padding-left: 16px; padding-right: 16px; }
          .question-copy { min-height: 188px; }
          .onboarding-footer { padding-left: 16px; padding-right: 16px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .options-loading div { animation: none; }
        }
      `}</style>
    </main>
  );
}
