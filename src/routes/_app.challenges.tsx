import { createFileRoute } from "@tanstack/react-router";
import { Trophy } from "lucide-react";

import { Card, PageHeader } from "@/components/AppShell";
import { CHALLENGES } from "@/lib/app-data";

export const Route = createFileRoute("/_app/challenges")({
  component: ChallengesPage,
});

function ChallengesPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        eyebrow="Challenges"
        title="Take on a mission"
        description="Guided multi-day challenges with rewards. Pick one and let the streak begin."
      />

      <div className="grid md:grid-cols-2 gap-5">
        {CHALLENGES.map((c) => {
          const pct = Math.round((c.progress / c.days) * 100);
          const active = c.progress > 0;
          return (
            <Card key={c.id} className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                    {c.days}-day mission
                  </p>
                  <h3 className="text-xl font-bold mt-1">{c.title}</h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono">
                  +{c.xp} XP
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{c.desc}</p>

              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-2 text-muted-foreground">
                  <span>
                    {c.progress} / {c.days} days
                  </span>
                  <span>{pct}%</span>
                </div>
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-aurora" style={{ width: `${pct}%` }} />
                </div>
              </div>

              <button
                className={`mt-auto inline-flex items-center gap-2 justify-center px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? "bg-surface border border-border text-foreground hover:bg-white/5"
                    : "bg-primary text-primary-foreground hover:glow-primary"
                }`}
              >
                <Trophy className="size-4" />
                {active ? "Continue mission" : "Join challenge"}
              </button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
