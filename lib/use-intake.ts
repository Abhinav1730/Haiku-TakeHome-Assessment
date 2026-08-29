"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ExtractedFields } from "@/lib/extract-prompt";
import { applyExtractedFields } from "@/lib/mapper";
import {
  createEmptyDraft,
  isStepComplete,
  type IntakeDraft,
  type StepId,
  visibleSteps,
} from "@/lib/questions";
import { intakeOutputSchema } from "@/lib/schema";
import { toIntakeOutput } from "@/lib/questions";
import {
  clearDraft,
  loadDraft,
  loadExtractFlag,
  loadExtractPreview,
  loadStep,
  saveDraft,
  saveExtractFlag,
  saveExtractPreview,
  saveOutput,
  saveStep,
} from "@/lib/storage";

export function useIntake() {
  const router = useRouter();
  const [draft, setDraft] = useState<IntakeDraft>(createEmptyDraft);
  const [stepId, setStepId] = useState<StepId>("story");
  const [hydrated, setHydrated] = useState(false);
  const [extracted, setExtracted] = useState(false);
  const [extractPreview, setExtractPreview] = useState<ExtractedFields | null>(null);

  useEffect(() => {
    const loaded = loadDraft();
    setDraft(loaded);
    setExtracted(loadExtractFlag());
    setExtractPreview(loadExtractPreview());
    const savedStep = loadStep() as StepId | null;
    if (savedStep) setStepId(savedStep);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveDraft(draft);
    saveExtractFlag(extracted);
    saveExtractPreview(extractPreview);
    saveStep(stepId);
  }, [draft, extracted, extractPreview, hydrated, stepId]);

  const draftRef = useRef(draft);
  draftRef.current = draft;
  const extractedRef = useRef(extracted);
  extractedRef.current = extracted;
  const stepIdRef = useRef(stepId);
  stepIdRef.current = stepId;

  const steps = useMemo(() => visibleSteps(draft, extracted), [draft, extracted]);
  const index = Math.max(0, steps.findIndex((s) => s.id === stepId));
  const step = steps[index] ?? steps[0];

  const goTo = useCallback(
    (id: StepId) => {
      setStepId(id);
    },
    [],
  );

  const update = useCallback((patch: Partial<IntakeDraft> | ((current: IntakeDraft) => IntakeDraft)) => {
    setDraft((current) =>
      typeof patch === "function" ? patch(current) : { ...current, ...patch },
    );
  }, []);

  const next = useCallback(() => {
    const list = visibleSteps(draftRef.current, extractedRef.current);
    const i = list.findIndex((s) => s.id === stepIdRef.current);
    const following = list[i + 1];
    if (following) setStepId(following.id);
  }, []);

  const back = useCallback(() => {
    const list = visibleSteps(draftRef.current, extractedRef.current);
    const i = list.findIndex((s) => s.id === stepIdRef.current);
    const prev = list[i - 1];
    if (prev) setStepId(prev.id);
    else router.push("/");
  }, [router]);

  const mergeExtract = useCallback((fields: ExtractedFields) => {
    setExtractPreview(fields);
    setExtracted(true);
    setDraft((current) => applyExtractedFields(current, fields));
    setStepId("confirm");
  }, []);

  const skipStory = useCallback(() => {
    setExtracted(false);
    setExtractPreview(null);
    setStepId("patient_context");
  }, []);

  const submit = useCallback(() => {
    try {
      const output = toIntakeOutput(draft);
      const parsed = intakeOutputSchema.parse(output);
      saveOutput(parsed);
      router.push("/done");
    } catch {
      toast.error("A few answers are still missing. Check the review list.");
    }
  }, [draft, router]);

  const reset = useCallback(() => {
    clearDraft();
    setDraft(createEmptyDraft());
    setExtracted(false);
    setExtractPreview(null);
    setStepId("story");
  }, []);

  const canContinue = step ? isStepComplete(step.id, draft) : false;

  return {
    draft,
    update,
    step,
    steps,
    index,
    hydrated,
    extracted,
    extractPreview,
    canContinue,
    next,
    back,
    goTo,
    mergeExtract,
    skipStory,
    submit,
    reset,
  };
}
