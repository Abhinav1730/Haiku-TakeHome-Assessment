import type { ExtractedFields } from "./extract-prompt";
import type { IntakeDraft } from "./questions";
import { PROCEDURE_ROWS, PRODUCT_ROWS } from "./schema";

export function applyExtractedFields(
  draft: IntakeDraft,
  fields: ExtractedFields,
): IntakeDraft {
  const next: IntakeDraft = {
    ...draft,
    habits: { ...draft.habits },
    products: { ...draft.products },
    procedures: { ...draft.procedures },
  };

  if (fields.patient_context) next.patient_context = fields.patient_context;
  if (typeof fields.age_hair_loss_began === "number") {
    next.age_hair_loss_began = fields.age_hair_loss_began;
  }
  if (fields.duration) next.duration = fields.duration;
  if (fields.family_history?.length) next.family_history = fields.family_history;
  if (fields.pattern?.length) next.pattern = fields.pattern;
  if (fields.diagnosed_conditions?.length) {
    next.diagnosed_conditions = fields.diagnosed_conditions;
  }
  if (fields.menstrual_cycle) next.menstrual_cycle = fields.menstrual_cycle;
  if (fields.pregnancy_related) next.pregnancy_related = fields.pregnancy_related;
  if (typeof fields.adult_acne_oily_skin === "boolean") {
    next.adult_acne_oily_skin = fields.adult_acne_oily_skin;
  }
  if (typeof fields.excess_body_facial_hair === "boolean") {
    next.excess_body_facial_hair = fields.excess_body_facial_hair;
  }
  if (fields.past_6_months) next.past_6_months = fields.past_6_months;
  if (typeof fields.smoking === "boolean") next.habits.smoking = fields.smoking;
  if (typeof fields.alcohol === "boolean") next.habits.alcohol = fields.alcohol;
  if (fields.salon_treatment_detail) {
    next.habits.salon_treatments = true;
    next.habits.salon_treatment_detail = fields.salon_treatment_detail;
  }
  if (typeof fields.past_treatment_side_effects === "boolean") {
    next.past_treatment_side_effects = fields.past_treatment_side_effects;
  }
  if (fields.past_treatment_describe) {
    next.past_treatment_describe = fields.past_treatment_describe;
    next.past_treatment_side_effects = true;
  }

  if (fields.used_products?.length) {
    next.products_selected = true;
    for (const row of PRODUCT_ROWS) {
      const used = fields.used_products.includes(row);
      next.products[row] = used
        ? { used: true, duration: null, helped: null, side_effects: null }
        : { used: false, duration: null, helped: null, side_effects: null };
    }
  }

  if (fields.done_procedures?.length) {
    next.procedures_selected = true;
    for (const row of PROCEDURE_ROWS) {
      const done = fields.done_procedures.includes(row);
      next.procedures[row] = done
        ? { done: true, sessions: null, helped: null }
        : { done: false, sessions: null, helped: null };
    }
  }

  return next;
}

export function summarizeExtracted(fields: ExtractedFields): { label: string; value: string }[] {
  const rows: { label: string; value: string }[] = [];
  const add = (label: string, value: string | number | boolean | string[] | null | undefined) => {
    if (value == null) return;
    if (Array.isArray(value) && value.length === 0) return;
    const text = Array.isArray(value)
      ? value.join(", ")
      : typeof value === "boolean"
        ? value
          ? "Yes"
          : "No"
        : String(value);
    rows.push({ label, value: text });
  };

  add("Ask about periods / pregnancy", fields.patient_context === "include_female_questions" ? "Yes" : fields.patient_context === "skip_female_questions" ? "No" : null);
  add("Age when it started", fields.age_hair_loss_began);
  add("Duration", fields.duration);
  add("Family history", fields.family_history);
  add("Pattern", fields.pattern);
  add("Health conditions", fields.diagnosed_conditions);
  add("Menstrual cycle", fields.menstrual_cycle);
  add("Pregnancy-related", fields.pregnancy_related);
  add("Adult acne / oily skin", fields.adult_acne_oily_skin);
  add("Extra body or facial hair", fields.excess_body_facial_hair);
  add("Past 6 months", fields.past_6_months);
  add("Products used", fields.used_products);
  add("Clinic procedures", fields.done_procedures);
  add("Smoking", fields.smoking);
  add("Alcohol", fields.alcohol);
  add("Salon treatments", fields.salon_treatment_detail);
  add("Past treatment side effects", fields.past_treatment_side_effects);
  add("What happened", fields.past_treatment_describe);
  return rows;
}
