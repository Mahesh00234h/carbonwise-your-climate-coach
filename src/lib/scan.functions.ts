import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";

import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const InputSchema = z.object({
  dataUrl: z.string().min(32).max(15_000_000),
  mimeType: z.string().min(3).max(100),
});

const ResultSchema = z.object({
  type: z.string(),
  vendor: z.string(),
  estimateKg: z.number(),
  insight: z.string(),
});

export const analyzeBill = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);
    const isPdf = data.mimeType.includes("pdf");

    const { experimental_output } = await generateText({
      model: gateway("google/gemini-2.5-flash"),
      experimental_output: Output.object({ schema: ResultSchema }),
      messages: [
        {
          role: "system",
          content:
            "You are CarbonWise's bill analyzer. Identify the document (electricity bill, fuel receipt, grocery receipt, travel ticket, etc.), the vendor + date, estimate the kg of CO2 associated with it, and give one short, friendly, specific insight (max 2 sentences). Be realistic with numbers.",
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this bill or receipt." },
            isPdf
              ? { type: "file", data: data.dataUrl, mediaType: data.mimeType, filename: "bill.pdf" }
              : { type: "image", image: data.dataUrl },
          ],
        },
      ],
    });

    return experimental_output;
  });