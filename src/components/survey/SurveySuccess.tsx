"use client";

import React from "react";
import { CheckCircle, Sparkles, RotateCcw, ExternalLink } from "lucide-react";

interface SurveySuccessProps {
  receiptId: string;
  onReset: () => void;
}

export const SurveySuccess: React.FC<SurveySuccessProps> = ({ receiptId, onReset }) => {
  return (
    <div className="w-full max-w-2xl mx-auto py-12 sm:py-20 px-4 sm:px-6 text-center animate-fadeIn space-y-8">
      {/* Animated Check Icon */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-2xl animate-pulse" />
          <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-2xl shadow-emerald-500/30 ring-4 ring-emerald-500/20">
            <CheckCircle className="w-10 h-10 text-white stroke-[2.5]" />
          </div>
        </div>
      </div>

      {/* Confirmation Heading */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Research Submission Successful</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Thank You for Shaping the Future of Leadership
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 max-w-lg mx-auto leading-relaxed">
          Your strategic inputs have been securely recorded. The insights generated from this research will be published in the flagship NHRD × xMonks 2026 Coaching Report.
        </p>
      </div>

      {/* Receipt Box */}
      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 shadow-sm inline-block text-left max-w-md mx-auto">
        <div className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold mb-1">
          Anonymous Research Receipt ID
        </div>
        <div className="font-mono text-sm font-bold text-orange-600 dark:text-orange-400 select-all">
          {receiptId}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center pt-4">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold transition-all shadow-lg shadow-orange-600/20"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Submit Another Response</span>
        </button>
      </div>
    </div>
  );
};
