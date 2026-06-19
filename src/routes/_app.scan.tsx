import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, ScanLine, Sparkles, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Card, PageHeader } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { analyzeBill } from "@/lib/scan.functions";
import { useSession } from "@/lib/use-profile";

export const Route = createFileRoute("/_app/scan")({
  component: ScanPage,
});

type ScannedBill = {
  id: string;
  type: string;
  vendor: string;
  estimate_kg: number;
  insight: string;
  created_at: string;
};

function ScanPage() {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const runAnalyze = useServerFn(analyzeBill);
  const { userId } = useSession();
  const qc = useQueryClient();

  const { data: results = [] } = useQuery({
    queryKey: ["scanned_bills", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("scanned_bills")
        .select("id, type, vendor, estimate_kg, insight, created_at")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data as ScannedBill[];
    },
  });

  const totalKg = results.reduce((a, b) => a + Number(b.estimate_kg ?? 0), 0);

  const deleteBill = async (id: string) => {
    const { error } = await supabase.from("scanned_bills").delete().eq("id", id);
    if (error) {
      toast.error("Could not delete");
      return;
    }
    qc.invalidateQueries({ queryKey: ["scanned_bills", userId] });
  };

  const onFile = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File too large (max 10MB).");
      return;
    }
    setLoading(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result as string);
        r.onerror = () => reject(r.error);
        r.readAsDataURL(file);
      });
      const out = await runAnalyze({ data: { dataUrl, mimeType: file.type || "image/jpeg" } });
      if (userId) {
        const { error } = await supabase.from("scanned_bills").insert({
          user_id: userId,
          type: out.type,
          vendor: out.vendor,
          estimate_kg: out.estimateKg,
          insight: out.insight,
          mime_type: file.type || null,
        });
        if (error) throw error;
        qc.invalidateQueries({ queryKey: ["scanned_bills", userId] });
      }
      toast.success("Bill analyzed");
    } catch (e) {
      console.error(e);
      toast.error("Could not analyze that file. Try a clearer image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        eyebrow="AI bill & receipt scanner"
        title="Drop a bill. Get a footprint."
        description="Upload electricity bills, fuel receipts, or shopping receipts. Our AI extracts the carbon math automatically."
      >
        <div className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/20">
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            Total scanned
          </p>
          <p className="font-mono font-bold text-primary text-lg">{totalKg.toFixed(1)} kg CO₂</p>
        </div>
      </PageHeader>

      <Card className="border-dashed mb-6">
        <div className="text-center py-10">
          <div className="size-14 mx-auto rounded-2xl bg-primary/10 text-primary grid place-items-center mb-4">
            {loading ? <Loader2 className="size-6 animate-spin" /> : <Upload className="size-6" />}
          </div>
          <p className="font-semibold mb-1">
            {loading ? "Analyzing with AI…" : "Upload a bill or receipt"}
          </p>
          <p className="text-xs text-muted-foreground mb-6">PDF, JPG, or PNG · up to 10MB</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*,application/pdf"
            aria-label="Upload a bill or receipt to analyze"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onFile(f);
              e.target.value = "";
            }}
          />
          <button
            disabled={loading}
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:glow-primary transition-all disabled:opacity-50"
          >
            <ScanLine className="size-4" /> Upload & analyze
          </button>
        </div>
      </Card>

      <div className="space-y-4">
        {results.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center">
            Scanned bills will appear here.
          </p>
        ) : (
          results.map((r) => (
            <Card key={r.id} className="flex items-start gap-4">
              <div className="size-10 shrink-0 rounded-xl bg-accent/10 text-accent grid place-items-center">
                <Sparkles className="size-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-baseline justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-bold">{r.type}</p>
                    <p className="text-xs text-muted-foreground font-mono">{r.vendor}</p>
                  </div>
                  <p className="font-mono text-primary text-2xl font-bold">
                    {Number(r.estimate_kg).toFixed(1)} kg CO₂
                  </p>
                </div>
                <p className="text-sm text-muted-foreground mt-3">{r.insight}</p>
              </div>
              <button
                onClick={() => deleteBill(r.id)}
                aria-label="Delete scan"
                className="size-8 grid place-items-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="size-4" />
              </button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
