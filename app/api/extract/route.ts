import { NextResponse } from "next/server";
import {
  EXTRACT_JSON_SCHEMA,
  extractResponseSchema,
  SYSTEM_PROMPT,
} from "@/lib/extract-prompt";
import { openRouterChat } from "@/lib/openrouter";

function parseModelJson(raw: string) {
  const trimmed = raw.trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  const slice = start >= 0 && end > start ? trimmed.slice(start, end + 1) : trimmed;
  return JSON.parse(slice);
}

export async function POST(request: Request) {
  try {
    const { story } = (await request.json()) as { story?: string };
    if (!story?.trim()) {
      return NextResponse.json({ error: "Story is empty" }, { status: 400 });
    }

    const content = await openRouterChat({
      system: SYSTEM_PROMPT,
      user: story.trim(),
      jsonSchema: EXTRACT_JSON_SCHEMA,
    });
    const parsed = parseModelJson(content);
    const safe = extractResponseSchema.safeParse(parsed);
    if (!safe.success) {
      return NextResponse.json(
        { fields: {}, notes: [], error: "Could not structure that. Continue by tapping." },
        { status: 200 },
      );
    }
    return NextResponse.json(safe.data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Extract failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
