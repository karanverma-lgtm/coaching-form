"use client";

import React from "react";
import { QuestionDefinition, SurveyAnswers } from "@/lib/survey/schema";
import { CheckCircle2, ArrowLeft, Send, Edit3, ShieldAlert, Tag } from "lucide-react";

interface SurveyReviewProps {
  questions: QuestionDefinition[];
  answers: SurveyAnswers;
  isSubmitting: boolean;
  onEditQuestion: (index: number) => void;
  onBack: () => void;
  onSubmit: () => void;
}

export const SurveyReview: React.FC<SurveyReviewProps> = ({
  questions,
  answers,
  isSubmitting,
  onEditQuestion,
  onBack,
  onSubmit,
}) => {
  const answeredCount = questions.filter((q) => {
    const val = answers[q.id];
    if (val === undefined || val === null || val === "") return false;
    if (Array.isArray(val) && val.length === 0) return false;
    return true;
  }).length;

  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4 sm:px-6 animate-fadeIn space-y-8">
      {/* Header */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Responses Ready for Submission</span>
        </div>
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-4xl font-bold text-zinc-900 dark:text-white tracking-tight">
          Review Your Strategic Insights
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          You have completed {answeredCount} of {questions.length} questions tailored to your perspective. Click any item to modify your response.
        </p>
      </div>

      {/* Grouped Responses Breakdown */}
      <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
        {questions.map((q, idx) => {
          const val = answers[q.id];
          const hasAnswer = val !== undefined && val !== null && val !== "" && (!Array.isArray(val) || val.length > 0);

          let displayVal = "Skipped / Unanswered";
          if (hasAnswer) {
            const otherText = (answers[`${q.id}_OTHER`] as string)?.trim();
            if (Array.isArray(val)) {
              displayVal = val.join(" • ");
              if (otherText) displayVal += ` (Other: ${otherText})`;
            } else if (typeof val === "number") {
              if (val === 99) {
                displayVal = "99 - Too early / not able to assess";
              } else {
                displayVal = `${val} / 5 scale`;
              }
            } else {
              const matchedOption = q.options?.find((o) => o.value === val);
              const label = matchedOption ? matchedOption.label : String(val);
              displayVal = otherText ? `${label}: ${otherText}` : label;
            }
          }

          return (
            <div
              key={q.id}
              onClick={() => onEditQuestion(idx)}
              className="p-4 rounded-2xl bg-white dark:bg-zinc-900/60 hover:bg-zinc-50 dark:hover:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 hover:border-orange-500/50 transition-all cursor-pointer group flex items-start justify-between gap-4 shadow-xs"
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-mono font-bold text-orange-600 dark:text-orange-400 px-1.5 py-0.5 rounded bg-orange-500/10 border border-orange-500/20">
                    {q.id}
                  </span>
                  {q.tag && (
                    <span className="text-[11px] font-medium text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 flex items-center gap-1">
                      <Tag className="w-2.5 h-2.5" />
                      <span>{q.tag}</span>
                    </span>
                  )}
                  <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    {q.sectionTitle}
                  </span>
                </div>
                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 line-clamp-2">
                  {q.title}
                </p>
                <p className={`text-xs ${hasAnswer ? "text-amber-600 dark:text-amber-300 font-medium" : "text-zinc-400 dark:text-zinc-500 italic"}`}>
                  {displayVal}
                </p>
              </div>

              <button
                type="button"
                className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 group-hover:bg-orange-500 text-zinc-500 dark:text-zinc-400 group-hover:text-white transition-colors shrink-0"
                title="Edit response"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Anonymous Guarantee & Action Buttons */}
      <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 flex items-center gap-3">
        <ShieldAlert className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" />
        <span>
          Submission is completely anonymous. Your responses will be aggregated as part of the NHRD × xMonks 2026 National Coaching Ripple Effect benchmark.
        </span>
      </div>

      <div className="flex items-center justify-between gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-medium transition-colors border border-zinc-300 dark:border-zinc-800 disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Survey</span>
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white font-semibold text-sm shadow-xl shadow-orange-600/25 transition-all disabled:opacity-50"
        >
          {isSubmitting ? (
            <span>Saving Response...</span>
          ) : (
            <>
              <span>Submit Final Response</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
