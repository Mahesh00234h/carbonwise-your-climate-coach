import { createFileRoute } from "@tanstack/react-router";
import { ScanLine, Sparkles, Upload } from "lucide-react";
import { useState } from "react";

import { Card, PageHeader } from "@/components/AppShell";

export const Route = createFileRoute("/_app/scan")({
  component: ScanPage,
});

type Result = {
  type: string;
  vendor: string;
  estimate: string;
  insight: string;
};

const SAMPLES: Result[] = [
  {
    type: "Electricity bill",
    vendor: "GreenGrid Energy · Oct",
    estimate: "62 kg CO₂",
    insight: "Your usage is 8% above your 6-month average. Cooling loads spiked on the 12th and 19th.",
  },
  {
    type: "Fuel receipt",
    vendor: "Shell · Nov 22",
    estimate: "34 kg CO₂",
    insight: "Equivalent to ~280 km of driving. Two of these per month is your biggest swing factor.",
  },
  {
    type: "Grocery receipt",
    vendor: "Whole Foods · Nov 24",
    estimate: "11 kg CO₂",
    insight: "Mostly produce-driven — low impact. Swapping the beef item for chicken would have saved ~3 kg.",
  },
];

function ScanPage() {
  const [results, setResults] = useState<Result[]>([]);

  const simulate = () => {
    const next = SAMPLES[results.length % SAMPLES.length];
    setResults((r) => [next, ...r]);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        eyebrow="AI bill & receipt scanner"
        title="Drop a bill. Get a footprint."
        description="Upload electricity bills, fuel receipts, or shopping receipts. Our AI extracts the carbon math automatically."
      />

      <Card className="border-dashed mb-6">
        <div className="text-center py-10">
          <div className="size-14 mx-auto rounded-2xl bg-primary/10 text-primary grid place-items-center mb-4">
            <Upload className="size-6" />
          </div>
          <p className="font-semibold mb-1">Drop a file or click to upload</p>
          <p className="text-xs text-muted-foreground mb-6">PDF, JPG, or PNG · up to 10MB</p>
          <button
            onClick={simulate}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:glow-primary transition-all"
          >
            <ScanLine className="size-4" /> Try a demo scan
          </button>
        </div>
      </Card>

      <div className="space-y-4">
        {results.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center">
            Scanned bills will appear here.
          </p>
        ) : (
          results.map((r, i) => (
            <Card key={i} className="flex items-start gap-4">
              <div className="size-10 shrink-0 rounded-xl bg-accent/10 text-accent grid place-items-center">
                <Sparkles className="size-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-baseline justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-bold">{r.type}</p>
                    <p className="text-xs text-muted-foreground font-mono">{r.vendor}</p>
                  </div>
                  <p className="font-mono text-primary text-2xl font-bold">{r.estimate}</p>
                </div>
                <p className="text-sm text-muted-foreground mt-3">{r.insight}</p>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}