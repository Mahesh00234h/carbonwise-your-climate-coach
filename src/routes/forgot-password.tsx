import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset password — CarbonWise" },
      { name: "description", content: "Send a password reset link to your CarbonWise account email." },
    ],
  }),
  component: ForgotPasswordPage,
});

const schema = z.string().trim().email("Enter a valid email").max(255);

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = schema.safeParse(email);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid email");
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
        redirectTo: window.location.origin + "/reset-password",
      });
      if (error) throw error;
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
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
          <p className="text-xs font-mono uppercase tracking-widest text-primary mb-3">Reset password</p>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">
            Forgot your password?
          </h1>
          {sent ? (
            <p className="text-sm text-muted-foreground">
              If an account exists for <span className="font-mono text-foreground">{email}</span>, we sent a reset link. Check your inbox.
            </p>
          ) : (
            <form onSubmit={submit} className="grid gap-4">
              <label className="grid gap-2">
                <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Email</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                {busy ? "Sending…" : "Send reset link"}
              </button>
            </form>
          )}
          <Link
            to="/auth"
            className="mt-6 block text-sm text-muted-foreground hover:text-foreground text-center"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}