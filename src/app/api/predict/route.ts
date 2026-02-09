import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { event, apiKey, timeHorizon = "15 years", steps = 15 } = await req.json();
  const numSteps = Math.min(30, Math.max(3, Number(steps) || 15));

  const key = apiKey || process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return new Response("No API key provided. Add one in Settings.", {
      status: 401,
    });
  }

  try {
    const anthropic = createAnthropic({ apiKey: key });

    const { text } = await generateText({
      model: anthropic("claude-sonnet-4-5-20250929"),
      system: `You are a geopolitical and technological futurist analyst. Given a hypothetical event, you generate a detailed timeline of predicted future outcomes spanning up to ${timeHorizon}, along with data charts that visualize key trends.

For each timeline entry, provide:
- A timeframe that fits within the ${timeHorizon} horizon (e.g., "1 week", "1 month", "6 months", "1 year", etc. — scale appropriately)
- A title for the outcome
- A description (2-3 sentences)
- A confidence score from 1-100 (how likely this outcome is)
- A category: one of "political", "economic", "social", "technological", "environmental", "military"
- A sentiment: one of "positive", "negative", "neutral", "mixed"

Generate exactly ${numSteps} timeline entries that show cascading consequences over the ${timeHorizon} horizon. Start from immediate effects and progress to the end of the time horizon. Spread entries evenly across the timespan. Be creative but grounded in realistic geopolitical/economic/social analysis.

Also generate 2-4 data charts that visualize important trends or metrics related to this event over the ${timeHorizon} horizon. Each chart should have:
- A title (e.g., "GDP Growth Impact", "Public Approval Rating", "Market Cap Projection")
- A type: one of "line", "area", "bar"
- A color: one of "amber", "blue", "emerald", "red", "cyan", "purple"
- A unit label for the Y axis (e.g., "%", "$B", "million", "index")
- 6-10 data points with a "label" (time label) and "value" (number)

Make the chart data realistic and consistent with the timeline predictions. Values should tell a coherent story.

Respond ONLY with raw JSON. Do NOT wrap it in markdown code fences. No backticks. No \`\`\`json. Just the raw JSON object:
{
  "summary": "A one-sentence summary of the overall prediction trajectory",
  "overallConfidence": 45,
  "charts": [
    {
      "title": "Chart Title",
      "type": "line",
      "color": "amber",
      "unit": "%",
      "data": [
        { "label": "Now", "value": 50 },
        { "label": "1 year", "value": 62 }
      ]
    }
  ],
  "timeline": [
    {
      "timeframe": "1 month",
      "title": "Short title",
      "description": "2-3 sentence description",
      "confidence": 85,
      "category": "political",
      "sentiment": "positive"
    }
  ]
}`,
      prompt: `Generate a future prediction timeline with data charts spanning ${timeHorizon} for the following event: "${event}"`,
    });

    // Strip markdown code fences if the model wraps in ```json ... ```
    const cleaned = text.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();

    return Response.json(JSON.parse(cleaned));
  } catch (err: unknown) {
    console.error("Prediction API error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
