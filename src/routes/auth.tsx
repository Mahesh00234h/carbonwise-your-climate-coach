import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — CarbonWise" },
      { name: "description", content: "Sign in or create a free CarbonWise account to save your carbon profile and goals." },
    ],
  }),
  component: AuthPage,
});

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(8, "At least 8 characters").max(128),
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: { emailRedirectTo: window.location.origin + "/dashboard" },
        });
        if (error) throw error;
        // auto-confirm is on → session is live; route to onboarding
        navigate({ to: "/onboarding" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) throw error;
        navigate({ to: "/dashboard" });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground grid place-items-center px-6 py-12 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 size-[500px] rounded-full bg-primary/20 blur-[120px] opacity-50" />
      </div>
      <div className="w-full max-w-md relative">
        <Link to="/" className="flex items-center gap-2 mb-10 justify-center">
          <div className="size-6 bg-primary rounded-full ring-4 ring-primary/20" aria-hidden />
          <span className="font-mono font-bold tracking-tighter uppercase">CarbonWise</span>
        </Link>

        <div className="rounded-3xl border border-border bg-surface p-8 animate-fade-up">
          <p className="text-xs font-mono uppercase tracking-widest text-primary mb-3">
            {mode === "signup" ? "Create account" : "Welcome back"}
          </p>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">
            {mode === "signup" ? "Start tracking your impact." : "Continue your mission."}
          </h1>

          <form onSubmit={submit} className="grid gap-4">
            <label className="grid gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Email</span>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 px-3 rounded-xl bg-background border border-border focus:border-primary outline-none"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Password</span>
              <input
                type="password"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
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
              {busy ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
            </button>
          </form>

          <button
            onClick={() => {
              setMode(mode === "signup" ? "signin" : "signup");
              setError(null);
            }}
            className="mt-6 text-sm text-muted-foreground hover:text-foreground w-full text-center"
          >
            {mode === "signup" ? "Already have an account? Sign in" : "New to CarbonWise? Create an account"}
          </button>
        </div>

        <p className="text-xs text-center text-muted-foreground mt-6 font-mono uppercase tracking-widest">
          Your data is yours. Encrypted &amp; private.
        </p>
      </div>
    </div>
  );
}