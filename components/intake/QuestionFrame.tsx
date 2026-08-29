"use client";

import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { progressForStep, type StepDef } from "@/lib/questions";

export function QuestionFrame({
  step,
  title,
  hint,
  why,
  children,
  onBack,
  footer,
}: {
  step: StepDef;
  title: string;
  hint?: string;
  why?: string;
  children: React.ReactNode;
  onBack: () => void;
  footer?: React.ReactNode;
}) {
  const progress = progressForStep(step);
  const showProgress = step.schemaN != null;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 pb-8 pt-4">
      <header className="mb-6 flex items-start gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} aria-label="Back">
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <div className="flex-1 pt-2">
          {showProgress ? (
            <p className="text-sm text-stone-500">
              {progress.current} of {progress.total}
              {progress.current < progress.total ? ` · about ${progress.minutesLeft} min left` : ""}
            </p>
          ) : (
            <p className="text-sm text-stone-500">Hair & scalp intake</p>
          )}
        </div>
      </header>

      <div className="flex-1">
        <h1 className="text-2xl font-semibold tracking-tight text-stone-900">{title}</h1>
        {hint ? <p className="mt-2 text-stone-600">{hint}</p> : null}
        {why ? (
          <details className="mt-3 text-sm text-stone-500">
            <summary className="cursor-pointer select-none">Why are we asking?</summary>
            <p className="mt-2 leading-relaxed">{why}</p>
          </details>
        ) : null}
        <div className="mt-6 space-y-3">{children}</div>
      </div>

      {footer ? <div className="mt-8">{footer}</div> : null}
    </div>
  );
}
