import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { createFileRoute } from "@tanstack/react-router";
import { Send, Sparkles } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

import { Card, PageHeader } from "@/components/AppShell";

export const Route = createFileRoute("/_app/coach")({
  component: CoachPage,
});

const STARTERS = [
  "Where are most of my emissions coming from?",
  "Give me 3 realistic changes I can make this week.",
  "How do I cut my commute footprint?",
  "Is going vegetarian one day a week worth it?",
];

function CoachPage() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isLoading = status === "submitted" || status === "streaming";

  const submit = (text: string) => {
    const value = text.trim();
    if (!value || isLoading) return;
    sendMessage({ text: value });
    setInput("");
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] flex flex-col">
      <PageHeader
        eyebrow="AI sustainability coach"
        title="Your personal climate mentor"
        description="Ask anything. Get real, specific guidance — not generic advice."
      />

      <Card className="flex-1 flex flex-col overflow-hidden p-0">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full grid place-items-center text-center">
              <div>
                <div className="size-12 rounded-2xl bg-primary/10 text-primary grid place-items-center mx-auto mb-4">
                  <Sparkles className="size-6" />
                </div>
                <h2 className="text-xl font-bold mb-2">How can I help you live lighter?</h2>
                <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
                  Try one of these starters, or ask anything about your footprint.
                </p>
                <div className="grid sm:grid-cols-2 gap-2 max-w-xl mx-auto">
                  {STARTERS.map((s) => (
                    <button
                      key={s}
                      onClick={() => submit(s)}
                      className="text-left text-sm p-3 rounded-xl border border-border bg-background hover:border-primary/40 transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            messages.map((m) => (
              <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
                {m.role === "assistant" && (
                  <div className="size-8 shrink-0 rounded-full bg-primary/15 text-primary grid place-items-center">
                    <Sparkles className="size-4" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-background border border-border"
                  }`}
                >
                  {m.parts.map((p, i) =>
                    p.type === "text" ? (
                      <div
                        key={i}
                        className="prose prose-invert prose-sm max-w-none prose-p:my-2 prose-li:my-0"
                      >
                        <ReactMarkdown>{p.text}</ReactMarkdown>
                      </div>
                    ) : null,
                  )}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex gap-3">
              <div className="size-8 rounded-full bg-primary/15 text-primary grid place-items-center">
                <Sparkles className="size-4 animate-pulse" />
              </div>
              <div className="text-sm text-muted-foreground italic pt-2">Thinking…</div>
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(input);
          }}
          className="border-t border-border p-4 flex gap-2 bg-background/40"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your coach…"
            className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            aria-label="Send"
            className="size-12 grid place-items-center rounded-xl bg-primary text-primary-foreground hover:glow-primary disabled:opacity-40 transition-all"
          >
            <Send className="size-4" />
          </button>
        </form>
      </Card>
    </div>
  );
}
