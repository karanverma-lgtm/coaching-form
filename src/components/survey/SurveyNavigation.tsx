"use client";

import React from "react";
import { ArrowLeft, ArrowRight, CornerDownLeft, FastForward } from "lucide-react";

interface SurveyNavigationProps {
  canGoBack: boolean;
  canAdvance: boolean;
  isOptional: boolean;
  isSubmitting?: boolean;
  isLastQuestion?: boolean;
  onBack: () => void;
  onNext: () => void;
  onSkip?: () => void;
}

export const SurveyNavigation: React.FC<SurveyNavigationProps> = ({
  canGoBack,
  canAdvance,
  isOptional,
  isSubmitting,
  isLastQuestion,
  onBack,
  onNext,
  onSkip,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto pt-8 border-t border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between gap-4">
      {/* Back Button */}
      {canGoBack ? (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 text-xs sm:text-sm font-medium transition-colors border border-zinc-300 dark:border-zinc-800 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      ) : (
        <div />
      )}

      {/* Right Actions (Skip / Next / Submit) */}
      <div className="flex items-center gap-3">
        {isOptional && onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-100/80 dark:bg-zinc-900/80 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 text-xs sm:text-sm font-medium transition-colors border border-zinc-300 dark:border-zinc-800/80"
          >
            <FastForward className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
            <span>Skip optional</span>
          </button>
        )}

        <button
          type="button"
          disabled={!canAdvance || isSubmitting}
          onClick={onNext}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-orange-600/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
        >
          <span>{isLastQuestion ? "Review & Submit" : "Next"}</span>
          <ArrowRight className="w-4 h-4" />
          <span className="hidden sm:inline-flex items-center text-[10px] opacity-75 font-mono ml-1">
            <CornerDownLeft className="w-3 h-3" />
          </span>
        </button>
      </div>
    </div>
  );
};
