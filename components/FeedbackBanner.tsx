"use client";

import type { Feedback, Origin } from "@/lib/types";

interface FeedbackBannerProps {
  feedback: Feedback;
  correct: Origin;
  onContinue: () => void;
}

export function FeedbackBanner({
  feedback,
  correct,
  onContinue,
}: FeedbackBannerProps) {
  if (!feedback) return null;

  const isCorrect = feedback === "correct";
  const truthLabel = correct === "ia" ? "IA" : "Real";

  return (
    <div className="mt-2 flex flex-col gap-3">
      <p
        className={`text-center text-sm font-medium ${isCorrect ? "text-green-400" : "text-red-400"}`}
      >
        {isCorrect ? "Você acertou!" : "Você errou!"}
      </p>
      <button
        type="button"
        onClick={onContinue}
        className="rounded-xl bg-white/10 px-5 py-3 text-sm font-medium text-white/90 transition-colors duration-200 hover:bg-white/15"
      >
        A postagem era {truthLabel} · Continuar
      </button>
    </div>
  );
}