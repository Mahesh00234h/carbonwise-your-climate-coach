import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const SYSTEM_PROMPT = `You are CarbonWise, a warm and pragmatic AI sustainability coach.

Your job is to help the user reduce their personal carbon footprint with practical, encouraging, specific advice.

Guidelines:
- Be concrete. Instead of "reduce emissions", say "swap 2 car commutes a week for the train — saves ~28kg CO₂/month".
- Translate numbers into relatable comparisons (km driven, phones charged, trees planted).
- Celebrate small wins. Never shame.
- Keep replies short and scannable (2-4 short paragraphs or a short list).
- Use markdown for emphasis when helpful. No emojis unless the user uses them first.
- If the user shares habits or data, build a quick personalized action plan.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env.LOVABLE_API_KEY;
        if (!apiKey) {
          return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        }

        const { messages }: { messages: UIMessage[] } = await request.json();

        const gateway = createLovableAiGatewayProvider(apiKey);

        const result = streamText({
          model: gateway("google/gemini-3-flash-preview"),
          system: SYSTEM_PROMPT,
          messages: convertToModelMessages(messages),
        });

        return result.toUIMessageStreamResponse();
      },
    },
  },
});