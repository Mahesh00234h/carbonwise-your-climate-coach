import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Leaf,
  Brain,
  Sparkles,
  ScanLine,
  Trophy,
  Users,
  LineChart,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CarbonWise — Small choices, massive legacy" },
      {
        name: "description",
        content:
          "Meet your AI sustainability coach. Track your carbon footprint, simulate the future, and build habits that change the planet.",
      },
      { property: "og:title", content: "CarbonWise — Small choices, massive legacy" },
      {
        property: "og:description",
        content:
          "Meet your AI sustainability coach. Track your carbon footprint, simulate the future, and build habits that change the planet.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <Hero />
      <ImpactStrip />
      <FeatureGrid />
      <DashboardPreview />
      <LevelPath />
      <FinalCta />
      <SiteFooter />
    </div>
  );
}

function SiteNav() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-border bg-background/80 backdrop-blur-md">
      <Link to="/" className="flex items-center gap-2">
        <div className="size-6 bg-primary rounded-full ring-4 ring-primary/20" aria-hidden />
        <span className="font-mono font-bold tracking-tighter text-lg uppercase">CarbonWise</span>
      </Link>
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
        <a href="#features" className="hover:text-primary transition-colors">
          Features
        </a>
        <a href="#dashboard" className="hover:text-primary transition-colors">
          Intelligence
        </a>
        <a href="#levels" className="hover:text-primary transition-colors">
          Levels
        </a>
        <Link to="/learn" className="hover:text-primary transition-colors">
          Learn
        </Link>
      </div>
      <Link
        to="/auth"
        className="bg-foreground text-background px-4 py-2 rounded-full text-sm font-semibold hover:bg-primary transition-all active:scale-95"
      >
        Get Started
      </Link>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative px-6 pt-24 pb-32 overflow-hidden">
      {/* Aurora glow */}
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 size-[600px] rounded-full bg-primary/20 blur-[120px] opacity-60" />
        <div className="absolute top-40 right-10 size-[400px] rounded-full bg-accent/20 blur-[120px] opacity-50" />
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <div className="animate-fade-up inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-mono uppercase tracking-widest mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          Live network impact: −1.2M tons CO₂
        </div>
        <h1 className="animate-fade-up text-5xl md:text-7xl font-extrabold tracking-tight text-balance leading-[0.9] mb-8">
          Small choices. <br />
          <span className="text-aurora">Massive legacy.</span>
        </h1>
        <p className="animate-fade-up text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 text-pretty">
          The world's first carbon intelligence coach. We don't just calculate your footprint — we
          simulate your future and guide your daily transition.
        </p>
        <div className="animate-fade-up flex flex-wrap justify-center gap-4">
          <Link
            to="/auth"
            className="h-14 px-8 inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold rounded-xl hover:glow-primary transition-all"
          >
            Create free account <ArrowRight className="size-4" />
          </Link>
          <Link
            to="/simulator"
            className="h-14 px-8 inline-flex items-center border border-border bg-white/5 font-semibold rounded-xl hover:bg-white/10 transition-all"
          >
            Explore simulator
          </Link>
        </div>
      </div>

      <div className="animate-scale-in mt-20 max-w-4xl mx-auto border border-border bg-surface/50 rounded-2xl p-1 shadow-2xl">
        <div className="bg-background rounded-xl p-6 md:p-8">
          <div className="flex items-center justify-between mb-8 border-b border-border pb-6">
            <div>
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                Real-time intelligence
              </p>
              <h3 className="text-xl font-bold">Personal Dashboard</h3>
            </div>
            <div className="size-12 rounded-full border-4 border-primary border-t-transparent animate-spin [animation-duration:3s]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-surface border border-border">
              <p className="text-xs text-muted-foreground mb-1">Daily Average</p>
              <p className="text-2xl font-mono font-bold text-primary">14.2 kg</p>
              <div className="mt-4 h-1 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[40%]" />
              </div>
            </div>
            <div className="p-4 rounded-xl bg-surface border border-border">
              <p className="text-xs text-muted-foreground mb-1">Level Progression</p>
              <p className="text-2xl font-mono font-bold text-accent">Eco Explorer</p>
              <div className="mt-4 flex gap-1">
                <div className="h-1 flex-1 bg-accent rounded-full" />
                <div className="h-1 flex-1 bg-accent rounded-full" />
                <div className="h-1 flex-1 bg-secondary rounded-full" />
              </div>
            </div>
            <div className="p-4 rounded-xl bg-primary text-primary-foreground">
              <p className="text-xs opacity-70 mb-1 uppercase font-bold">AI Suggestion</p>
              <p className="text-sm font-semibold leading-snug">
                "Switching to cycling for 2 days/week will save 450kg annually."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ImpactStrip() {
  const stats = [
    { value: "45K+", label: "Active guardians" },
    { value: "1.2M", label: "Tons CO₂ avoided" },
    { value: "780K", label: "Habit streaks logged" },
    { value: "92%", label: "Reduce footprint in 90d" },
  ];
  return (
    <section className="border-y border-border bg-surface/30">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
        {stats.map((s) => (
          <div key={s.label} className="px-6 py-8 text-center">
            <p className="font-mono text-3xl md:text-4xl font-bold text-primary">{s.value}</p>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mt-2">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeatureGrid() {
  const features = [
    {
      icon: Sparkles,
      title: "What-If Engine",
      desc: "Predict the impact of major life changes before you make them. Solar, EV, or diet? See the future in 4D.",
      hue: "primary" as const,
    },
    {
      icon: Brain,
      title: "AI Sustainability Coach",
      desc: "Real-time nudges based on your habits and utility bills. Practical, personal, never preachy.",
      hue: "accent" as const,
    },
    {
      icon: ScanLine,
      title: "Receipt & Bill Scanner",
      desc: "Snap your energy bills or grocery receipts. Our AI extracts carbon data automatically.",
      hue: "white" as const,
    },
    {
      icon: Trophy,
      title: "Challenges & Streaks",
      desc: "Plastic-Free Week, Green Commute, Low Energy. Earn XP and unlock new levels.",
      hue: "primary" as const,
    },
    {
      icon: Users,
      title: "Community Impact Hub",
      desc: "Compare with friends and see collective milestones — like the trees you've planted together.",
      hue: "accent" as const,
    },
    {
      icon: LineChart,
      title: "Smart Reports",
      desc: "Weekly and monthly insights that read like a sustainability briefing, not a spreadsheet.",
      hue: "white" as const,
    },
  ];
  return (
    <section id="features" className="px-6 py-24 bg-white/[0.02]">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-16">
          <p className="text-xs font-mono uppercase tracking-widest text-primary mb-4">
            The platform
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Everything you need to live lighter.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <article
              key={f.title}
              className="group p-8 rounded-3xl bg-surface border border-border hover:border-primary/40 transition-all"
            >
              <div
                className={`size-10 rounded-xl flex items-center justify-center mb-6 ${
                  f.hue === "primary"
                    ? "bg-primary/10 text-primary"
                    : f.hue === "accent"
                      ? "bg-accent/10 text-accent"
                      : "bg-white/5 text-foreground"
                }`}
              >
                <f.icon className="size-5" />
              </div>
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <section id="dashboard" className="px-6 py-24">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-accent mb-4">
            Carbon intelligence
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Numbers that mean something <span className="text-aurora">in real life</span>.
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Your monthly footprint is not just a kilogram count. It's the distance you've driven,
            the appliances you've powered, the trees it would take to absorb it.
          </p>
          <ul className="space-y-4 text-sm">
            {[
              "Your emissions equal driving 350 km this month",
              "Skipping one weekly car trip = 6 phones charged for a year",
              "You're 12% below the average resident in your city",
            ].map((line) => (
              <li key={line} className="flex gap-3 items-start">
                <Leaf className="size-4 text-primary mt-0.5 shrink-0" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative border border-border bg-surface rounded-3xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-mono text-muted-foreground uppercase">November</p>
              <p className="text-3xl font-mono font-bold text-primary">
                428 <span className="text-base text-muted-foreground">kg CO₂</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">vs last month</p>
              <p className="text-accent font-mono font-bold">−12.4%</p>
            </div>
          </div>
          {/* Bar chart mini */}
          <div className="flex items-end gap-2 h-32">
            {[40, 60, 35, 70, 45, 55, 30, 50, 38, 25, 33, 28].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-gradient-to-t from-primary/30 to-primary"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground font-mono">
            <span>Jan</span>
            <span>Apr</span>
            <span>Jul</span>
            <span>Oct</span>
            <span>Dec</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function LevelPath() {
  const levels = [
    "Seedling",
    "Eco Explorer",
    "Green Warrior",
    "Climate Champion",
    "Earth Guardian",
  ];
  return (
    <section id="levels" className="px-6 py-24 bg-white/[0.02] border-y border-border">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-xs font-mono uppercase tracking-widest text-primary mb-4">
          Gamified progress
        </p>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-16">
          Level up your impact.
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {levels.map((lvl, i) => (
            <div key={lvl} className="flex flex-col items-center">
              <div
                className={`size-20 rounded-full grid place-items-center mb-4 border-4 ${
                  i === 1
                    ? "border-primary bg-primary/10 text-primary glow-primary"
                    : "border-border bg-surface text-muted-foreground"
                }`}
              >
                <span className="font-mono font-bold">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <p className={`font-bold ${i === 1 ? "" : "text-muted-foreground"}`}>{lvl}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {i === 1 ? "Current rank" : `${(i + 1) * 1200} XP`}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="px-6 py-32 text-center relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] rounded-full bg-primary/10 blur-[120px]" />
      </div>
      <div className="max-w-3xl mx-auto relative">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to shift the curve?</h2>
        <p className="text-muted-foreground text-lg mb-10">
          Join 45,000+ early adopters turning sustainable intent into measurable impact.
        </p>
        <Link
          to="/auth"
          className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-primary-foreground font-bold text-lg rounded-full hover:glow-primary transition-all"
        >
          Start your profile <Zap className="size-5" />
        </Link>
        <p className="mt-6 text-xs font-mono text-muted-foreground uppercase tracking-[0.2em]">
          Free for individuals • No credit card required
        </p>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-border px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-2">
        <div className="size-4 bg-primary rounded-full" />
        <span className="font-mono font-bold tracking-tighter uppercase text-sm">
          CarbonWise © 2026
        </span>
      </div>
      <div className="flex gap-8 text-xs font-medium text-muted-foreground uppercase tracking-widest">
        <Link to="/learn" className="hover:text-primary">
          Climate Docs
        </Link>
        <a href="#features" className="hover:text-primary">
          Features
        </a>
        <Link to="/auth" className="hover:text-primary">
          Join
        </Link>
        <Link to="/privacy" className="hover:text-primary">
          Privacy
        </Link>
      </div>
    </footer>
  );
}
