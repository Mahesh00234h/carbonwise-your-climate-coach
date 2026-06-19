import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Get started — CarbonWise" },
      { name: "description", content: "Build your sustainability profile in 6 quick steps." },
    ],
  }),
  component: Onboarding,
});

type Step = {
  key: string;
  title: string;
  subtitle: string;
  options: string[];
  multi?: boolean;
};

const STEPS: Step[] = [
  {
    key: "transport",
    title: "How do you usually get around?",
    subtitle: "We'll model your transport emissions from this.",
    options: ["Car (mostly alone)", "Public transport", "Bike / walk", "Mix of all"],
  },
  {
    key: "food",
    title: "What does your plate usually look like?",
    subtitle: "Diet is one of the biggest levers.",
    options: [
      "Meat with most meals",
      "Meat a few times/week",
      "Mostly plant-based",
      "Fully plant-based",
    ],
  },
  {
    key: "energy",
    title: "Your home energy setup?",
    subtitle: "Helps estimate your household footprint.",
    options: ["Grid electricity", "Some renewables", "Solar / mostly green", "Not sure"],
  },
  {
    key: "shopping",
    title: "How would you describe your shopping?",
    subtitle: "Clothes, electronics, household goods.",
    options: ["Frequent buyer", "Average", "Minimalist", "Second-hand first"],
  },
  {
    key: "travel",
    title: "How often do you fly?",
    subtitle: "Even one long flight changes the math.",
    options: ["Never", "1–2 short trips/year", "A few times/year", "Frequently"],
  },
  {
    key: "goal",
    title: "What's your goal?",
    subtitle: "We'll personalize your plan to this.",
    options: [
      "Cut footprint 20%",
      "Build greener habits",
      "Hit net-zero personally",
      "Just curious",
    ],
  },
];

function Onboarding() {
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate({ to: "/auth" });
    });
  }, [navigate]);

  const step = STEPS[stepIndex];
  const pct = ((stepIndex + 1) / STEPS.length) * 100;

  const choose = (option: string) => {
    setAnswers((a) => ({ ...a, [step.key]: option }));
  };

  const next = async () => {
    if (stepIndex < STEPS.length - 1) {
      setStepIndex((i) => i + 1);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const { data: sess } = await supabase.auth.getSession();
      const uid = sess.session?.user.id;
      if (!uid) {
        navigate({ to: "/auth" });
        return;
      }
      const { error } = await supabase
        .from("profiles")
        .update({ onboarding: answers })
        .eq("id", uid);
      if (error) throw error;
      navigate({ to: "/dashboard" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-6 bg-primary rounded-full ring-4 ring-primary/20" aria-hidden />
          <span className="font-mono font-bold tracking-tighter uppercase">CarbonWise</span>
        </Link>
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
          Step {stepIndex + 1} / {STEPS.length}
        </p>
      </nav>
      <div className="h-1 bg-secondary">
        <div className="h-full bg-aurora transition-all" style={{ width: `${pct}%` }} />
      </div>

      <div className="flex-1 grid place-items-center px-6 py-12">
        <div className="w-full max-w-xl animate-fade-up">
          <p className="text-xs font-mono uppercase tracking-widest text-primary mb-3">
            Build your profile
          </p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">{step.title}</h1>
          <p className="text-muted-foreground mb-8">{step.subtitle}</p>

          <div className="grid gap-3 mb-8">
            {step.options.map((opt) => {
              const selected = answers[step.key] === opt;
              return (
                <button
                  key={opt}
                  onClick={() => choose(opt)}
                  className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
                    selected
                      ? "border-primary bg-primary/10"
                      : "border-border bg-surface hover:border-primary/30"
                  }`}
                >
                  <span className="font-medium">{opt}</span>
                  <span
                    className={`size-5 rounded-full grid place-items-center border ${
                      selected
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border"
                    }`}
                  >
                    {selected ? <Check className="size-3" strokeWidth={3} /> : null}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
              disabled={stepIndex === 0}
              className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-30"
            >
              Back
            </button>
            <button
              onClick={next}
              disabled={!answers[step.key] || saving}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-40 hover:glow-primary transition-all"
            >
              {saving ? "Saving…" : stepIndex === STEPS.length - 1 ? "Enter dashboard" : "Continue"}
              <ArrowRight className="size-4" />
            </button>
          </div>
          {error ? <p className="text-sm text-destructive mt-4">{error}</p> : null}
        </div>
      </div>
    </div>
  );
}
