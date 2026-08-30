"use client";

import { Mic, Square } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type SpeechResult = {
  isFinal: boolean;
  0: { transcript: string };
};

type SpeechRec = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((ev: { resultIndex: number; results: ArrayLike<SpeechResult> }) => void) | null;
  onerror: ((ev: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

function getSpeechRecognition(): (new () => SpeechRec) | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & {
    SpeechRecognition?: new () => SpeechRec;
    webkitSpeechRecognition?: new () => SpeechRec;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function VoiceCapture({
  onTranscript,
  disabled,
  continuous = false,
}: {
  onTranscript: (text: string) => void;
  disabled?: boolean;
  /** Longer dictation on the opening story screen */
  continuous?: boolean;
}) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const recRef = useRef<SpeechRec | null>(null);
  const transcriptRef = useRef("");

  useEffect(() => {
    setSupported(getSpeechRecognition() !== null);
    return () => {
      recRef.current?.abort();
      recRef.current = null;
    };
  }, []);

  const stop = useCallback(() => {
    recRef.current?.stop();
    setListening(false);
  }, []);

  const start = useCallback(() => {
    if (listening) {
      stop();
      return;
    }

    const Ctor = getSpeechRecognition();
    if (!Ctor) {
      toast.message("Voice isn’t available in this browser. Please type instead.");
      return;
    }

    const rec = new Ctor();
    transcriptRef.current = "";

    rec.lang = "en-IN";
    rec.interimResults = false;
    rec.continuous = continuous;

    rec.onresult = (ev) => {
      const chunk = Array.from(ev.results)
        .slice(ev.resultIndex)
        .filter((r) => r.isFinal)
        .map((r) => r[0]?.transcript ?? "")
        .join(" ")
        .trim();
      if (chunk) {
        transcriptRef.current = transcriptRef.current
          ? `${transcriptRef.current} ${chunk}`
          : chunk;
      }
    };

    rec.onerror = (ev) => {
      if (ev.error === "aborted" || ev.error === "no-speech") return;
      toast.message("I didn’t quite catch that. Try again or type.");
      setListening(false);
      recRef.current = null;
    };

    rec.onend = () => {
      setListening(false);
      recRef.current = null;
      const text = transcriptRef.current.trim();
      if (text) onTranscript(text);
    };

    try {
      recRef.current = rec;
      rec.start();
      setListening(true);
    } catch {
      toast.message("Couldn’t start the microphone. Please type instead.");
      recRef.current = null;
      setListening(false);
    }
  }, [continuous, listening, onTranscript, stop]);

  if (!supported) {
    return (
      <p className="text-sm text-stone-500">
        Voice input needs Chrome or Edge. You can type your answer instead.
      </p>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={start}
      disabled={disabled}
      aria-pressed={listening}
    >
      {listening ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      {listening ? "Stop" : "Speak instead"}
    </Button>
  );
}
