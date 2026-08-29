import { createEmptyDraft, type IntakeDraft } from "./questions";
import { intakeOutputSchema } from "./schema";
import { toIntakeOutput } from "./questions";

export function impatientMaleDraft(): IntakeDraft {
  const draft = createEmptyDraft();
  return {
    ...draft,
    patient_context: "skip_female_questions",
    menstrual_cycle: "Not applicable",
    pregnancy_related: "Not applicable",
    age_hair_loss_began: 24,
    duration: "Over a year",
    family_history: ["Father had hair loss"],
    pattern: ["Receding hairline", "Thinning at crown"],
    diagnosed_conditions: ["None"],
    adult_acne_oily_skin: true,
    excess_body_facial_hair: false,
    past_6_months: ["High stress or emotional trauma"],
    habits: {
      smoking: false,
      smoking_severity: null,
      alcohol: true,
      hard_water: true,
      hair_wash_frequency: "Alternate Days",
      heating_tools_styling_chemicals: false,
      salon_treatments: false,
      salon_treatment_detail: null,
    },
    products_selected: true,
    products: {
      "OTC/Medicated Shampoos": { used: false, duration: null, helped: null, side_effects: null },
      "Hair Oils/Serums": { used: true, duration: ">6mo", helped: false, side_effects: false },
      "Topical Minoxidil": { used: true, duration: "3-6mo", helped: true, side_effects: false },
      "Oral Minoxidil": { used: false, duration: null, helped: null, side_effects: null },
      Supplements: { used: false, duration: null, helped: null, side_effects: null },
    },
    procedures_selected: true,
    procedures: {
      "PRP/GFC/iPRF": { done: false, sessions: null, helped: null },
      "Stem Cells/Exosomes": { done: false, sessions: null, helped: null },
      "Hair Transplant": { done: false, sessions: null, helped: null },
      Other: { done: false, sessions: null, helped: null },
    },
    past_treatment_side_effects: false,
    past_treatment_describe: null,
    sample_type: "Saliva",
    consent: true,
  };
}

export function calmFemaleDraft(): IntakeDraft {
  const draft = createEmptyDraft();
  return {
    ...draft,
    story: "PCOS, thinning at the part, tried minoxidil, shedding after fever.",
    patient_context: "include_female_questions",
    age_hair_loss_began: 28,
    duration: "Over a year",
    family_history: ["Mother had hair loss"],
    pattern: ["Widening part line", "Diffuse thinning"],
    diagnosed_conditions: ["PCOS/PCOD"],
    menstrual_cycle: "Irregular",
    pregnancy_related: "Not applicable",
    adult_acne_oily_skin: true,
    excess_body_facial_hair: true,
    past_6_months: ["Fever with illness (COVID, Dengue, Typhoid)"],
    habits: {
      smoking: false,
      smoking_severity: null,
      alcohol: false,
      hard_water: false,
      hair_wash_frequency: "Daily",
      heating_tools_styling_chemicals: true,
      salon_treatments: true,
      salon_treatment_detail: "keratin",
    },
    products_selected: true,
    products: {
      "OTC/Medicated Shampoos": { used: true, duration: "<3mo", helped: false, side_effects: false },
      "Hair Oils/Serums": { used: false, duration: null, helped: null, side_effects: null },
      "Topical Minoxidil": { used: true, duration: "3-6mo", helped: false, side_effects: true },
      "Oral Minoxidil": { used: false, duration: null, helped: null, side_effects: null },
      Supplements: { used: true, duration: ">6mo", helped: true, side_effects: false },
    },
    procedures_selected: true,
    procedures: {
      "PRP/GFC/iPRF": { done: true, sessions: "1-3", helped: false },
      "Stem Cells/Exosomes": { done: false, sessions: null, helped: null },
      "Hair Transplant": { done: false, sessions: null, helped: null },
      Other: { done: false, sessions: null, helped: null },
    },
    past_treatment_side_effects: true,
    past_treatment_describe: "Topical minoxidil made the scalp itchy",
    sample_type: "Either",
    consent: true,
  };
}

export function nonePathDraft(): IntakeDraft {
  const draft = impatientMaleDraft();
  return {
    ...draft,
    family_history: ["No known family history"],
    diagnosed_conditions: ["None"],
    past_6_months: [],
    pattern: ["Sudden excessive shedding"],
    products: {
      "OTC/Medicated Shampoos": { used: false, duration: null, helped: null, side_effects: null },
      "Hair Oils/Serums": { used: false, duration: null, helped: null, side_effects: null },
      "Topical Minoxidil": { used: false, duration: null, helped: null, side_effects: null },
      "Oral Minoxidil": { used: false, duration: null, helped: null, side_effects: null },
      Supplements: { used: false, duration: null, helped: null, side_effects: null },
    },
  };
}

export function assertComplete(draft: IntakeDraft) {
  return intakeOutputSchema.parse(toIntakeOutput(draft));
}
