"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ChoiceList({
  options,
  value,
  onChange,
  autoAdvance,
}: {
  options: readonly string[] | { value: string; label: string; hint?: string }[];
  value?: string | null;
  onChange: (value: string) => void;
  autoAdvance?: boolean;
}) {
  const items = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt,
  );

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <Button
          key={item.value}
          type="button"
          variant="choice"
          data-selected={value === item.value}
            onClick={() => {
            onChange(item.value);
            if (autoAdvance) {
              window.setTimeout(() => {
                document.dispatchEvent(new CustomEvent("intake-advance"));
              }, 150);
            }
          }}
        >
          <span>
            <span className="block font-medium">{item.label}</span>
            {item.hint ? (
              <span className="mt-1 block text-sm font-normal text-stone-500">{item.hint}</span>
            ) : null}
          </span>
        </Button>
      ))}
    </div>
  );
}

export function ChipList({
  options,
  selected,
  onToggle,
}: {
  options: readonly string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const on = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => onToggle(option)}
            className={cn(
              "min-h-12 rounded-full border px-4 py-2 text-left text-sm font-medium",
              on
                ? "border-teal-800 bg-teal-50 text-teal-950"
                : "border-stone-200 bg-white text-stone-800 hover:border-teal-700",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

export function YesNo({
  value,
  onChange,
  autoAdvance = true,
  yes = "Yes",
  no = "No",
}: {
  value: boolean | null;
  onChange: (v: boolean) => void;
  autoAdvance?: boolean;
  yes?: string;
  no?: string;
}) {
  return (
    <ChoiceList
      value={value === null ? null : value ? "yes" : "no"}
      autoAdvance={autoAdvance}
      onChange={(v) => onChange(v === "yes")}
      options={[
        { value: "yes", label: yes },
        { value: "no", label: no },
      ]}
    />
  );
}
