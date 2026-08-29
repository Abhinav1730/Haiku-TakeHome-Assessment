import type { Habits, IntakeOutput, ProcedureRow, ProductRow } from "./schema";
import {
  CONDITIONS_NONE,
  CONDITION_OPTIONS,
  DURATION_OPTIONS,
  FAMILY_HISTORY_OPTIONS,
  FAMILY_NONE,
  MENSTRUAL_OPTIONS,
  PAST_6_MONTHS_OPTIONS,
  PATTERN_OPTIONS,
  PREGNANCY_OPTIONS,
  PROCEDURE_ROWS,
  PRODUCT_DURATION_OPTIONS,
  PRODUCT_ROWS,
  SAMPLE_TYPE_OPTIONS,
  SESSION_OPTIONS,
  SMOKING_SEVERITY_OPTIONS,
  unusedProcedureRow,
  unusedProductRow,
  WASH_FREQUENCY_OPTIONS,
} from "./schema";

export type PatientContext = "include_female_questions" | "skip_female_questions";

export type DraftHabits = {
  smoking: boolean | null;
  smoking_severity: (typeof SMOKING_SEVERITY_OPTIONS)[number] | null;
  alcohol: boolean | null;
  hard_water: boolean | null;
  hair_wash_frequency: (typeof WASH_FREQUENCY_OPTIONS)[number] | null;
  heating_tools_styling_chemicals: boolean | null;
  salon_treatments: boolean | null;
  salon_treatment_detail: string | null;
};

export type DraftProduct = Partial<ProductRow> & { used?: boolean | null };
export type DraftProcedure = Partial<ProcedureRow> & { done?: boolean | null };

export type IntakeDraft = {
  story: string;
  patient_context: PatientContext | null;
  age_hair_loss_began: number | null;
  duration: (typeof DURATION_OPTIONS)[number] | null;
  family_history: string[];
  pattern: string[];
  diagnosed_conditions: string[];
  menstrual_cycle: (typeof MENSTRUAL_OPTIONS)[number] | null;
  pregnancy_related: (typeof PREGNANCY_OPTIONS)[number] | null;
  adult_acne_oily_skin: boolean | null;
  excess_body_facial_hair: boolean | null;
  past_6_months: string[] | null;
  habits: DraftHabits;
  products: Record<(typeof PRODUCT_ROWS)[number], DraftProduct | null>;
  procedures: Record<(typeof PROCEDURE_ROWS)[number], DraftProcedure | null>;
  products_selected: boolean;
  procedures_selected: boolean;
  past_treatment_side_effects: boolean | null;
  past_treatment_describe: string | null;
  sample_type: (typeof SAMPLE_TYPE_OPTIONS)[number] | null;
  consent: boolean | null;
};

export function createEmptyDraft(): IntakeDraft {
  return {
    story: "",
    patient_context: null,
    age_hair_loss_began: null,
    duration: null,
    family_history: [],
    pattern: [],
    diagnosed_conditions: [],
    menstrual_cycle: null,
    pregnancy_related: null,
    adult_acne_oily_skin: null,
    excess_body_facial_hair: null,
    past_6_months: null,
    habits: {
      smoking: null,
      smoking_severity: null,
      alcohol: null,
      hard_water: null,
      hair_wash_frequency: null,
      heating_tools_styling_chemicals: null,
      salon_treatments: null,
      salon_treatment_detail: null,
    },
    products: {
      "OTC/Medicated Shampoos": null,
      "Hair Oils/Serums": null,
      "Topical Minoxidil": null,
      "Oral Minoxidil": null,
      Supplements: null,
    },
    procedures: {
      "PRP/GFC/iPRF": null,
      "Stem Cells/Exosomes": null,
      "Hair Transplant": null,
      Other: null,
    },
    products_selected: false,
    procedures_selected: false,
    past_treatment_side_effects: null,
    past_treatment_describe: null,
    sample_type: null,
    consent: null,
  };
}

export type StepId =
  | "story"
  | "confirm"
  | "patient_context"
  | "age_hair_loss_began"
  | "duration"
  | "family_history"
  | "pattern"
  | "diagnosed_conditions"
  | "menstrual_cycle"
  | "pregnancy_related"
  | "adult_acne_oily_skin"
  | "excess_body_facial_hair"
  | "past_6_months"
  | "habit_smoking"
  | "habit_smoking_severity"
  | "habit_alcohol"
  | "habit_hard_water"
  | "habit_wash"
  | "habit_heating"
  | "habit_salon"
  | "habit_salon_detail"
  | "products_select"
  | "products_detail"
  | "procedures_select"
  | "procedures_detail"
  | "past_treatment"
  | "past_treatment_describe"
  | "sample_type"
  | "consent"
  | "review";

export type StepDef = {
  id: StepId;
  schemaN: number | null;
  skip?: (draft: IntakeDraft) => boolean;
};

export const STEP_DEFS: StepDef[] = [
  { id: "story", schemaN: null },
  { id: "confirm", schemaN: null, skip: (d) => !d.story.trim() },
  { id: "patient_context", schemaN: null },
  { id: "age_hair_loss_began", schemaN: 1 },
  { id: "duration", schemaN: 2 },
  { id: "family_history", schemaN: 3 },
  { id: "pattern", schemaN: 4 },
  { id: "diagnosed_conditions", schemaN: 5 },
  {
    id: "menstrual_cycle",
    schemaN: 6,
    skip: (d) => d.patient_context !== "include_female_questions",
  },
  {
    id: "pregnancy_related",
    schemaN: 7,
    skip: (d) => d.patient_context !== "include_female_questions",
  },
  { id: "adult_acne_oily_skin", schemaN: 8 },
  { id: "excess_body_facial_hair", schemaN: 9 },
  { id: "past_6_months", schemaN: 10 },
  { id: "habit_smoking", schemaN: 11 },
  {
    id: "habit_smoking_severity",
    schemaN: 11,
    skip: (d) => d.habits.smoking !== true,
  },
  { id: "habit_alcohol", schemaN: 11 },
  { id: "habit_hard_water", schemaN: 11 },
  { id: "habit_wash", schemaN: 11 },
  { id: "habit_heating", schemaN: 11 },
  { id: "habit_salon", schemaN: 11 },
  {
    id: "habit_salon_detail",
    schemaN: 11,
    skip: (d) => d.habits.salon_treatments !== true,
  },
  { id: "products_select", schemaN: 12 },
  { id: "products_detail", schemaN: 12, skip: (d) => !hasUsedProduct(d) },
  { id: "procedures_select", schemaN: 13 },
  { id: "procedures_detail", schemaN: 13, skip: (d) => !hasDoneProcedure(d) },
  { id: "past_treatment", schemaN: 14 },
  {
    id: "past_treatment_describe",
    schemaN: 14,
    skip: (d) => d.past_treatment_side_effects !== true,
  },
  { id: "sample_type", schemaN: 15 },
  { id: "consent", schemaN: 16 },
  { id: "review", schemaN: null },
];

export function visibleSteps(draft: IntakeDraft, extracted = false): StepDef[] {
  return STEP_DEFS.filter((step) => {
    if (step.id === "confirm" && !extracted) return false;
    if (step.skip?.(draft)) return false;
    return true;
  });
}

export function hasUsedProduct(draft: IntakeDraft) {
  return PRODUCT_ROWS.some((row) => draft.products[row]?.used === true);
}

export function hasDoneProcedure(draft: IntakeDraft) {
  return PROCEDURE_ROWS.some((row) => draft.procedures[row]?.done === true);
}

export function toggleExclusive(
  current: string[],
  value: string,
  noneValue: string,
): string[] {
  if (value === noneValue) {
    return current.includes(noneValue) ? [] : [noneValue];
  }
  const withoutNone = current.filter((item) => item !== noneValue);
  if (withoutNone.includes(value)) {
    return withoutNone.filter((item) => item !== value);
  }
  return [...withoutNone, value];
}

export const SCHEMA_TOTAL = 16;

export function progressForStep(step: StepDef): { current: number; total: number; minutesLeft: number } {
  const n = step.schemaN ?? (step.id === "review" || step.id === "consent" ? 16 : 1);
  const current = Math.min(Math.max(n, 1), SCHEMA_TOTAL);
  const remaining = SCHEMA_TOTAL - current;
  const minutesLeft = Math.max(1, Math.ceil((remaining / SCHEMA_TOTAL) * 4));
  return { current, total: SCHEMA_TOTAL, minutesLeft };
}

export function isStepComplete(id: StepId, draft: IntakeDraft): boolean {
  switch (id) {
    case "story":
    case "confirm":
    case "review":
      return true;
    case "patient_context":
      return draft.patient_context !== null;
    case "age_hair_loss_began":
      return (
        typeof draft.age_hair_loss_began === "number" &&
        draft.age_hair_loss_began >= 1 &&
        draft.age_hair_loss_began <= 90
      );
    case "duration":
      return draft.duration !== null;
    case "family_history":
      return draft.family_history.length > 0;
    case "pattern":
      return draft.pattern.length > 0;
    case "diagnosed_conditions":
      return draft.diagnosed_conditions.length > 0;
    case "menstrual_cycle":
      return draft.menstrual_cycle !== null;
    case "pregnancy_related":
      return draft.pregnancy_related !== null;
    case "adult_acne_oily_skin":
      return draft.adult_acne_oily_skin !== null;
    case "excess_body_facial_hair":
      return draft.excess_body_facial_hair !== null;
    case "past_6_months":
      return draft.past_6_months !== null;
    case "habit_smoking":
      return draft.habits.smoking !== null;
    case "habit_smoking_severity":
      return draft.habits.smoking_severity !== null;
    case "habit_alcohol":
      return draft.habits.alcohol !== null;
    case "habit_hard_water":
      return draft.habits.hard_water !== null;
    case "habit_wash":
      return draft.habits.hair_wash_frequency !== null;
    case "habit_heating":
      return draft.habits.heating_tools_styling_chemicals !== null;
    case "habit_salon":
      return draft.habits.salon_treatments !== null;
    case "habit_salon_detail":
      return Boolean(draft.habits.salon_treatment_detail?.trim());
    case "products_select":
      return draft.products_selected;
    case "products_detail":
      return PRODUCT_ROWS.filter((row) => draft.products[row]?.used).every((row) => {
        const p = draft.products[row];
        return p?.duration && p.helped !== null && p.side_effects !== null;
      });
    case "procedures_select":
      return draft.procedures_selected;
    case "procedures_detail":
      return PROCEDURE_ROWS.filter((row) => draft.procedures[row]?.done).every((row) => {
        const p = draft.procedures[row];
        return p?.sessions && p.helped !== null;
      });
    case "past_treatment":
      return draft.past_treatment_side_effects !== null;
    case "past_treatment_describe":
      return Boolean(draft.past_treatment_describe?.trim());
    case "sample_type":
      return draft.sample_type !== null;
    case "consent":
      return draft.consent !== null;
    default:
      return false;
  }
}

export function toIntakeOutput(draft: IntakeDraft): IntakeOutput {
  if (draft.age_hair_loss_began == null) throw new Error("age required");
  if (!draft.duration) throw new Error("duration required");
  if (!draft.sample_type) throw new Error("sample required");
  if (draft.consent == null) throw new Error("consent required");
  if (draft.adult_acne_oily_skin == null) throw new Error("acne required");
  if (draft.excess_body_facial_hair == null) throw new Error("hair growth required");
  if (draft.past_6_months == null) throw new Error("past 6 months required");
  if (draft.past_treatment_side_effects == null) throw new Error("side effects required");

  const skipFemale = draft.patient_context !== "include_female_questions";

  const products = Object.fromEntries(
    PRODUCT_ROWS.map((row) => {
      const p = draft.products[row];
      if (!p?.used) return [row, unusedProductRow()];
      return [
        row,
        {
          used: true,
          duration: p.duration ?? "<3mo",
          helped: p.helped ?? false,
          side_effects: p.side_effects ?? false,
        },
      ];
    }),
  ) as IntakeOutput["products"];

  const procedures = Object.fromEntries(
    PROCEDURE_ROWS.map((row) => {
      const p = draft.procedures[row];
      if (!p?.done) return [row, unusedProcedureRow()];
      return [
        row,
        {
          done: true,
          sessions: p.sessions ?? "1-3",
          helped: p.helped ?? false,
        },
      ];
    }),
  ) as IntakeOutput["procedures"];

  const habits: Habits = {
    smoking: Boolean(draft.habits.smoking),
    smoking_severity: draft.habits.smoking ? draft.habits.smoking_severity : null,
    alcohol: Boolean(draft.habits.alcohol),
    hard_water: Boolean(draft.habits.hard_water),
    hair_wash_frequency: draft.habits.hair_wash_frequency ?? "Alternate Days",
    heating_tools_styling_chemicals: Boolean(draft.habits.heating_tools_styling_chemicals),
    salon_treatments: Boolean(draft.habits.salon_treatments),
    salon_treatment_detail: draft.habits.salon_treatments
      ? draft.habits.salon_treatment_detail?.trim() || null
      : null,
  };

  return {
    form: "GenoRoot Hair & Scalp Intake",
    age_hair_loss_began: draft.age_hair_loss_began,
    duration: draft.duration,
    family_history: draft.family_history as IntakeOutput["family_history"],
    pattern: draft.pattern as IntakeOutput["pattern"],
    diagnosed_conditions: draft.diagnosed_conditions as IntakeOutput["diagnosed_conditions"],
    menstrual_cycle: skipFemale ? "Not applicable" : (draft.menstrual_cycle ?? "Not applicable"),
    pregnancy_related: skipFemale ? "Not applicable" : (draft.pregnancy_related ?? "Not applicable"),
    adult_acne_oily_skin: draft.adult_acne_oily_skin,
    excess_body_facial_hair: draft.excess_body_facial_hair,
    past_6_months: draft.past_6_months as IntakeOutput["past_6_months"],
    habits,
    products,
    procedures,
    past_treatment_side_effects: {
      yes: draft.past_treatment_side_effects,
      describe: draft.past_treatment_side_effects
        ? draft.past_treatment_describe?.trim() || null
        : null,
    },
    sample_type: draft.sample_type,
    consent: draft.consent,
  };
}

export const OPTION_SETS = {
  duration: DURATION_OPTIONS,
  family: FAMILY_HISTORY_OPTIONS,
  pattern: PATTERN_OPTIONS,
  conditions: CONDITION_OPTIONS,
  menstrual: MENSTRUAL_OPTIONS,
  pregnancy: PREGNANCY_OPTIONS,
  past6: PAST_6_MONTHS_OPTIONS,
  familyNone: FAMILY_NONE,
  conditionsNone: CONDITIONS_NONE,
};
