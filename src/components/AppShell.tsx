import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  MessageSquare,
  Sparkles,
  ListChecks,
  Trophy,
  Users,
  FileBarChart2,
  BookOpen,
  ScanLine,
  Settings,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

import { supabase } from "@/integrations/supabase/client";
import { useProfile, useSession } from "@/lib/use-profile";

type NavItem = { to: string; label: string; icon: LucideIcon };

const NAV: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/coach", label: "AI Coach", icon: MessageSquare },
  { to: "/simulator", label: "What-If", icon: Sparkles },
  { to: "/habits", label: "Habits", icon: ListChecks },
  { to: "/challenges", label: "Challenges", icon: Trophy },
  { to: "/community", label: "Community", icon: Users },
  { to: "/reports", label: "Reports", icon: FileBarChart2 },
  { to: "/scan", label: "Bill Scanner", icon: ScanLine },
  { to: "/learn", label: "Learn", icon: BookOpen },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { email } = useSession();
  const { data: profile } = useProfile();
  const name = profile?.display_name ?? email ?? "Member";
  const initial = (profile?.display_name ?? email ?? "?").charAt(0).toUpperCase();

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/auth";
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border bg-sidebar p-4">
        <Link to="/" className="flex items-center gap-2 px-2 py-3 mb-4">
          <div className="size-6 bg-primary rounded-full ring-4 ring-primary/20" aria-hidden />
          <span className="font-mono font-bold tracking-tighter text-lg uppercase">CarbonWise</span>
        </Link>
        <nav className="flex-1 flex flex-col gap-1">
          {NAV.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-4 p-4 rounded-2xl border border-border bg-surface">
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
            Level 2 · Eco Explorer
          </p>
          <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden mb-2">
            <div className="h-full bg-aurora w-[64%]" />
          </div>
          <p className="text-xs text-muted-foreground">
            <span className="text-foreground font-semibold">9,420</span> / 14,000 XP
          </p>
        </div>
        <div className="mt-3 p-3 rounded-2xl border border-border bg-surface flex items-center gap-3">
          <div className="size-9 rounded-full bg-primary text-primary-foreground grid place-items-center font-bold">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="size-9 rounded-full object-cover" />
            ) : (
              initial
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{name}</p>
            <p className="text-[10px] text-muted-foreground truncate font-mono">{email}</p>
          </div>
          <button
            onClick={signOut}
            aria-label="Sign out"
            className="size-8 grid place-items-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 py-3 border-b border-border bg-background/90 backdrop-blur">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-5 bg-primary rounded-full" aria-hidden />
          <span className="font-mono font-bold uppercase text-sm">CarbonWise</span>
        </Link>
        <nav className="flex gap-1 overflow-x-auto">
          {NAV.slice(0, 5).map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-label={item.label}
                className={`p-2 rounded-lg ${active ? "text-primary bg-primary/10" : "text-muted-foreground"}`}
              >
                <item.icon className="size-4" />
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex-1 min-w-0 md:p-8 p-4 pt-20 md:pt-8 overflow-x-hidden">{children}</div>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
      <div>
        {eyebrow ? (
          <p className="text-xs font-mono uppercase tracking-widest text-primary mb-2">{eyebrow}</p>
        ) : null}
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h1>
        {description ? (
          <p className="text-muted-foreground mt-2 max-w-2xl">{description}</p>
        ) : null}
      </div>
      {children}
    </header>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-border bg-surface p-6 ${className}`}>{children}</div>
  );
}