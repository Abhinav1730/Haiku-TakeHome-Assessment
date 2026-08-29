"use client";

import { Mic, Square } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type SpeechRec = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((ev: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

function getSpeechRecognition(): (new () => SpeechRec) | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & {
    SpeechRecognition?: new () => SpeechRec;
    webkitSpeechRecognition?: new () => SpeechRec;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result);
      const comma = result.indexOf(",");
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function VoiceCapture({
  onTranscript,
  disabled,
}: {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}) {
  const [recording, setRecording] = useState(false);
  const [busy, setBusy] = useState(false);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recRef = useRef<SpeechRec | null>(null);

  useEffect(() => {
    return () => {
      recRef.current?.stop();
      if (mediaRef.current?.state === "recording") mediaRef.current.stop();
    };
  }, []);

  const transcribeBlob = useCallback(
    async (blob: Blob) => {
      setBusy(true);
      try {
        const base64 = await blobToBase64(blob);
        const format = blob.type.includes("mp4") ? "m4a" : blob.type.includes("ogg") ? "ogg" : "webm";
        const res = await fetch("/api/transcribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ audio: base64, format }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Transcription failed");
        if (data.text) onTranscript(data.text);
      } catch (err) {
        toast.message("Couldn’t transcribe that. You can type instead.", {
          description: err instanceof Error ? err.message : undefined,
        });
      } finally {
        setBusy(false);
      }
    },
    [onTranscript],
  );

  const startBrowserSpeech = useCallback(() => {
    const Ctor = getSpeechRecognition();
    if (!Ctor) {
      toast.message("Voice isn’t available here. Please type.");
      return;
    }
    const rec = new Ctor();
    rec.lang = "en-IN";
    rec.interimResults = false;
    rec.continuous = false;
    rec.onresult = (ev) => {
      const text = Array.from(ev.results)
        .map((r) => r[0]?.transcript ?? "")
        .join(" ")
        .trim();
      if (text) onTranscript(text);
    };
    rec.onerror = () => toast.message("I didn’t quite catch that. Try again or type.");
    rec.onend = () => {
      setRecording(false);
      recRef.current = null;
    };
    recRef.current = rec;
    rec.start();
    setRecording(true);
  }, [onTranscript]);

  const stop = useCallback(() => {
    recRef.current?.stop();
    if (mediaRef.current?.state === "recording") mediaRef.current.stop();
    setRecording(false);
  }, []);

  const start = useCallback(async () => {
    if (recording) {
      stop();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : MediaRecorder.isTypeSupported("audio/mp4")
          ? "audio/mp4"
          : "";
      const recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        if (blob.size > 0) void transcribeBlob(blob);
      };
      mediaRef.current = recorder;
      recorder.start();
      setRecording(true);
    } catch {
      startBrowserSpeech();
    }
  }, [recording, startBrowserSpeech, stop, transcribeBlob]);

  return (
    <Button
      type="button"
      variant="outline"
      onClick={start}
      disabled={disabled || busy}
      aria-pressed={recording}
    >
      {recording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      {busy ? "Listening…" : recording ? "Stop" : "Speak instead"}
    </Button>
  );
}
