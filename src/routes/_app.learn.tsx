import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, BookOpen } from "lucide-react";

import { Card, PageHeader } from "@/components/AppShell";
import { LEARN_TOPICS } from "@/lib/app-data";

export const Route = createFileRoute("/_app/learn")({
  component: LearnPage,
});

function LearnPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        eyebrow="Education center"
        title="Climate, made readable"
        description="Short, visual lessons that turn anxiety into action. No long articles."
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {LEARN_TOPICS.map((t) => (
          <Card key={t.id} className="group cursor-pointer hover:border-primary/40 transition-all">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-mono uppercase tracking-widest">
                {t.tag}
              </span>
              <span className="text-xs text-muted-foreground font-mono">{t.minutes} min read</span>
            </div>
            <BookOpen className="size-5 text-muted-foreground mb-4" />
            <h3 className="text-lg font-bold mb-2">{t.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{t.desc}</p>
            <p className="text-sm text-primary font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
              Start lesson <ArrowRight className="size-3.5" />
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
