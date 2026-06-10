import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";

import { Card, PageHeader } from "@/components/AppShell";
import { useProfile, useUpdateProfile } from "@/lib/use-profile";

export const Route = createFileRoute("/_app/settings")({
  component: SettingsPage,
});

const schema = z.object({
  display_name: z.string().trim().min(1, "Required").max(80),
  country: z.string().trim().max(80).optional().or(z.literal("")),
  avatar_url: z.string().trim().url("Must be a URL").max(500).optional().or(z.literal("")),
  weekly_co2_goal_kg: z.number().min(0).max(10000).nullable(),
});

function SettingsPage() {
  const { data: profile, isLoading } = useProfile();
  const update = useUpdateProfile();

  const [display_name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [avatar_url, setAvatar] = useState("");
  const [goal, setGoal] = useState<string>("");
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setName(profile.display_name ?? "");
      setCountry(profile.country ?? "");
      setAvatar(profile.avatar_url ?? "");
      setGoal(profile.weekly_co2_goal_kg != null ? String(profile.weekly_co2_goal_kg) : "");
    }
  }, [profile]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setError(null);
    const parsed = schema.safeParse({
      display_name,
      country,
      avatar_url,
      weekly_co2_goal_kg: goal === "" ? null : Number(goal),
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    try {
      await update.mutateAsync({
        display_name: parsed.data.display_name,
        country: parsed.data.country || null,
        avatar_url: parsed.data.avatar_url || null,
        weekly_co2_goal_kg: parsed.data.weekly_co2_goal_kg,
      });
      setMsg("Profile saved");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        eyebrow="Account"
        title="Your profile & goals"
        description="Personalize your coach. These power leaderboards and emission calculations."
      />
      <Card>
        {isLoading ? (
          <p className="text-muted-foreground text-sm">Loading…</p>
        ) : (
          <form onSubmit={submit} className="grid gap-5">
            <Field label="Display name">
              <input
                value={display_name}
                onChange={(e) => setName(e.target.value)}
                maxLength={80}
                className="h-11 px-3 rounded-xl bg-background border border-border focus:border-primary outline-none w-full"
              />
            </Field>
            <Field label="Avatar URL">
              <input
                type="url"
                value={avatar_url}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://…"
                className="h-11 px-3 rounded-xl bg-background border border-border focus:border-primary outline-none w-full"
              />
            </Field>
            <Field label="Country">
              <input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                maxLength={80}
                className="h-11 px-3 rounded-xl bg-background border border-border focus:border-primary outline-none w-full"
              />
            </Field>
            <Field label="Weekly CO₂ goal (kg)">
              <input
                type="number"
                inputMode="decimal"
                min={0}
                max={10000}
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="h-11 px-3 rounded-xl bg-background border border-border focus:border-primary outline-none w-full"
              />
            </Field>

            {error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : null}
            {msg ? <p className="text-sm text-primary">{msg}</p> : null}

            <button
              type="submit"
              disabled={update.isPending}
              className="h-11 rounded-xl bg-primary text-primary-foreground font-bold disabled:opacity-50 hover:glow-primary transition-all"
            >
              {update.isPending ? "Saving…" : "Save changes"}
            </button>
          </form>
        )}
      </Card>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}