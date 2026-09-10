"use client";

import type { Origin, Status } from "@/lib/types";

interface ChoiceButtonsProps {
  status: Status;
  selected: Origin | null;
  correct: Origin;
  onSelect: (origin: Origin) => void;
}

export function ChoiceButtons({
  status,
  selected,
  correct,
  onSelect,
}: ChoiceButtonsProps) {
  const answered = status === "answered";

  return (
    <div className="grid grid-cols-2 gap-4">
      <ChoiceButton
        label="IA"
        tint="red"
        disabled={answered}
        variant={buttonVariant("ia", selected, correct, answered)}
        onClick={() => onSelect("ia")}
      />
      <ChoiceButton
        label="REAL"
        tint="green"
        disabled={answered}
        variant={buttonVariant("real", selected, correct, answered)}
        onClick={() => onSelect("real")}
      />
    </div>
  );
}

function buttonVariant(
  origin: Origin,
  selected: Origin | null,
  correct: Origin,
  answered: boolean,
): "idle" | "correct" | "wrong" | "dim" {
  if (!answered) return "idle";
  if (origin === correct) return "correct";
  if (origin === selected) return "wrong";
  return "dim";
}

const tintStyles = {
  red: "border-white/15 bg-[#f4ecec] text-[#3a2a2a]",
  green: "border-white/15 bg-[#ecf2ec] text-[#293a2a]",
} as const;

const variantStyles: Record<
  "idle" | "correct" | "wrong" | "dim",
  string
> = {
  idle: "opacity-100",
  correct: "ring-2 ring-green-400/70",
  wrong: "ring-2 ring-red-400/70",
  dim: "opacity-40",
};

function ChoiceButton({
  label,
  tint,
  disabled,
  variant,
  onClick,
}: {
  label: string;
  tint: keyof typeof tintStyles;
  disabled: boolean;
  variant: keyof typeof variantStyles;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-xl px-6 py-4 text-sm font-semibold tracking-wide transition-all duration-300 ${tintStyles[tint]} ${variantStyles[variant]} disabled:cursor-default`}
    >
      {label}
    </button>
  );
}