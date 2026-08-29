"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { IntakeOutput } from "@/lib/schema";
import { clearDraft, loadOutput } from "@/lib/storage";

export default function DonePage() {
  const [output, setOutput] = useState<IntakeOutput | null>(null);
  const [showJson, setShowJson] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setOutput(loadOutput());
  }, []);

  if (!output) {
    return (
      <main className="mx-auto max-w-md px-5 py-16">
        <p className="text-stone-600">No intake found on this device.</p>
        <Link href="/" className="mt-6 inline-flex min-h-12 items-center rounded-2xl bg-teal-800 px-5 font-medium text-white">
          Start over
        </Link>
      </main>
    );
  }

  const json = JSON.stringify(output, null, 2);

  return (
    <main className="mx-auto max-w-lg px-5 py-10">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-teal-800">Submitted</p>
      <h1 className="mt-3 text-3xl font-semibold text-stone-900">Your clinician can see this now.</h1>
      <p className="mt-3 text-stone-600">
        Structured GenoRoot hair & scalp intake. This is the filled form.
      </p>

      <Card className="mt-8 space-y-3">
        <Row label="Age hair loss began" value={String(output.age_hair_loss_began)} />
        <Row label="Duration" value={output.duration} />
        <Row label="Family history" value={output.family_history.join(", ")} />
        <Row label="Pattern" value={output.pattern.join(", ")} />
        <Row label="Conditions" value={output.diagnosed_conditions.join(", ")} />
        <Row label="Menstrual cycle" value={output.menstrual_cycle} />
        <Row label="Pregnancy-related" value={output.pregnancy_related} />
        <Row label="Adult acne / oily skin" value={output.adult_acne_oily_skin ? "Yes" : "No"} />
        <Row
          label="Extra body / facial hair"
          value={output.excess_body_facial_hair ? "Yes" : "No"}
        />
        <Row
          label="Past 6 months"
          value={output.past_6_months.length ? output.past_6_months.join(", ") : "None"}
        />
        <Row label="Sample" value={output.sample_type} />
        <Row label="Consent" value={output.consent ? "Yes" : "No"} />
      </Card>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => setShowJson((v) => !v)}>
          {showJson ? "Hide JSON" : "Show JSON"}
        </Button>
        <Button
          variant="secondary"
          onClick={async () => {
            await navigator.clipboard.writeText(json);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
          }}
        >
          {copied ? "Copied" : "Copy JSON"}
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            clearDraft();
            window.location.href = "/";
          }}
        >
          New intake
        </Button>
      </div>

      {showJson ? (
        <pre className="mt-6 overflow-x-auto rounded-2xl bg-stone-900 p-4 text-sm text-stone-50">
          {json}
        </pre>
      ) : null}
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-stone-500">{label}</p>
      <p className="mt-1 text-stone-900">{value}</p>
    </div>
  );
}
