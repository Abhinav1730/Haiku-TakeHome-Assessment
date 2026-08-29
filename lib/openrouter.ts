const MODELS = [
  "meta-llama/llama-3.3-70b-instruct:free",
  "google/gemma-3-12b-it:free",
  "meta-llama/llama-3.2-3b-instruct:free",
];

const STT_MODELS = ["openai/whisper-large-v3", "openai/whisper-1"];

function headers() {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    throw new Error("OPENROUTER_API_KEY is not set");
  }
  return {
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    "HTTP-Referer": process.env.OPENROUTER_HTTP_REFERER ?? "http://localhost:3000",
    "X-OpenRouter-Title": process.env.OPENROUTER_TITLE ?? "Haiku Hair Intake",
  };
}

export async function openRouterChat(params: {
  system: string;
  user: string;
  jsonSchema: unknown;
}): Promise<string> {
  let lastError = "All models failed";
  for (const model of MODELS) {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: params.system },
          { role: "user", content: params.user },
        ],
        temperature: 0,
        plugins: [{ id: "response-healing" }],
        response_format: {
          type: "json_schema",
          json_schema: params.jsonSchema,
        },
      }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      lastError = body?.error?.message ?? `${res.status} ${model}`;
      continue;
    }
    const message = body?.choices?.[0]?.message;
    const content: string =
      (typeof message?.content === "string" && message.content) ||
      message?.reasoning ||
      "";
    if (content.trim()) return content;
    lastError = `Empty content from ${model}`;
  }
  throw new Error(lastError);
}

export async function openRouterTranscribe(params: {
  base64: string;
  format: string;
}): Promise<string> {
  let lastError = "Transcription failed";
  for (const model of STT_MODELS) {
    const res = await fetch("https://openrouter.ai/api/v1/audio/transcriptions", {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        model,
        language: "en",
        input_audio: {
          data: params.base64,
          format: params.format,
        },
      }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      lastError = body?.error?.message ?? `${res.status} ${model}`;
      continue;
    }
    if (typeof body?.text === "string" && body.text.trim()) {
      return body.text.trim();
    }
    lastError = `Empty transcript from ${model}`;
  }
  throw new Error(lastError);
}
