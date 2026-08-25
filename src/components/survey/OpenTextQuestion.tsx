"use client";

import React from "react";
import { MessageSquareText } from "lucide-react";

interface OpenTextQuestionProps {
  value?: string;
  placeholder?: string;
  wordLimit?: { min: number; max: number; suggestion: string };
  onChange: (val: string) => void;
}

export const OpenTextQuestion: React.FC<OpenTextQuestionProps> = ({
  value = "",
  placeholder,
  wordLimit,
  onChange,
}) => {
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-3 w-full max-w-2xl mx-auto">
      <div className="relative">
        <textarea
          rows={5}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "Type your answer here..."}
          autoFocus
          className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 text-base leading-relaxed resize-y min-h-[140px] outline-none shadow-xs"
        />
      </div>

      <div className="flex items-center justify-between px-2 text-xs">
        <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
          <MessageSquareText className="w-3.5 h-3.5 text-orange-500 dark:text-orange-400" />
          <span>{wordLimit?.suggestion || "Detailed qualitative insights"}</span>
        </div>

        <div className="font-mono text-zinc-500 dark:text-zinc-400">
          <strong className="text-zinc-900 dark:text-zinc-200">{wordCount}</strong> words
        </div>
      </div>
    </div>
  );
};
