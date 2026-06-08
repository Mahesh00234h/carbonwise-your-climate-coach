import { createFileRoute } from "@tanstack/react-router";
import { Check, Flame } from "lucide-react";
import { useState } from "react";

import { Card, PageHeader } from "@/components/AppShell";
import { HABITS, type HabitId } from "@/lib/app-data";

export const Route = createFileRoute("/_app/habits")({
  component: HabitsPage,
});

function HabitsPage() {
  const [logged, setLogged] = useState<Set<HabitId>>(new Set(["transit", "meatless"]));

  const toggle = (id: HabitId) => {
    setLogged((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const xp = HABITS.filter((h) => logged.has(h.id)).reduce((a, b) => a + b.xp, 0);
  const co2 = HABITS.filter((h) => logged.has(h.id)).reduce((a, b) => a + b.co2, 0);

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        eyebrow="Daily habits"
        title="Log today's eco moves"
        description="Build the streak. Each habit saves real CO₂ and earns XP."
      />

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Card>
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">Today's XP</p>
          <p className="text-3xl font-mono font-bold text-primary mt-2">+{xp}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">CO₂ saved today</p>
          <p className="text-3xl font-mono font-bold text-accent mt-2">{co2.toFixed(1)} kg</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">Current streak</p>
          <p className="text-3xl font-mono font-bold mt-2 flex items-center gap-2">
            12 <Flame className="size-6 text-amber-400" />
          </p>
        </Card>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {HABITS.map((h) => {
          const done = logged.has(h.id);
          return (
            <button
              key={h.id}
              onClick={() => toggle(h.id)}
              className={`flex items-center gap-4 p-4 rounded-2xl border text-left transition-all ${
                done
                  ? "border-primary/40 bg-primary/5"
                  : "border-border bg-surface hover:border-primary/20"
              }`}
            >
              <span className="size-12 rounded-xl bg-background border border-border grid place-items-center text-2xl">
                {h.icon}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold">{h.label}</p>
                <p className="text-xs text-muted-foreground font-mono mt-1">
                  +{h.xp} XP · −{h.co2} kg CO₂
                </p>
              </div>
              <span
                className={`size-6 rounded-full grid place-items-center border ${
                  done ? "bg-primary text-primary-foreground border-primary" : "border-border"
                }`}
              >
                {done ? <Check className="size-3.5" strokeWidth={3} /> : null}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}