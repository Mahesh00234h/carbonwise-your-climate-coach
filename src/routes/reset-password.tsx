import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Set a new password — CarbonWise" },
      { name: "description", content: "Choose a new password for your CarbonWise account." },
    ],
  }),
  component: ResetPasswordPage,
});

const schema = z.string().min(8, "At least 8 characters").max(128);

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Supabase auto-exchanges the recovery token from the URL hash on load
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = schema.safeParse(password);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid password");
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: parsed.data });
      if (error) throw error;
      setDone(true);
      setTimeout(() => navigate({ to: "/dashboard" }), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update password");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground grid place-items-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 mb-10 justify-center">
          <div className="size-6 bg-primary rounded-full ring-4 ring-primary/20" aria-hidden />
          <span className="font-mono font-bold tracking-tighter uppercase">CarbonWise</span>
        </Link>
        <div className="rounded-3xl border border-border bg-surface p-8">
          <p className="text-xs font-mono uppercase tracking-widest text-primary mb-3">New password</p>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">Set a new password</h1>
          {!ready ? (
            <p className="text-sm text-muted-foreground">
              Open this page from the link in your reset email. The link expires after one hour.
            </p>
          ) : done ? (
            <p className="text-sm text-primary">Password updated. Redirecting…</p>
          ) : (
            <form onSubmit={submit} className="grid gap-4">
              <label className="grid gap-2">
                <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">New password</span>
                <input
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 px-3 rounded-xl bg-background border border-border focus:border-primary outline-none"
                />
              </label>
              {error ? (
                <p className="text-sm text-destructive border border-destructive/30 bg-destructive/10 rounded-lg px-3 py-2">
                  {error}
                </p>
              ) : null}
              <button
                type="submit"
                disabled={busy}
                className="h-11 mt-2 rounded-xl bg-primary text-primary-foreground font-bold disabled:opacity-50 hover:glow-primary transition-all"
              >
                {busy ? "Updating…" : "Update password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}