import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";

import { Card, PageHeader } from "@/components/AppShell";
import { LEADERBOARD } from "@/lib/app-data";

export const Route = createFileRoute("/_app/community")({
  component: CommunityPage,
});

function CommunityPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        eyebrow="Community impact hub"
        title="We're moving the needle together"
        description="See what the CarbonWise community has achieved this month."
      />

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <CollectiveStat value="1.2M kg" label="CO₂ avoided this month" />
        <CollectiveStat value="57,142" label="Trees-equivalent planted" accent />
        <CollectiveStat value="892K" label="Habits logged collectively" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <Users className="size-4 text-primary" />
            <h2 className="text-xl font-bold">Global leaderboard</h2>
          </div>
          <ul className="divide-y divide-border">
            {LEADERBOARD.map((row, i) => (
              <li
                key={row.name}
                className={`flex items-center gap-4 py-3 ${row.you ? "bg-primary/5 -mx-2 px-2 rounded-xl" : ""}`}
              >
                <span className="size-8 grid place-items-center rounded-full bg-background border border-border font-mono text-xs">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="font-semibold">
                    {row.name}
                    {row.you ? <span className="text-primary text-xs ml-2">YOU</span> : null}
                  </p>
                  <p className="text-xs text-muted-foreground">{row.badge}</p>
                </div>
                <p className="font-mono text-primary font-bold">{row.xp.toLocaleString()} XP</p>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="bg-aurora text-primary-foreground">
          <p className="text-xs font-mono uppercase tracking-widest opacity-80 mb-2">
            Collective milestone
          </p>
          <p className="text-2xl font-bold leading-snug mb-4">
            "Our community has saved enough CO₂ to equal planting 57,142 trees this month."
          </p>
          <p className="text-sm opacity-80">Keep going — next milestone unlocks at 75K.</p>
        </Card>
      </div>
    </div>
  );
}

function CollectiveStat({
  value,
  label,
  accent,
}: {
  value: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <Card>
      <p className={`font-mono text-3xl font-bold ${accent ? "text-accent" : "text-primary"}`}>
        {value}
      </p>
      <p className="text-xs text-muted-foreground uppercase tracking-widest mt-2">{label}</p>
    </Card>
  );
}
