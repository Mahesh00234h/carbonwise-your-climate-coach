# 🌿 CarbonWise

> **Your personal AI sustainability coach.**
> Don't just measure your carbon footprint — understand it, simulate your future, and shrink it one habit at a time.

<p align="center">
  <img src="docs/screenshots/01-landing.png" alt="CarbonWise landing page — Small choices. Massive legacy." width="900"/>
</p>

<p align="center">
  <b>Built for the hackathon</b> · Midnight Aurora design system · Powered by Lovable Cloud + Lovable AI Gateway
</p>

---

## 🚀 Why CarbonWise

Most people *want* to help the planet — but climate data is intimidating, abstract, and easy to ignore. **CarbonWise turns climate into a personal, gamified, AI-guided journey.** Every kilogram of CO₂ is translated into something you can feel ("equals 3,567 km driven", "20 trees absorbing for a year"), and a real AI coach tells you exactly what to change *this week*.

It's not a calculator. It's a coach in your pocket.

---

## ✨ Core features

| | Feature | What it does |
|---|---|---|
| 📊 | **Carbon Intelligence Dashboard** | Real numbers translated into real-life equivalents — km driven, trees needed, phones charged. |
| 🤖 | **AI Sustainability Coach** | Streaming chat (Gemini via Lovable AI Gateway). Asks about your life and recommends 3 specific moves a week. |
| 🧪 | **What-If Simulator** | Drag sliders — "swap car 3 days/week" — and see live monthly + annual projections. |
| ✅ | **Daily Habit Tracker** | One tap = +XP, real CO₂ saved, streak grows. Persisted per user. |
| 🏆 | **Multi-day Challenges** | Plastic-Free Week, Green Commute, Low Energy. Earn levels Seedling → Earth Guardian. |
| 🧾 | **AI Bill & Receipt Scanner** | Drop an electricity bill or grocery receipt → Gemini multimodal extracts vendor, type, and kg CO₂. |
| 🌍 | **Community Impact Hub** | Global leaderboard + collective milestones ("57,142 trees-equivalent this month"). |
| 📈 | **Smart Weekly/Monthly Reports** | Auto-generated briefings that read like an editorial, not a spreadsheet. |
| 📚 | **Climate Learning Center** | Bite-sized, visual climate education. |
| 🔐 | **Secure Auth + Profiles** | Email/password with Lovable Cloud, RLS on every table, per-user goals. |

---

## 🗺️ Product flow (judge tour)

### 1. Landing — set the tone in 3 seconds
Bold typography, live impact ticker, one CTA.

![Landing](docs/screenshots/01-landing.png)

### 2. Sign up — friction-free
Email + password. Profile is auto-created via a Postgres trigger.

![Auth](docs/screenshots/02-auth.png)

### 3. Onboarding — 6 questions, then you're in
Transport · diet · energy · shopping · travel · goal. Saved as a JSON blob on `profiles`.

![Onboarding](docs/screenshots/03-onboarding.png)

### 4. Dashboard — your footprint in plain language
Daily / weekly / monthly totals, breakdown by source, AI suggestion of the day, streak counter, real-life equivalents.

![Dashboard](docs/screenshots/04-dashboard.png)

### 5. AI Coach — chat your way greener
Streaming responses, smart conversation starters, context-aware advice.

![Coach](docs/screenshots/05-coach.png)

### 6. What-If Simulator — see the future, live
Sliders update a 12-month projection chart in real time.

![Simulator](docs/screenshots/06-simulator.png)

### 7. Habits — the daily 30-second ritual
Tap, save CO₂, earn XP, grow your streak. Every tap is a row in `habit_logs`.

![Habits](docs/screenshots/07-habits.png)

### 8. Bill Scanner — drop a bill, get a footprint
Upload PDF/JPG/PNG. Real Gemini multimodal call returns structured `{type, vendor, kg CO₂, insight}` and persists to `scanned_bills`.

![Scanner](docs/screenshots/08-scan.png)

### 9. Challenges — multi-day missions
Progress bars, XP rewards, level progression.

![Challenges](docs/screenshots/09-challenges.png)

### 10. Community — moving the needle together
Global leaderboard and collective milestones.

![Community](docs/screenshots/10-community.png)

---

## 🛠️ Tech stack

- **Framework:** TanStack Start v1 (React 19 + Vite 7, file-based routing, SSR + server functions)
- **Styling:** Tailwind CSS v4 + a custom **Midnight Aurora** design system (semantic tokens in `src/styles.css`, no hardcoded colors)
- **UI:** shadcn/ui + Lucide icons + Recharts + Sonner toasts
- **Backend:** Lovable Cloud (Postgres + Auth + RLS)
- **AI:** Lovable AI Gateway → `google/gemini-2.5-flash` (streaming chat + multimodal vision)
- **State:** TanStack Query + custom `use-profile` hooks
- **Validation:** Zod on every server-function input/output
- **Deployment:** Cloudflare Workers (edge)

### Architecture highlights

- **Server functions** (`createServerFn`) for chat streaming and bill analysis — no exposed API keys, full RLS-aware DB access.
- **Auth gate** in the `_app` layout — every protected route redirects to `/auth` if no session.
- **Row-Level Security** on `profiles`, `habit_logs`, `scanned_bills` — users can only ever see/touch their own data.
- **Auto-profile creation** via a `SECURITY DEFINER` Postgres trigger on `auth.users`.
- **Password reset flow** via `/forgot-password` + `/reset-password` listening to `PASSWORD_RECOVERY` events.
- **SEO-ready:** unique `<head>` per route, sitemap.xml route, llms.txt, semantic HTML.

---

## 🗄️ Database schema

```
profiles         (id, display_name, avatar_url, country, weekly_co2_goal_kg, onboarding jsonb)
habit_logs       (id, user_id, habit_id, co2_saved_kg, xp, log_date)
scanned_bills    (id, user_id, type, vendor, estimate_kg, insight, mime_type)
```

Every table has RLS enabled with `auth.uid() = user_id` policies and explicit `GRANT`s to `authenticated`.

---

## 🏃 Run locally

```bash
bun install
bun run dev
```

Visit `http://localhost:5173`. Lovable Cloud injects all required env vars automatically — no `.env` setup needed.

## 🧪 Testing

Pure-function unit tests live next to their sources (e.g. `src/lib/carbon.test.ts`) and run under **Vitest + jsdom + Testing Library**.

```bash
bun run test        # one-shot
bun run test:watch  # TDD mode
```

## ♿ Accessibility

- Skip-to-content link on every page
- Single `<main>` landmark per route
- Semantic HTML, WCAG-AA design tokens (no hardcoded contrast-failing colors)
- All icon-only buttons carry `aria-label`
- Radix-powered shadcn primitives for correct ARIA on dialogs / menus / popovers

## 🔐 Security & Trust

- Public `/privacy` trust page documenting data collection, retention, AI processing, and security contact
- Row-Level Security on **every** user table (`auth.uid() = user_id`)
- Server-only secrets (AI gateway, service role) — never shipped to the client
- Zod validation on every server-function boundary
- Password reset via email recovery flow

---

## 🏗️ Project structure

```
src/
├── routes/                # File-based routing (TanStack Start)
│   ├── __root.tsx         # App shell + auth listener + toaster
│   ├── index.tsx          # Landing page
│   ├── auth.tsx           # Sign in / sign up
│   ├── onboarding.tsx     # 6-step profile builder
│   ├── _app.tsx           # Auth-gated layout
│   ├── _app.dashboard.tsx
│   ├── _app.coach.tsx
│   ├── _app.simulator.tsx
│   ├── _app.habits.tsx
│   ├── _app.challenges.tsx
│   ├── _app.community.tsx
│   ├── _app.scan.tsx
│   ├── _app.reports.tsx
│   ├── _app.learn.tsx
│   ├── _app.settings.tsx
│   └── api/chat.ts        # Streaming AI chat endpoint
├── lib/
│   ├── scan.functions.ts  # Multimodal bill analyzer (Gemini)
│   ├── ai-gateway.server.ts
│   ├── use-profile.ts     # Profile + habit hooks
│   └── app-data.ts        # Static catalog (habits, challenges, levels)
├── components/AppShell.tsx
└── integrations/supabase/ # Auto-generated clients & types

supabase/migrations/       # SQL migrations with GRANTs + RLS
```

---

## 🎮 Try it yourself

1. Open the deployed app
2. Create an account (any email / password)
3. Walk through onboarding (~30 sec)
4. Land on the dashboard — your sustainability score is live
5. Open **AI Coach** → ask *"Give me 3 realistic changes I can make this week."*
6. Drag sliders in **What-If** to see your future footprint
7. Tap a few **Habits** to build a streak
8. Drop any electricity bill / grocery receipt in **Bill Scanner** and watch the AI extract the CO₂

---

## 🏆 Why this should win

- **Real AI, not a wrapper** — streaming chat, multimodal vision, Zod-validated structured outputs.
- **Real persistence** — every habit, scan, and profile change lives in Postgres with RLS.
- **Real polish** — bespoke Midnight Aurora design system, motion, semantic tokens, accessibility-aware.
- **Real impact framing** — kilograms translated into trees, kilometres, phone charges — climate that *feels* personal.
- **Production-grade architecture** — TanStack Start server functions, edge-deployed, typed end-to-end.

Built with 💚 for a greener tomorrow.
