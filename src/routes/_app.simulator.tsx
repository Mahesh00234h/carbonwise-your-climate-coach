import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, TrendingDown } from "lucide-react";
import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, PageHeader } from "@/components/AppShell";

export const Route = createFileRoute("/_app/simulator")({
  component: Simulator,
});

const BASE_MONTHLY = 428;

function Simulator() {
  const [transit, setTransit] = useState(2); // days/week
  const [meatless, setMeatless] = useState(1); // days/week
  const [solar, setSolar] = useState(false);
  const [energyCut, setEnergyCut] = useState(0); // %

  const monthlySavings = useMemo(() => {
    const t = transit * 4.3 * 4.8; // kg/month from swapping car for transit
    const m = meatless * 4.3 * 2.8; // veg meal savings
    const s = solar ? 90 : 0;
    const e = (energyCut / 100) * 86; // 86 kg energy baseline
    return Math.round(t + m + s + e);
  }, [transit, meatless, solar, energyCut]);

  const annual = monthlySavings * 12;
  const newMonthly = Math.max(0, BASE_MONTHLY - monthlySavings);

  const projection = Array.from({ length: 12 }, (_, i) => ({
    month: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][i],
    current: BASE_MONTHLY,
    projected: Math.round(BASE_MONTHLY - monthlySavings * Math.min(1, (i + 1) / 3)),
  }));

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        eyebrow="What-if simulator"
        title="Tinker with your life. See your future."
        description="Move the sliders. Instant projection of monthly and annual impact."
      />

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-6">
            Adjust your lifestyle
          </p>
          <div className="space-y-8">
            <Slider
              label="Swap car for public transport"
              value={transit}
              max={5}
              onChange={setTransit}
              suffix={`${transit} days/week`}
            />
            <Slider
              label="Plant-based meals"
              value={meatless}
              max={7}
              onChange={setMeatless}
              suffix={`${meatless} days/week`}
            />
            <Slider
              label="Cut household electricity by"
              value={energyCut}
              max={50}
              step={5}
              onChange={setEnergyCut}
              suffix={`${energyCut}%`}
            />
            <label className="flex items-center justify-between p-4 rounded-xl border border-border bg-background cursor-pointer">
              <div>
                <p className="font-semibold">Install rooftop solar</p>
                <p className="text-xs text-muted-foreground">Estimated 90 kg/month avoided</p>
              </div>
              <input
                type="checkbox"
                checked={solar}
                onChange={(e) => setSolar(e.target.checked)}
                className="size-5 accent-primary"
              />
            </label>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="bg-aurora text-primary-foreground">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest opacity-80 mb-2">
              <Sparkles className="size-3" /> Projected impact
            </div>
            <p className="text-5xl font-mono font-bold">
              −{monthlySavings}
              <span className="text-xl"> kg/month</span>
            </p>
            <p className="mt-2 opacity-90">That's −{annual.toLocaleString()} kg CO₂ per year.</p>
            <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="opacity-70 text-xs">New monthly</p>
                <p className="font-mono font-bold text-lg">{newMonthly} kg</p>
              </div>
              <div>
                <p className="opacity-70 text-xs">≈ trees/yr</p>
                <p className="font-mono font-bold text-lg">{Math.round(annual / 21)}</p>
              </div>
              <div>
                <p className="opacity-70 text-xs">≈ flights avoided</p>
                <p className="font-mono font-bold text-lg">{Math.round(annual / 250)}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                12-month projection
              </p>
              <span className="text-primary font-mono text-xs flex items-center gap-1">
                <TrendingDown className="size-3" /> Trend
              </span>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={projection}>
                  <CartesianGrid
                    stroke="var(--color-border)"
                    strokeDasharray="2 4"
                    vertical={false}
                  />
                  <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={11} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="current"
                    stroke="var(--color-muted-foreground)"
                    strokeDasharray="4 4"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="projected"
                    stroke="var(--color-primary)"
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  max,
  step = 1,
  onChange,
  suffix,
}: {
  label: string;
  value: number;
  max: number;
  step?: number;
  onChange: (n: number) => void;
  suffix: string;
}) {
  const id = React.useId();
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        <span className="text-sm font-mono text-primary">{suffix}</span>
      </div>
      <input
        id={id}
        type="range"
        min={0}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary"
      />
    </div>
  );
}
