import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";

export type Profile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  country: string | null;
  weekly_co2_goal_kg: number | null;
  onboarding: Record<string, string>;
};

export function useSession() {
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setUserId(data.session?.user.id ?? null);
      setEmail(data.session?.user.email ?? null);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user.id ?? null);
      setEmail(session?.user.email ?? null);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { userId, email, ready };
}

export function useProfile() {
  const { userId } = useSession();
  return useQuery({
    queryKey: ["profile", userId],
    enabled: !!userId,
    queryFn: async (): Promise<Profile | null> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId!)
        .maybeSingle();
      if (error) throw error;
      return data as Profile | null;
    },
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  const { userId } = useSession();
  return useMutation({
    mutationFn: async (patch: Partial<Omit<Profile, "id">>) => {
      if (!userId) throw new Error("Not signed in");
      const { error } = await supabase.from("profiles").update(patch).eq("id", userId);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profile", userId] }),
  });
}

function todayUTC() {
  return new Date().toISOString().slice(0, 10);
}

export function useTodayHabitLogs() {
  const { userId } = useSession();
  return useQuery({
    queryKey: ["habit_logs", userId, todayUTC()],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("habit_logs")
        .select("habit_id, xp, co2_saved_kg")
        .eq("user_id", userId!)
        .eq("log_date", todayUTC());
      if (error) throw error;
      return data as { habit_id: string; xp: number; co2_saved_kg: number }[];
    },
  });
}

export function useToggleHabit() {
  const qc = useQueryClient();
  const { userId } = useSession();
  return useMutation({
    mutationFn: async (input: {
      habit_id: string;
      xp: number;
      co2_saved_kg: number;
      logged: boolean;
    }) => {
      if (!userId) throw new Error("Not signed in");
      if (input.logged) {
        const { error } = await supabase
          .from("habit_logs")
          .delete()
          .eq("user_id", userId)
          .eq("habit_id", input.habit_id)
          .eq("log_date", todayUTC());
        if (error) throw error;
      } else {
        const { error } = await supabase.from("habit_logs").insert({
          user_id: userId,
          habit_id: input.habit_id,
          xp: input.xp,
          co2_saved_kg: input.co2_saved_kg,
          log_date: todayUTC(),
        });
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["habit_logs", userId, todayUTC()] }),
  });
}
