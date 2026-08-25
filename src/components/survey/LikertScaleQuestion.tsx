"use client";

import React from "react";
import { LikertOption } from "@/lib/survey/schema";
import { Check } from "lucide-react";

interface LikertScaleQuestionProps {
  options: LikertOption[];
  value?: number;
  onChange: (val: number) => void;
}

export const LikertScaleQuestion: React.FC<LikertScaleQuestionProps> = ({
  options,
  value,
  onChange,
}) => {
  const handleSelect = (num: number) => {
    onChange(num);
  };

  const standardRatings = options.filter((o) => o.value <= 10);
  const specialOption = options.find((o) => o.value > 10);

  return (
    <div className="space-y-4 w-full max-w-2xl mx-auto">
      <div className="grid grid-cols-1 gap-2.5">
        {standardRatings.map((opt) => {
          const isSelected = value === opt.value;

          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleSelect(opt.value)}
              className={`w-full group text-left px-4 py-3.5 rounded-2xl border transition-all duration-150 flex items-center justify-between shadow-xs ${
                isSelected
                  ? "bg-amber-500/10 dark:bg-amber-500/15 border-amber-500 text-zinc-950 dark:text-white ring-1 ring-amber-500 shadow-md shadow-amber-500/10"
                  : "bg-white dark:bg-zinc-900/60 hover:bg-zinc-50 dark:hover:bg-zinc-850 border-zinc-200 dark:border-zinc-800/90 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-800 dark:text-zinc-200"
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <span
                  className={`w-8 h-8 rounded-xl text-sm font-mono font-bold flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? "bg-amber-500 text-zinc-950 shadow-md font-extrabold"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 group-hover:text-zinc-900 dark:group-hover:text-white border border-zinc-300 dark:border-zinc-700"
                  }`}
                >
                  {opt.value}
                </span>
                <span className="text-sm sm:text-base font-medium leading-snug">
                  {opt.label.replace(/^\d+[\s\-–—.:)]*\s*/, "")}
                </span>
              </div>

              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                  isSelected
                    ? "bg-amber-500 border-amber-500 text-zinc-950"
                    : "border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950/60"
                }`}
              >
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Special Not Sure / Too early option */}
      {specialOption && (
        <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800/80">
          <button
            type="button"
            onClick={() => handleSelect(specialOption.value)}
            className={`w-full group text-left px-4 py-3 rounded-2xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
              value === specialOption.value
                ? "bg-zinc-200 dark:bg-zinc-800 border-zinc-400 dark:border-zinc-600 text-zinc-900 dark:text-white"
                : "bg-zinc-100/60 dark:bg-zinc-950/40 hover:bg-zinc-200/60 dark:hover:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-300"
            }`}
          >
            <span>{specialOption.label}</span>
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border ${
                value === specialOption.value
                  ? "bg-zinc-600 dark:bg-zinc-400 border-zinc-600 dark:border-zinc-400 text-white dark:text-zinc-950"
                  : "border-zinc-300 dark:border-zinc-750"
              }`}
            >
              {value === specialOption.value && <Check className="w-2.5 h-2.5 stroke-[3]" />}
            </div>
          </button>
        </div>
      )}
    </div>
  );
};
