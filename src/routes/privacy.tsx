import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy & Trust — CarbonWise" },
      {
        name: "description",
        content:
          "How CarbonWise handles your data: authentication, storage, AI processing, retention, and your rights.",
      },
      { property: "og:title", content: "Privacy & Trust — CarbonWise" },
      {
        property: "og:description",
        content: "Transparency about how CarbonWise stores and protects your sustainability data.",
      },
      { property: "og:url", content: "https://carbon-wise-coach.lovable.app/privacy" },
    ],
    links: [{ rel: "canonical", href: "https://carbon-wise-coach.lovable.app/privacy" }],
  }),
  component: PrivacyPage,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-3">{title}</h2>
      <div className="text-muted-foreground leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

function PrivacyPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-3 focus:py-2 focus:rounded-md"
      >
        Skip to content
      </a>
      <nav className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 border-b border-border bg-background/80 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-6 bg-primary rounded-full ring-4 ring-primary/20" aria-hidden />
          <span className="font-mono font-bold tracking-tighter uppercase">CarbonWise</span>
        </Link>
        <Link to="/auth" className="text-sm font-semibold hover:text-primary">
          Sign in
        </Link>
      </nav>

      <section id="main" className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-xs font-mono uppercase tracking-widest text-primary mb-3">
          Trust center
        </p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Privacy &amp; Trust</h1>
        <p className="text-muted-foreground mb-12">
          This page is maintained by the CarbonWise team to answer common security and privacy
          questions about the app. It describes current, app-visible controls — not an independent
          certification.
        </p>

        <Section title="Account &amp; authentication">
          <p>
            We use email and password authentication. Passwords are never stored in plaintext;
            authentication is handled by our managed backend provider, which stores salted password
            hashes. You can reset your password at any time from the{" "}
            <Link to="/forgot-password" className="text-primary hover:underline">
              password reset
            </Link>{" "}
            page.
          </p>
        </Section>

        <Section title="What data we collect">
          <ul className="list-disc pl-6 space-y-2">
            <li>Account: email, optional display name, avatar URL, country, weekly CO₂ goal.</li>
            <li>Onboarding answers (transport, diet, energy, shopping, travel preferences).</li>
            <li>Habit logs you create in the app (habit id, CO₂ saved, XP, date).</li>
            <li>
              Scanned bills/receipts you upload (vendor, type, estimated CO₂, AI-generated insight).
            </li>
          </ul>
          <p>We do not collect payment information, location tracking, or contacts.</p>
        </Section>

        <Section title="How your data is stored &amp; protected">
          <p>
            All user data lives in a managed Postgres database with{" "}
            <strong>Row-Level Security</strong> enabled on every table. Policies are written so that
            you can only ever read or modify rows where <code>user_id = auth.uid()</code>.
            Connections to the database are encrypted in transit (TLS).
          </p>
        </Section>

        <Section title="AI processing">
          <p>
            When you chat with the AI Coach or scan a bill, the relevant text or image is sent to a
            hosted large-language-model provider through our AI gateway (currently Google Gemini).
            API keys live server-side only and are never exposed to the browser. Bill images are
            processed in-memory for analysis; only the structured result (type, vendor, estimated
            CO₂, short insight) is persisted.
          </p>
        </Section>

        <Section title="Cookies &amp; tracking">
          <p>
            We use a single first-party storage entry to keep you signed in (your auth session). We
            do not run third-party analytics, advertising trackers, or cross-site profiling.
          </p>
        </Section>

        <Section title="Retention &amp; deletion">
          <p>
            Your data is retained while your account is active. You can delete individual scans from
            the{" "}
            <Link to="/scan" className="text-primary hover:underline">
              Bill Scanner
            </Link>{" "}
            page. To delete your entire account and all associated rows, email{" "}
            <a href="mailto:privacy@carbonwise.app" className="text-primary hover:underline">
              privacy@carbonwise.app
            </a>{" "}
            from the address on file and we will action the request.
          </p>
        </Section>

        <Section title="Your rights">
          <p>
            You can request a copy of your data, ask us to correct it, or ask us to delete it at any
            time. Send requests to{" "}
            <a href="mailto:privacy@carbonwise.app" className="text-primary hover:underline">
              privacy@carbonwise.app
            </a>
            .
          </p>
        </Section>

        <Section title="Security contact">
          <p>
            Found a vulnerability? Please report it responsibly to{" "}
            <a href="mailto:security@carbonwise.app" className="text-primary hover:underline">
              security@carbonwise.app
            </a>{" "}
            with steps to reproduce. We will acknowledge within 72 hours.
          </p>
        </Section>

        <p className="text-xs text-muted-foreground mt-16">
          Last updated: June 18, 2026. This page may change as the product evolves.
        </p>
      </section>
    </div>
  );
}
