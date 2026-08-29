import { z } from "zod";

export const DURATION_OPTIONS = [
  "Less than 6 months",
  "6-12 months",
  "Over a year",
] as const;

export const FAMILY_HISTORY_OPTIONS = [
  "Father had hair loss",
  "Mother had hair loss",
  "Siblings with thinning or baldness",
  "No known family history",
] as const;

export const PATTERN_OPTIONS = [
  "Receding hairline",
  "Thinning at crown",
  "Widening part line",
  "Diffuse thinning",
  "Patchy loss",
  "Sudden excessive shedding",
] as const;

export const CONDITION_OPTIONS = [
  "PCOS/PCOD",
  "Thyroid disorder",
  "Diabetes",
  "Autoimmune disease",
  "Anemia",
  "None",
] as const;

export const MENSTRUAL_OPTIONS = [
  "Regular",
  "Irregular",
  "Menopausal",
  "Not applicable",
] as const;

export const PREGNANCY_OPTIONS = [
  "Currently pregnant",
  "Postpartum <1 year",
  "Not applicable",
] as const;

export const PAST_6_MONTHS_OPTIONS = [
  "Crash dieting or major weight loss",
  "High stress or emotional trauma",
  "Fever with illness (COVID, Dengue, Typhoid)",
  "Recent surgery",
  "Change in location/water/air quality",
] as const;

export const SMOKING_SEVERITY_OPTIONS = [
  "Mild <5/day",
  "Moderate 5-10/day",
  "Severe >10/day",
] as const;

export const WASH_FREQUENCY_OPTIONS = [
  "Daily",
  "Alternate Days",
  "Weekly",
] as const;

export const PRODUCT_ROWS = [
  "OTC/Medicated Shampoos",
  "Hair Oils/Serums",
  "Topical Minoxidil",
  "Oral Minoxidil",
  "Supplements",
] as const;

export const PRODUCT_DURATION_OPTIONS = ["<3mo", "3-6mo", ">6mo"] as const;

export const PROCEDURE_ROWS = [
  "PRP/GFC/iPRF",
  "Stem Cells/Exosomes",
  "Hair Transplant",
  "Other",
] as const;

export const SESSION_OPTIONS = ["1-3", "4-6", ">6"] as const;

export const SAMPLE_TYPE_OPTIONS = ["Saliva", "Blood", "Either"] as const;

export const FAMILY_NONE = "No known family history";
export const CONDITIONS_NONE = "None";

export const productRowSchema = z.object({
  used: z.boolean(),
  duration: z.enum(PRODUCT_DURATION_OPTIONS).nullable(),
  helped: z.boolean().nullable(),
  side_effects: z.boolean().nullable(),
});

export const procedureRowSchema = z.object({
  done: z.boolean(),
  sessions: z.enum(SESSION_OPTIONS).nullable(),
  helped: z.boolean().nullable(),
});

export const habitsSchema = z.object({
  smoking: z.boolean(),
  smoking_severity: z.enum(SMOKING_SEVERITY_OPTIONS).nullable(),
  alcohol: z.boolean(),
  hard_water: z.boolean(),
  hair_wash_frequency: z.enum(WASH_FREQUENCY_OPTIONS),
  heating_tools_styling_chemicals: z.boolean(),
  salon_treatments: z.boolean(),
  salon_treatment_detail: z.string().nullable(),
});

export const intakeOutputSchema = z.object({
  form: z.literal("GenoRoot Hair & Scalp Intake"),
  age_hair_loss_began: z.number().int().min(1).max(90),
  duration: z.enum(DURATION_OPTIONS),
  family_history: z.array(z.enum(FAMILY_HISTORY_OPTIONS)).min(1),
  pattern: z.array(z.enum(PATTERN_OPTIONS)).min(1),
  diagnosed_conditions: z.array(z.enum(CONDITION_OPTIONS)).min(1),
  menstrual_cycle: z.enum(MENSTRUAL_OPTIONS),
  pregnancy_related: z.enum(PREGNANCY_OPTIONS),
  adult_acne_oily_skin: z.boolean(),
  excess_body_facial_hair: z.boolean(),
  past_6_months: z.array(z.enum(PAST_6_MONTHS_OPTIONS)),
  habits: habitsSchema,
  products: z.object({
    "OTC/Medicated Shampoos": productRowSchema,
    "Hair Oils/Serums": productRowSchema,
    "Topical Minoxidil": productRowSchema,
    "Oral Minoxidil": productRowSchema,
    Supplements: productRowSchema,
  }),
  procedures: z.object({
    "PRP/GFC/iPRF": procedureRowSchema,
    "Stem Cells/Exosomes": procedureRowSchema,
    "Hair Transplant": procedureRowSchema,
    Other: procedureRowSchema,
  }),
  past_treatment_side_effects: z.object({
    yes: z.boolean(),
    describe: z.string().nullable(),
  }),
  sample_type: z.enum(SAMPLE_TYPE_OPTIONS),
  consent: z.boolean(),
});

export type IntakeOutput = z.infer<typeof intakeOutputSchema>;
export type ProductRow = z.infer<typeof productRowSchema>;
export type ProcedureRow = z.infer<typeof procedureRowSchema>;
export type Habits = z.infer<typeof habitsSchema>;

export function emptyProductRow(used: boolean): ProductRow {
  return {
    used,
    duration: used ? "<3mo" : null,
    helped: used ? false : null,
    side_effects: used ? false : null,
  };
}

export function unusedProductRow(): ProductRow {
  return { used: false, duration: null, helped: null, side_effects: null };
}

export function unusedProcedureRow(): ProcedureRow {
  return { done: false, sessions: null, helped: null };
}

export function emptyProcedureRow(done: boolean): ProcedureRow {
  return {
    done,
    sessions: done ? "1-3" : null,
    helped: done ? false : null,
  };
}
