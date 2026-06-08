import { createFileRoute } from "@tanstack/react-router";
import { Download, FileBarChart2 } from "lucide-react";

import { Card, PageHeader } from "@/components/AppShell";

export const Route = createFileRoute("/_app/reports")({
  component: ReportsPage,
});

const REPORTS = [
  {
    period: "Week of Nov 24 – Nov 30",
    headline: "−14% vs last week",
    summary:
      "Your transport emissions dropped sharply thanks to two transit swaps. Energy use was flat. One area to watch: weekend food shopping.",
    wins: ["Cycled to work twice", "3 plant-based dinners", "Joined Green Commute challenge"],
    focus: ["Plan meals before shopping", "Switch one weekend drive for transit"],
  },
  {
    period: "November 2026",
    headline: "−12% vs October",
    summary:
      "A strong month. Transport remains your largest source, but your trend line is now consistently below the city average for the first time.",
    wins: ["12-day habit streak", "Completed Plastic-Free Week", "Energy use −9%"],
    focus: ["Try one car-free weekend", "Consider quoting solar for spring"],
  },
];

function ReportsPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        eyebrow="Smart reports"
        title="Insightful, not exhausting"
        description="Auto-generated weekly and monthly briefings. Read in under a minute."
      />

      <div className="space-y-6">
        {REPORTS.map((r) => (
          <Card key={r.period}>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{r.period}</p>
                <h2 className="text-2xl font-bold mt-1">Sustainability briefing</h2>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-mono font-bold">
                  {r.headline}
                </span>
                <button
                  className="size-9 rounded-lg border border-border grid place-items-center hover:bg-white/5"
                  aria-label="Download report"
                >
                  <Download className="size-4" />
                </button>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed mb-6">{r.summary}</p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-background border border-border">
                <p className="text-xs font-mono uppercase tracking-widest text-accent mb-3">Wins</p>
                <ul className="space-y-2 text-sm">
                  {r.wins.map((w) => (
                    <li key={w} className="flex gap-2">
                      <span className="text-accent">✓</span> {w}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 rounded-xl bg-background border border-border">
                <p className="text-xs font-mono uppercase tracking-widest text-primary mb-3">Focus next</p>
                <ul className="space-y-2 text-sm">
                  {r.focus.map((f) => (
                    <li key={f} className="flex gap-2">
                      <FileBarChart2 className="size-3.5 text-primary shrink-0 mt-0.5" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}