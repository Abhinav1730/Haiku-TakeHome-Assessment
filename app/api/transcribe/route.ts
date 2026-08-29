import { NextResponse } from "next/server";
import { openRouterTranscribe } from "@/lib/openrouter";

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const { audio, format } = (await request.json()) as { audio?: string; format?: string };
    if (!audio) {
      return NextResponse.json({ error: "No audio" }, { status: 400 });
    }
    const text = await openRouterTranscribe({
      base64: audio,
      format: format || "webm",
    });
    return NextResponse.json({ text });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Transcription failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
