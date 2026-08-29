import { z } from "zod";
import {
  CONDITION_OPTIONS,
  DURATION_OPTIONS,
  FAMILY_HISTORY_OPTIONS,
  MENSTRUAL_OPTIONS,
  PAST_6_MONTHS_OPTIONS,
  PATTERN_OPTIONS,
  PREGNANCY_OPTIONS,
  PROCEDURE_ROWS,
  PRODUCT_ROWS,
} from "./schema";

export const extractedFieldsSchema = z.object({
  patient_context: z
    .enum(["include_female_questions", "skip_female_questions"])
    .nullable()
    .optional(),
  age_hair_loss_began: z.number().int().min(1).max(90).nullable().optional(),
  duration: z.enum(DURATION_OPTIONS).nullable().optional(),
  family_history: z.array(z.enum(FAMILY_HISTORY_OPTIONS)).nullable().optional(),
  pattern: z.array(z.enum(PATTERN_OPTIONS)).nullable().optional(),
  diagnosed_conditions: z.array(z.enum(CONDITION_OPTIONS)).nullable().optional(),
  menstrual_cycle: z.enum(MENSTRUAL_OPTIONS).nullable().optional(),
  pregnancy_related: z.enum(PREGNANCY_OPTIONS).nullable().optional(),
  adult_acne_oily_skin: z.boolean().nullable().optional(),
  excess_body_facial_hair: z.boolean().nullable().optional(),
  past_6_months: z.array(z.enum(PAST_6_MONTHS_OPTIONS)).nullable().optional(),
  used_products: z.array(z.enum(PRODUCT_ROWS)).nullable().optional(),
  done_procedures: z.array(z.enum(PROCEDURE_ROWS)).nullable().optional(),
  smoking: z.boolean().nullable().optional(),
  alcohol: z.boolean().nullable().optional(),
  salon_treatment_detail: z.string().nullable().optional(),
  past_treatment_side_effects: z.boolean().nullable().optional(),
  past_treatment_describe: z.string().nullable().optional(),
});

export const extractResponseSchema = z.object({
  fields: extractedFieldsSchema,
  notes: z.array(z.string()),
});

export type ExtractedFields = z.infer<typeof extractedFieldsSchema>;
export type ExtractResponse = z.infer<typeof extractResponseSchema>;

export const EXTRACT_JSON_SCHEMA = {
  name: "hair_intake_extract",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      fields: {
        type: "object",
        additionalProperties: false,
        properties: {
          patient_context: {
            type: ["string", "null"],
            enum: ["include_female_questions", "skip_female_questions", null],
          },
          age_hair_loss_began: { type: ["integer", "null"] },
          duration: {
            type: ["string", "null"],
            enum: [...DURATION_OPTIONS, null],
          },
          family_history: {
            type: ["array", "null"],
            items: { type: "string", enum: [...FAMILY_HISTORY_OPTIONS] },
          },
          pattern: {
            type: ["array", "null"],
            items: { type: "string", enum: [...PATTERN_OPTIONS] },
          },
          diagnosed_conditions: {
            type: ["array", "null"],
            items: { type: "string", enum: [...CONDITION_OPTIONS] },
          },
          menstrual_cycle: {
            type: ["string", "null"],
            enum: [...MENSTRUAL_OPTIONS, null],
          },
          pregnancy_related: {
            type: ["string", "null"],
            enum: [...PREGNANCY_OPTIONS, null],
          },
          adult_acne_oily_skin: { type: ["boolean", "null"] },
          excess_body_facial_hair: { type: ["boolean", "null"] },
          past_6_months: {
            type: ["array", "null"],
            items: { type: "string", enum: [...PAST_6_MONTHS_OPTIONS] },
          },
          used_products: {
            type: ["array", "null"],
            items: { type: "string", enum: [...PRODUCT_ROWS] },
          },
          done_procedures: {
            type: ["array", "null"],
            items: { type: "string", enum: [...PROCEDURE_ROWS] },
          },
          smoking: { type: ["boolean", "null"] },
          alcohol: { type: ["boolean", "null"] },
          salon_treatment_detail: { type: ["string", "null"] },
          past_treatment_side_effects: { type: ["boolean", "null"] },
          past_treatment_describe: { type: ["string", "null"] },
        },
        required: [
          "patient_context",
          "age_hair_loss_began",
          "duration",
          "family_history",
          "pattern",
          "diagnosed_conditions",
          "menstrual_cycle",
          "pregnancy_related",
          "adult_acne_oily_skin",
          "excess_body_facial_hair",
          "past_6_months",
          "used_products",
          "done_procedures",
          "smoking",
          "alcohol",
          "salon_treatment_detail",
          "past_treatment_side_effects",
          "past_treatment_describe",
        ],
      },
      notes: { type: "array", items: { type: "string" } },
    },
    required: ["fields", "notes"],
  },
} as const;

export const SYSTEM_PROMPT = `You structure a hair-clinic patient's own words into a fixed intake schema.

Rules:
- Map only what the patient clearly said. If uncertain, return null for that field.
- Never diagnose (do not name androgenetic alopecia or similar).
- Never invent ages, medication names, or dates.
- Use only the allowed enum values.
- patient_context: include_female_questions if they mention periods, pregnancy, PCOS/PCOD as their own condition, or being a woman. skip_female_questions only if they clearly identify as a man or say questions about periods/pregnancy do not apply. Otherwise null.
- age_hair_loss_began is the age (years) when hair loss started, not current age, and only if they stated that age explicitly.
- duration is how long hair loss has been happening, not age.
- family_history: if they say no one in the family, use only "No known family history".
- diagnosed_conditions: if they say none, use only "None".
- used_products / done_procedures: list only items they said they used or had done.
- notes: short quotes or reasons for each filled field. Empty array if nothing extracted.`;
