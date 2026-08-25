"use client";

import React from "react";
import { Sparkles, Compass } from "lucide-react";

interface SurveyHeaderProps {
  currentStep: number;
  totalSteps: number;
  sectionTitle: string;
  roleTitle?: string;
  onReset?: () => void;
}

export const SurveyHeader: React.FC<SurveyHeaderProps> = ({
  currentStep,
  totalSteps,
  sectionTitle,
  roleTitle,
}) => {
  const progressPercent = totalSteps > 0 ? Math.min(100, Math.round(((currentStep) / totalSteps) * 100)) : 0;

  return (
    <header className="w-full bg-white/90 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800/80 sticky top-0 z-40 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand & Context */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md shadow-orange-500/20 ring-1 ring-black/5 dark:ring-white/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-zinc-900 dark:text-white">
                  NHRD × xMonks
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                  Research 2026
                </span>
              </div>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 hidden sm:inline truncate max-w-xs">
                The Coaching Ripple Effect
              </span>
            </div>
          </div>
        </div>

        {/* Step Indicator & Category */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-200 flex items-center justify-end gap-1.5">
              <Compass className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <span>{sectionTitle}</span>
            </div>
            {roleTitle && (
              <span className="text-[11px] text-orange-600 dark:text-orange-400/90 font-medium">
                Perspective: {roleTitle}
              </span>
            )}
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className="text-xs font-mono font-medium text-zinc-600 dark:text-zinc-400">
              <strong className="text-zinc-900 dark:text-white">{currentStep + 1}</strong> of {totalSteps}
            </span>
            <div className="w-24 sm:w-32 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
