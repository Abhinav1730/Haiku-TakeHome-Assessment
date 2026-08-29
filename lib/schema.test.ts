import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  assertComplete,
  calmFemaleDraft,
  impatientMaleDraft,
  nonePathDraft,
} from "./fixtures";
import { toggleExclusive, visibleSteps } from "./questions";

describe("intake fill", () => {
  it("parses impatient male skip of Q6/Q7", () => {
    const out = assertComplete(impatientMaleDraft());
    assert.equal(out.menstrual_cycle, "Not applicable");
    assert.equal(out.pregnancy_related, "Not applicable");
    assert.equal(out.age_hair_loss_began, 24);
    assert.equal(out.habits.smoking, false);
    assert.equal(out.habits.smoking_severity, null);
    assert.equal(out.products["Topical Minoxidil"].used, true);
    assert.equal(out.products["Oral Minoxidil"].duration, null);
    assert.equal(out.consent, true);
  });

  it("parses calm female with PCOS and minoxidil", () => {
    const out = assertComplete(calmFemaleDraft());
    assert.equal(out.diagnosed_conditions[0], "PCOS/PCOD");
    assert.equal(out.menstrual_cycle, "Irregular");
    assert.equal(out.past_treatment_side_effects.yes, true);
    assert.ok(out.past_treatment_side_effects.describe?.includes("itchy"));
    assert.equal(out.procedures["PRP/GFC/iPRF"].done, true);
  });

  it("parses none path", () => {
    const out = assertComplete(nonePathDraft());
    assert.deepEqual(out.family_history, ["No known family history"]);
    assert.deepEqual(out.past_6_months, []);
    assert.equal(out.products.Supplements.used, false);
  });

  it("makes family none exclusive", () => {
    const once = toggleExclusive(["Father had hair loss"], "No known family history", "No known family history");
    assert.deepEqual(once, ["No known family history"]);
    const again = toggleExclusive(once, "Mother had hair loss", "No known family history");
    assert.deepEqual(again, ["Mother had hair loss"]);
  });

  it("skips female questions when gated off", () => {
    const steps = visibleSteps(impatientMaleDraft(), false).map((s) => s.id);
    assert.ok(!steps.includes("menstrual_cycle"));
    assert.ok(!steps.includes("pregnancy_related"));
  });
});
