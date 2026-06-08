import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Flame, Leaf, TrendingDown } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, PageHeader } from "@/components/AppShell";
import {
  emissionBreakdown,
  kgToKm,
  monthlyEmissions,
  tonsToTrees,
  weeklyEmissions,
} from "@/lib/app-data";

export const Route = createFileRoute("/_app/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const monthly = emissionBreakdown.reduce((a, b) => a + b.kg, 0);
  const dailyAvg = (weeklyEmissions.reduce((a, b) => a + b.kg, 0) / 7).toFixed(1);

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        eyebrow="Carbon intelligence"
        title="Your footprint, in plain language"
        description="Every kilogram, translated into something you can feel."
      >
        <div className="flex gap-3">
          <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-mono border border-primary/20">
            🔥 12 day streak
          </span>
        </div>
      </PageHeader>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Today"
          value={`${weeklyEmissions[6].kg} kg`}
          delta="−18%"
          accent
          hint="vs your daily average"
        />
        <StatCard label="This week" value={`${weeklyEmissions.reduce((a, b) => a + b.kg, 0).toFixed(0)} kg`} delta="−9%" hint="vs last week" />
        <StatCard label="This month" value={`${monthly} kg`} delta="−12%" hint={`= ${kgToKm(monthly)} km driven`} />
        <StatCard label="Sustainability score" value="78" delta="+6" hint="Green Warrior tier" accent />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">Daily trend</p>
              <h2 className="text-xl font-bold">Last 30 days</h2>
            </div>
            <div className="flex items-center gap-1 text-primary font-mono text-sm">
              <TrendingDown className="size-4" /> Down 12% MoM
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyEmissions} margin={{ left: -20, right: 0, top: 10 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="2 4" vertical={false} />
                <XAxis dataKey="date" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="kg"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  fill="url(#g1)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono mb-1">Breakdown</p>
          <h2 className="text-xl font-bold mb-4">By source</h2>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={emissionBreakdown}
                  dataKey="kg"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={2}
                  stroke="var(--color-background)"
                >
                  {emissionBreakdown.map((d) => (
                    <Cell key={d.source} fill={d.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="space-y-2 mt-2 text-sm">
            {emissionBreakdown.map((d) => (
              <li key={d.source} className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full" style={{ background: d.color }} />
                  {d.source}
                </span>
                <span className="font-mono text-muted-foreground">{d.kg} kg</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="bg-aurora text-primary-foreground">
          <p className="text-xs uppercase tracking-widest opacity-80 font-mono mb-2">AI suggestion</p>
          <p className="text-lg font-bold leading-snug mb-4">
            Your Tuesday commute is your largest emission source. Swapping it for the 8:15 express train this week
            saves about <span className="underline decoration-2 underline-offset-4">28 kg CO₂</span>.
          </p>
          <Link
            to="/coach"
            className="inline-flex items-center gap-2 text-sm font-bold bg-foreground/10 hover:bg-foreground/20 transition-colors px-4 py-2 rounded-lg"
          >
            Build a plan with coach <ArrowUpRight className="size-4" />
          </Link>
        </Card>

        <Card>
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono mb-2">In real life</p>
          <p className="text-lg font-bold mb-4">Your monthly emissions equal…</p>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3"><Leaf className="size-4 text-primary mt-0.5" /> {kgToKm(monthly)} km driven in an average car</li>
            <li className="flex gap-3"><Leaf className="size-4 text-primary mt-0.5" /> {tonsToTrees(monthly)} trees to absorb in a year</li>
            <li className="flex gap-3"><Leaf className="size-4 text-primary mt-0.5" /> Powering a fridge for {Math.round(monthly / 1.2)} days</li>
          </ul>
        </Card>

        <Card>
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono mb-2">Average</p>
          <p className="text-lg font-bold mb-4">Daily impact</p>
          <p className="font-mono text-5xl text-primary font-bold">{dailyAvg}<span className="text-base text-muted-foreground"> kg/day</span></p>
          <div className="mt-4 h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary" style={{ width: "60%" }} />
          </div>
          <p className="text-xs text-muted-foreground mt-2">National avg: 22 kg/day · You're 36% lower</p>
          <div className="flex items-center gap-2 mt-4 text-xs text-accent font-mono">
            <Flame className="size-3" /> 12-day reduction streak
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  delta,
  hint,
  accent,
}: {
  label: string;
  value: string;
  delta: string;
  hint: string;
  accent?: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-5 ${accent ? "border-primary/30 bg-primary/5" : "border-border bg-surface"}`}>
      <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">{label}</p>
      <p className={`text-3xl font-mono font-bold mt-2 ${accent ? "text-primary" : "text-foreground"}`}>{value}</p>
      <p className="text-xs mt-1 flex items-center gap-1.5">
        <span className="text-accent font-mono font-semibold">{delta}</span>
        <span className="text-muted-foreground">{hint}</span>
      </p>
    </div>
  );
}