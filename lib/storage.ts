import type { ExtractedFields } from "./extract-prompt";
import type { IntakeDraft } from "./questions";
import { createEmptyDraft } from "./questions";
import type { IntakeOutput } from "./schema";

const DRAFT_KEY = "haiku-intake-draft-v1";
const OUTPUT_KEY = "haiku-intake-output-v1";
const EXTRACT_KEY = "haiku-intake-extract-v1";
const STEP_KEY = "haiku-intake-step-v1";
const EXTRACT_PREVIEW_KEY = "haiku-intake-extract-preview-v1";

export function saveStep(id: string) {
  localStorage.setItem(STEP_KEY, id);
}

export function loadStep(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STEP_KEY);
}

export function loadDraft(): IntakeDraft {
  if (typeof window === "undefined") return createEmptyDraft();
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return createEmptyDraft();
    return { ...createEmptyDraft(), ...JSON.parse(raw) };
  } catch {
    return createEmptyDraft();
  }
}

export function saveDraft(draft: IntakeDraft) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

export function clearDraft() {
  localStorage.removeItem(DRAFT_KEY);
  localStorage.removeItem(EXTRACT_KEY);
  localStorage.removeItem(STEP_KEY);
  localStorage.removeItem(EXTRACT_PREVIEW_KEY);
}

export function saveOutput(output: IntakeOutput) {
  localStorage.setItem(OUTPUT_KEY, JSON.stringify(output));
}

export function loadOutput(): IntakeOutput | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(OUTPUT_KEY);
    return raw ? (JSON.parse(raw) as IntakeOutput) : null;
  } catch {
    return null;
  }
}

export function saveExtractFlag(on: boolean) {
  localStorage.setItem(EXTRACT_KEY, on ? "1" : "0");
}

export function saveExtractPreview(fields: ExtractedFields | null) {
  if (fields) localStorage.setItem(EXTRACT_PREVIEW_KEY, JSON.stringify(fields));
  else localStorage.removeItem(EXTRACT_PREVIEW_KEY);
}

export function loadExtractPreview(): ExtractedFields | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(EXTRACT_PREVIEW_KEY);
    return raw ? (JSON.parse(raw) as ExtractedFields) : null;
  } catch {
    return null;
  }
}

export function loadExtractFlag() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(EXTRACT_KEY) === "1";
}
