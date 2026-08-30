"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ChipList, ChoiceList, YesNo } from "@/components/intake/Choices";
import { QuestionFrame } from "@/components/intake/QuestionFrame";
import { VoiceCapture } from "@/components/intake/VoiceCapture";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { summarizeExtracted } from "@/lib/mapper";
import {
  OPTION_SETS,
  toggleExclusive,
  type IntakeDraft,
  type StepId,
} from "@/lib/questions";
import {
  PROCEDURE_ROWS,
  PRODUCT_DURATION_OPTIONS,
  PRODUCT_ROWS,
  SAMPLE_TYPE_OPTIONS,
  SESSION_OPTIONS,
  SMOKING_SEVERITY_OPTIONS,
  WASH_FREQUENCY_OPTIONS,
} from "@/lib/schema";
import { useIntake } from "@/lib/use-intake";

const PRODUCT_HINTS: Record<(typeof PRODUCT_ROWS)[number], string> = {
  "OTC/Medicated Shampoos": "Ketoconazole, anti-dandruff, clinic shampoos",
  "Hair Oils/Serums": "Coconut, rosemary, drugstore serums",
  "Topical Minoxidil": "Foam or liquid on the scalp",
  "Oral Minoxidil": "Tablet prescribed for hair",
  Supplements: "Biotin, iron, hair gummies",
};

const PROCEDURE_HINTS: Record<(typeof PROCEDURE_ROWS)[number], string> = {
  "PRP/GFC/iPRF": "Clinic injections from your blood",
  "Stem Cells/Exosomes": "Clinic regenerative sessions",
  "Hair Transplant": "Surgical grafts",
  Other: "Anything else done in a clinic",
};

export function IntakeWizard() {
  const intake = useIntake();
  const { draft, update, step, next, back, canContinue, hydrated } = intake;

  useEffect(() => {
    const handler = () => next();
    document.addEventListener("intake-advance", handler);
    return () => document.removeEventListener("intake-advance", handler);
  }, [next]);

  if (!hydrated || !step) {
    return <div className="p-8 text-stone-500">Loading…</div>;
  }

  const continueFooter = (
    <Button className="w-full" disabled={!canContinue} onClick={next}>
      Continue
    </Button>
  );

  const common = { step, onBack: back };

  switch (step.id) {
    case "story":
      return <StoryStep intake={intake} />;
    case "confirm":
      return <ConfirmStep intake={intake} />;
    case "patient_context":
      return (
        <QuestionFrame
          {...common}
          title="Should we ask about periods and pregnancy?"
          hint="This only decides whether two questions apply. You can skip them."
        >
          <ChoiceList
            autoAdvance
            value={draft.patient_context}
            onChange={(v) =>
              update({
                patient_context: v as IntakeDraft["patient_context"],
                menstrual_cycle:
                  v === "skip_female_questions" ? "Not applicable" : draft.menstrual_cycle,
                pregnancy_related:
                  v === "skip_female_questions" ? "Not applicable" : draft.pregnancy_related,
              })
            }
            options={[
              { value: "include_female_questions", label: "Yes, include those questions" },
              { value: "skip_female_questions", label: "No, that’s not me" },
            ]}
          />
        </QuestionFrame>
      );
    case "age_hair_loss_began":
      return (
        <QuestionFrame
          {...common}
          title="About how old were you when the hair loss started?"
          hint="Your age then, not how old you are now."
          footer={continueFooter}
        >
          <div className="flex items-center gap-3">
            <Input
              inputMode="numeric"
              type="number"
              min={1}
              max={90}
              value={draft.age_hair_loss_began ?? ""}
              onChange={(e) =>
                update({
                  age_hair_loss_began: e.target.value ? Number(e.target.value) : null,
                })
              }
              aria-label="Age when hair loss began"
            />
            <span className="text-stone-600">years old</span>
          </div>
        </QuestionFrame>
      );
    case "duration":
      return (
        <QuestionFrame {...common} title="How long has this been going on?">
          <ChoiceList
            autoAdvance
            value={draft.duration}
            onChange={(v) => update({ duration: v as IntakeDraft["duration"] })}
            options={OPTION_SETS.duration}
          />
        </QuestionFrame>
      );
    case "family_history":
      return (
        <QuestionFrame
          {...common}
          title="Has anyone in your family had thinning or baldness?"
          footer={continueFooter}
        >
          <ChipList
            options={OPTION_SETS.family}
            selected={draft.family_history}
            onToggle={(v) =>
              update({
                family_history: toggleExclusive(draft.family_history, v, OPTION_SETS.familyNone),
              })
            }
          />
        </QuestionFrame>
      );
    case "pattern":
      return (
        <QuestionFrame
          {...common}
          title="Where have you noticed it?"
          hint="Pick every area that fits."
          footer={continueFooter}
        >
          <ChipList
            options={OPTION_SETS.pattern}
            selected={draft.pattern}
            onToggle={(v) =>
              update({
                pattern: draft.pattern.includes(v)
                  ? draft.pattern.filter((x) => x !== v)
                  : [...draft.pattern, v],
              })
            }
          />
        </QuestionFrame>
      );
    case "diagnosed_conditions":
      return (
        <QuestionFrame
          {...common}
          title="Have you been diagnosed with any of these?"
          why="Hormones, thyroid, and iron issues can change hair. We only store what you tap."
          footer={continueFooter}
        >
          <ChipList
            options={OPTION_SETS.conditions}
            selected={draft.diagnosed_conditions}
            onToggle={(v) =>
              update({
                diagnosed_conditions: toggleExclusive(
                  draft.diagnosed_conditions,
                  v,
                  OPTION_SETS.conditionsNone,
                ),
              })
            }
          />
        </QuestionFrame>
      );
    case "menstrual_cycle":
      return (
        <QuestionFrame {...common} title="How is your menstrual cycle?">
          <ChoiceList
            autoAdvance
            value={draft.menstrual_cycle}
            onChange={(v) => update({ menstrual_cycle: v as IntakeDraft["menstrual_cycle"] })}
            options={OPTION_SETS.menstrual}
          />
        </QuestionFrame>
      );
    case "pregnancy_related":
      return (
        <QuestionFrame {...common} title="Is this related to pregnancy?">
          <ChoiceList
            autoAdvance
            value={draft.pregnancy_related}
            onChange={(v) => update({ pregnancy_related: v as IntakeDraft["pregnancy_related"] })}
            options={OPTION_SETS.pregnancy}
          />
        </QuestionFrame>
      );
    case "adult_acne_oily_skin":
      return (
        <QuestionFrame {...common} title="Do you get acne or oily skin as an adult?">
          <YesNo
            value={draft.adult_acne_oily_skin}
            onChange={(v) => update({ adult_acne_oily_skin: v })}
          />
        </QuestionFrame>
      );
    case "excess_body_facial_hair":
      return (
        <QuestionFrame
          {...common}
          title="Have you noticed extra hair on the face or body?"
          hint="Asked because hormones can affect both scalp and body hair."
        >
          <YesNo
            value={draft.excess_body_facial_hair}
            onChange={(v) => update({ excess_body_facial_hair: v })}
          />
        </QuestionFrame>
      );
    case "past_6_months":
      return (
        <QuestionFrame
          {...common}
          title="In the last 6 months, did any of these happen?"
          footer={continueFooter}
        >
          <ChipList
            options={OPTION_SETS.past6}
            selected={draft.past_6_months ?? []}
            onToggle={(v) => {
              const current = draft.past_6_months ?? [];
              const nextVal = current.includes(v) ? current.filter((x) => x !== v) : [...current, v];
              update({ past_6_months: nextVal });
            }}
          />
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => {
              update({ past_6_months: [] });
              window.setTimeout(next, 50);
            }}
          >
            None of these
          </Button>
        </QuestionFrame>
      );
    case "habit_smoking":
      return (
        <QuestionFrame {...common} title="Do you smoke?">
          <YesNo
            value={draft.habits.smoking}
            onChange={(v) =>
              update({
                habits: {
                  ...draft.habits,
                  smoking: v,
                  smoking_severity: v ? draft.habits.smoking_severity : null,
                },
              })
            }
          />
        </QuestionFrame>
      );
    case "habit_smoking_severity":
      return (
        <QuestionFrame {...common} title="About how many cigarettes a day?">
          <ChoiceList
            autoAdvance
            value={draft.habits.smoking_severity}
            onChange={(v) =>
              update({
                habits: {
                  ...draft.habits,
                  smoking_severity: v as (typeof SMOKING_SEVERITY_OPTIONS)[number],
                },
              })
            }
            options={SMOKING_SEVERITY_OPTIONS}
          />
        </QuestionFrame>
      );
    case "habit_alcohol":
      return (
        <QuestionFrame {...common} title="Do you drink alcohol?">
          <YesNo
            value={draft.habits.alcohol}
            onChange={(v) => update({ habits: { ...draft.habits, alcohol: v } })}
          />
        </QuestionFrame>
      );
    case "habit_hard_water":
      return (
        <QuestionFrame
          {...common}
          title="Do you usually wash your hair in hard water?"
          hint="Mineral-heavy tap water. If you’re not sure, pick No."
        >
          <YesNo
            value={draft.habits.hard_water}
            onChange={(v) => update({ habits: { ...draft.habits, hard_water: v } })}
          />
        </QuestionFrame>
      );
    case "habit_wash":
      return (
        <QuestionFrame {...common} title="How often do you wash your hair?">
          <ChoiceList
            autoAdvance
            value={draft.habits.hair_wash_frequency}
            onChange={(v) =>
              update({
                habits: {
                  ...draft.habits,
                  hair_wash_frequency: v as (typeof WASH_FREQUENCY_OPTIONS)[number],
                },
              })
            }
            options={WASH_FREQUENCY_OPTIONS}
          />
        </QuestionFrame>
      );
    case "habit_heating":
      return (
        <QuestionFrame {...common} title="Do you use heat tools or styling chemicals?">
          <YesNo
            value={draft.habits.heating_tools_styling_chemicals}
            onChange={(v) =>
              update({ habits: { ...draft.habits, heating_tools_styling_chemicals: v } })
            }
          />
        </QuestionFrame>
      );
    case "habit_salon":
      return (
        <QuestionFrame
          {...common}
          title="Any salon treatments like keratin, rebonding, or smoothening?"
        >
          <YesNo
            value={draft.habits.salon_treatments}
            onChange={(v) =>
              update({
                habits: {
                  ...draft.habits,
                  salon_treatments: v,
                  salon_treatment_detail: v ? draft.habits.salon_treatment_detail : null,
                },
              })
            }
          />
        </QuestionFrame>
      );
    case "habit_salon_detail":
      return (
        <QuestionFrame
          {...common}
          title="Which salon treatments?"
          footer={continueFooter}
        >
          <Textarea
            value={draft.habits.salon_treatment_detail ?? ""}
            onChange={(e) =>
              update({ habits: { ...draft.habits, salon_treatment_detail: e.target.value } })
            }
            placeholder="e.g. keratin last year"
          />
          <VoiceCapture
            onTranscript={(text) =>
              update({
                habits: {
                  ...draft.habits,
                  salon_treatment_detail: [draft.habits.salon_treatment_detail, text]
                    .filter(Boolean)
                    .join(" "),
                },
              })
            }
          />
        </QuestionFrame>
      );
    case "products_select":
      return (
        <QuestionFrame
          {...common}
          title="Which of these have you used?"
          hint="We’ll only ask follow-ups for what you pick."
          footer={continueFooter}
        >
          <div className="space-y-2">
            {PRODUCT_ROWS.map((row) => {
              const used = draft.products[row]?.used === true;
              return (
                <Button
                  key={row}
                  type="button"
                  variant="choice"
                  data-selected={used}
                  onClick={() =>
                    update({
                      products_selected: true,
                      products: {
                        ...draft.products,
                        [row]: used
                          ? { used: false, duration: null, helped: null, side_effects: null }
                          : { used: true, duration: null, helped: null, side_effects: null },
                      },
                    })
                  }
                >
                  <span>
                    <span className="block">{row}</span>
                    <span className="mt-1 block text-sm font-normal text-stone-500">
                      {PRODUCT_HINTS[row]}
                    </span>
                  </span>
                </Button>
              );
            })}
          </div>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => {
              update({
                products_selected: true,
                products: Object.fromEntries(
                  PRODUCT_ROWS.map((row) => [
                    row,
                    { used: false, duration: null, helped: null, side_effects: null },
                  ]),
                ) as IntakeDraft["products"],
              });
              window.setTimeout(next, 50);
            }}
          >
            None of these
          </Button>
        </QuestionFrame>
      );
    case "products_detail":
      return (
        <QuestionFrame
          {...common}
          title="A bit more on what you used"
          footer={continueFooter}
        >
          {PRODUCT_ROWS.filter((row) => draft.products[row]?.used).map((row) => {
            const p = draft.products[row];
            return (
              <div key={row} className="rounded-2xl border border-stone-200 p-4">
                <p className="font-medium">{row}</p>
                <p className="mt-3 text-sm text-stone-500">How long?</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {PRODUCT_DURATION_OPTIONS.map((opt) => (
                    <Button
                      key={opt}
                      size="sm"
                      variant={p?.duration === opt ? "default" : "outline"}
                      onClick={() =>
                        update({
                          products: { ...draft.products, [row]: { ...p, used: true, duration: opt } },
                        })
                      }
                    >
                      {opt}
                    </Button>
                  ))}
                </div>
                <p className="mt-3 text-sm text-stone-500">Did it help?</p>
                <div className="mt-2 flex gap-2">
                  {[true, false].map((v) => (
                    <Button
                      key={String(v)}
                      size="sm"
                      variant={p?.helped === v ? "default" : "outline"}
                      onClick={() =>
                        update({
                          products: { ...draft.products, [row]: { ...p, used: true, helped: v } },
                        })
                      }
                    >
                      {v ? "Yes" : "No"}
                    </Button>
                  ))}
                </div>
                <p className="mt-3 text-sm text-stone-500">Any side effects?</p>
                <div className="mt-2 flex gap-2">
                  {[true, false].map((v) => (
                    <Button
                      key={String(v)}
                      size="sm"
                      variant={p?.side_effects === v ? "default" : "outline"}
                      onClick={() =>
                        update({
                          products: {
                            ...draft.products,
                            [row]: { ...p, used: true, side_effects: v },
                          },
                        })
                      }
                    >
                      {v ? "Yes" : "No"}
                    </Button>
                  ))}
                </div>
              </div>
            );
          })}
        </QuestionFrame>
      );
    case "procedures_select":
      return (
        <QuestionFrame
          {...common}
          title="Any in-clinic procedures?"
          footer={continueFooter}
        >
          {PROCEDURE_ROWS.map((row) => {
            const done = draft.procedures[row]?.done === true;
            return (
              <Button
                key={row}
                type="button"
                variant="choice"
                data-selected={done}
                onClick={() =>
                  update({
                    procedures_selected: true,
                    procedures: {
                      ...draft.procedures,
                      [row]: done
                        ? { done: false, sessions: null, helped: null }
                        : { done: true, sessions: null, helped: null },
                    },
                  })
                }
              >
                <span>
                  <span className="block">{row}</span>
                  <span className="mt-1 block text-sm font-normal text-stone-500">
                    {PROCEDURE_HINTS[row]}
                  </span>
                </span>
              </Button>
            );
          })}
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => {
              update({
                procedures_selected: true,
                procedures: Object.fromEntries(
                  PROCEDURE_ROWS.map((row) => [row, { done: false, sessions: null, helped: null }]),
                ) as IntakeDraft["procedures"],
              });
              window.setTimeout(next, 50);
            }}
          >
            None of these
          </Button>
        </QuestionFrame>
      );
    case "procedures_detail":
      return (
        <QuestionFrame {...common} title="A bit more on clinic treatments" footer={continueFooter}>
          {PROCEDURE_ROWS.filter((row) => draft.procedures[row]?.done).map((row) => {
            const p = draft.procedures[row];
            return (
              <div key={row} className="rounded-2xl border border-stone-200 p-4">
                <p className="font-medium">{row}</p>
                <p className="mt-3 text-sm text-stone-500">Sessions</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {SESSION_OPTIONS.map((opt) => (
                    <Button
                      key={opt}
                      size="sm"
                      variant={p?.sessions === opt ? "default" : "outline"}
                      onClick={() =>
                        update({
                          procedures: { ...draft.procedures, [row]: { ...p, done: true, sessions: opt } },
                        })
                      }
                    >
                      {opt}
                    </Button>
                  ))}
                </div>
                <p className="mt-3 text-sm text-stone-500">Did it help?</p>
                <div className="mt-2 flex gap-2">
                  {[true, false].map((v) => (
                    <Button
                      key={String(v)}
                      size="sm"
                      variant={p?.helped === v ? "default" : "outline"}
                      onClick={() =>
                        update({
                          procedures: { ...draft.procedures, [row]: { ...p, done: true, helped: v } },
                        })
                      }
                    >
                      {v ? "Yes" : "No"}
                    </Button>
                  ))}
                </div>
              </div>
            );
          })}
        </QuestionFrame>
      );
    case "past_treatment":
      return (
        <QuestionFrame
          {...common}
          title="Any side effects or a poor response to past treatment?"
        >
          <YesNo
            autoAdvance
            value={draft.past_treatment_side_effects}
            onChange={(v) =>
              update({
                past_treatment_side_effects: v,
                past_treatment_describe: v ? draft.past_treatment_describe : null,
              })
            }
          />
        </QuestionFrame>
      );
    case "past_treatment_describe":
      return (
        <QuestionFrame
          {...common}
          title="What happened?"
          hint="In your words. We won’t guess a diagnosis."
          footer={continueFooter}
        >
          <Textarea
            value={draft.past_treatment_describe ?? ""}
            onChange={(e) => update({ past_treatment_describe: e.target.value })}
            placeholder="e.g. minoxidil made my scalp itchy"
          />
          <VoiceCapture
            onTranscript={(text) =>
              update({
                past_treatment_describe: [draft.past_treatment_describe, text]
                  .filter(Boolean)
                  .join(" "),
              })
            }
          />
        </QuestionFrame>
      );
    case "sample_type":
      return (
        <QuestionFrame
          {...common}
          title="If a sample is needed, what do you prefer?"
          hint="Saliva is usually a swab. Blood is a small clinic draw. Either is fine if you don’t mind."
        >
          <ChoiceList
            autoAdvance
            value={draft.sample_type}
            onChange={(v) => update({ sample_type: v as IntakeDraft["sample_type"] })}
            options={SAMPLE_TYPE_OPTIONS}
          />
        </QuestionFrame>
      );
    case "consent":
      return (
        <QuestionFrame
          {...common}
          title="Do you consent to sample collection and genetic analysis?"
          hint="This is for the clinic record. Take a second — we won’t move on until you choose."
          footer={continueFooter}
        >
          <YesNo
            autoAdvance={false}
            value={draft.consent}
            onChange={(v) => update({ consent: v })}
            yes="Yes, I consent"
            no="No"
          />
        </QuestionFrame>
      );
    case "review":
      return <ReviewStep intake={intake} />;
    default:
      return null;
  }
}

function StoryStep({ intake }: { intake: ReturnType<typeof useIntake> }) {
  const { draft, update, skipStory, mergeExtract, step, back } = intake;
  const [busy, setBusy] = useState(false);

  async function extract() {
    const story = draft.story.trim();
    if (!story) {
      skipStory();
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ story }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Extract failed");
      mergeExtract(data.fields ?? {});
    } catch {
      toast.message("We’ll just go question by question.");
      skipStory();
    } finally {
      setBusy(false);
    }
  }

  return (
    <QuestionFrame
      step={step}
      onBack={back}
      title="What’s been going on with your hair?"
      hint="Optional. A few sentences now can skip later questions. You can type, speak, or skip."
      footer={
        <div className="flex flex-col gap-2">
          <Button className="w-full" onClick={extract} disabled={busy}>
            {busy ? "Reading that…" : draft.story.trim() ? "Use this" : "Skip for now"}
          </Button>
          {draft.story.trim() ? (
            <Button variant="ghost" className="w-full" onClick={skipStory} disabled={busy}>
              Skip and answer by tap
            </Button>
          ) : null}
        </div>
      }
    >
      <Textarea
        value={draft.story}
        onChange={(e) => update({ story: e.target.value })}
        placeholder="When it started, where you notice it, anything you’ve tried…"
      />
      <VoiceCapture
        continuous
        disabled={busy}
        onTranscript={(text) => update({ story: draft.story ? `${draft.story} ${text}` : text })}
      />
    </QuestionFrame>
  );
}

function ConfirmStep({ intake }: { intake: ReturnType<typeof useIntake> }) {
  const { extractPreview, step, back, next, goTo } = intake;
  const rows = extractPreview ? summarizeExtracted(extractPreview) : [];

  return (
    <QuestionFrame
      step={step}
      onBack={back}
      title="Does this match what you said?"
      hint="We’ll only keep what you confirm. Anything missing still gets a quick tap."
      footer={
        <div className="flex flex-col gap-2">
          <Button className="w-full" onClick={next} disabled={rows.length === 0}>
            Yes, continue
          </Button>
          <Button variant="outline" className="w-full" onClick={() => goTo("patient_context" as StepId)}>
            Change — I’ll tap instead
          </Button>
        </div>
      }
    >
      {rows.length === 0 ? (
        <p className="text-stone-600">Nothing was clear enough to fill in. That’s fine.</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((row) => (
            <li key={row.label} className="rounded-2xl bg-stone-50 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-stone-500">{row.label}</p>
              <p className="mt-1 font-medium text-stone-900">{row.value}</p>
            </li>
          ))}
        </ul>
      )}
    </QuestionFrame>
  );
}

function ReviewStep({ intake }: { intake: ReturnType<typeof useIntake> }) {
  const { draft, step, back, submit, goTo } = intake;

  const rows: { label: string; value: string; jump: StepId }[] = [
    { label: "Age when it started", value: String(draft.age_hair_loss_began ?? "—"), jump: "age_hair_loss_began" },
    { label: "Duration", value: draft.duration ?? "—", jump: "duration" },
    { label: "Family history", value: draft.family_history.join(", ") || "—", jump: "family_history" },
    { label: "Pattern", value: draft.pattern.join(", ") || "—", jump: "pattern" },
    {
      label: "Conditions",
      value: draft.diagnosed_conditions.join(", ") || "—",
      jump: "diagnosed_conditions",
    },
    { label: "Sample", value: draft.sample_type ?? "—", jump: "sample_type" },
    { label: "Consent", value: draft.consent == null ? "—" : draft.consent ? "Yes" : "No", jump: "consent" },
  ];

  return (
    <QuestionFrame
      step={step}
      onBack={back}
      title="Your intake"
      hint="Glance once. Edit anything that’s off, then submit."
      footer={
        <Button className="w-full" onClick={submit}>
          Submit intake
        </Button>
      }
    >
      <ul className="space-y-2">
        {rows.map((row) => (
          <li key={row.label} className="flex items-start justify-between gap-3 rounded-2xl bg-stone-50 px-4 py-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-stone-500">{row.label}</p>
              <p className="mt-1 text-stone-900">{row.value}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => goTo(row.jump)}>
              Edit
            </Button>
          </li>
        ))}
      </ul>
    </QuestionFrame>
  );
}
