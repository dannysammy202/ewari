"use client";

import { useMemo, useState } from "react";
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
import { saveProfile } from "@/lib/store";
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
  { key: "styles", title: "Which styles feel most like you?", subtitle: "Pick up to five. Your feed starts here.", options: STYLE_OPTIONS, multi: true },
  { key: "fits", title: "How do you like your clothes to fit?", subtitle: "Select every fit you enjoy wearing.", options: FIT_OPTIONS, multi: true },
  { key: "colours", title: "Which colours do you reach for?", subtitle: "We will use these as a guide, not a restriction.", options: COLOUR_OPTIONS, multi: true },
  { key: "occasions", title: "What do you dress for most?", subtitle: "EWARI will prioritise useful looks for your routine.", options: OCCASIONS, multi: true },
  { key: "footwear", title: "What shoes do you reach for?", subtitle: "Choose as many as you wear often.", options: FOOTWEAR, multi: true },
  { key: "accessories", title: "Which accessories are your thing?", subtitle: "These help finish each combination.", options: ACCESSORIES, multi: true },
  { key: "budget", title: "What do you usually spend on a full outfit?", subtitle: "This helps keep suggestions within your normal range.", options: BUDGETS, multi: false }
] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<StyleProfile>(initialProfile);

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
      return;
    }
    saveProfile(profile);
    router.push("/wardrobe?setup=1");
  }

  const ready = selected.length > 0;

  return (
    <main className="onboarding">
      <div className="onboarding-top">
        <button className="back" onClick={() => step === 0 ? router.push("/") : setStep(step - 1)} aria-label="Go back">
          <Icon name="arrow-left-2" size={21} />
        </button>
        <div className="brand">ewari<span>.</span></div>
        <div className="step-count">{step + 1}/{steps.length}</div>
      </div>

      <div className="progress-track"><div style={{ width: `${progress}%` }} /></div>

      <section className="question">
        <p className="eyebrow">Your style profile</p>
        <h1 className="display">{current.title}</h1>
        <p className="subtitle">{current.subtitle}</p>

        <div className="options">
          {current.options.map((option) => {
            const active = selected.includes(option);
            return (
              <button key={option} className={`option ${active ? "active" : ""}`} onClick={() => choose(option)}>
                <span>{option}</span>
                <span className="check">{active ? <Icon name="tick-circle" active size={20} /> : null}</span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="onboarding-footer">
        <button className="primary-button" onClick={next} disabled={!ready}>
          {step === steps.length - 1 ? "Add my clothes" : "Continue"}
        </button>
      </div>

      <style jsx>{`
        .onboarding {
          width: min(760px, 100%);
          margin: 0 auto;
          min-height: 100vh;
          padding: 20px 20px 110px;
        }
        .onboarding-top {
          display: grid;
          grid-template-columns: 44px 1fr 44px;
          align-items: center;
          gap: 12px;
        }
        .back {
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          border: 1px solid rgba(42,33,29,.12);
          border-radius: 50%;
          background: #fffdf9;
        }
        .brand {
          text-align: center;
          font-size: 22px;
          font-weight: 900;
          letter-spacing: -.06em;
        }
        .brand span { color: #b96a4b; }
        .step-count { text-align: right; font-size: 12px; color: #766d67; font-weight: 700; }
        .progress-track {
          height: 4px;
          margin: 20px 0 54px;
          overflow: hidden;
          border-radius: 99px;
          background: #e4dbcf;
        }
        .progress-track div { height: 100%; background: #2a211d; transition: width .25s ease; }
        .question { max-width: 650px; }
        h1 { max-width: 620px; }
        .subtitle { margin: 18px 0 0; color: #766d67; line-height: 1.55; }
        .options {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-top: 32px;
        }
        .option {
          min-height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 14px 15px;
          border-radius: 16px;
          border: 1px solid rgba(42,33,29,.12);
          background: #fffdf9;
          color: #171412;
          text-align: left;
          font-weight: 720;
        }
        .option.active { border-color: #2a211d; background: #2a211d; color: #c7f24a; }
        .check { min-width: 20px; display: grid; place-items: center; }
        .onboarding-footer {
          position: fixed;
          left: 50%;
          bottom: 0;
          z-index: 10;
          width: min(760px, 100%);
          transform: translateX(-50%);
          padding: 16px 20px 22px;
          background: linear-gradient(180deg, rgba(247,243,236,0), #f7f3ec 26%);
        }
        .onboarding-footer button { width: 100%; }
        .onboarding-footer button:disabled { opacity: .35; cursor: not-allowed; }
        @media (min-width: 620px) {
          .options { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          .onboarding { padding-top: 32px; }
        }
      `}</style>
    </main>
  );
}
