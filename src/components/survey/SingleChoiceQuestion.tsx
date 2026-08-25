"use client";

import React, { useState } from "react";
import { OptionItem } from "@/lib/survey/schema";
import { Check } from "lucide-react";

interface SingleChoiceQuestionProps {
  options: OptionItem[];
  value?: string;
  customOtherText?: string;
  onChange: (val: string, otherText?: string) => void;
}

const SHORTCUT_KEYS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];

export const SingleChoiceQuestion: React.FC<SingleChoiceQuestionProps> = ({
  options,
  value,
  customOtherText = "",
  onChange,
}) => {
  const [otherInput, setOtherInput] = useState(customOtherText);

  // Keep local state in sync if parent value changes
  React.useEffect(() => {
    setOtherInput(customOtherText || "");
  }, [customOtherText]);

  const handleSelect = (option: OptionItem) => {
    onChange(option.value, option.hasTextInput ? otherInput : undefined);
  };

  const handleOtherInputChange = (optionValue: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setOtherInput(text);
    onChange(optionValue, text);
  };

  return (
    <div className="space-y-3 w-full max-w-2xl mx-auto">
      <div className="grid grid-cols-1 gap-2.5">
        {options.map((opt, idx) => {
          const isSelected = value === opt.value;
          const shortcut = idx < SHORTCUT_KEYS.length ? SHORTCUT_KEYS[idx] : null;

          return (
            <div key={opt.value} className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handleSelect(opt)}
                className={`w-full group text-left px-4 py-3.5 rounded-2xl border transition-all duration-150 flex items-center justify-between shadow-xs ${
                  isSelected
                    ? "bg-orange-500/10 dark:bg-orange-500/15 border-orange-500 text-zinc-950 dark:text-white ring-1 ring-orange-500 shadow-md shadow-orange-500/10"
                    : "bg-white dark:bg-zinc-900/60 hover:bg-zinc-50 dark:hover:bg-zinc-850 border-zinc-200 dark:border-zinc-800/90 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-800 dark:text-zinc-200"
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {shortcut && (
                    <span
                      className={`w-7 h-7 rounded-lg text-xs font-mono font-bold flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? "bg-orange-500 text-white shadow-sm"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 group-hover:text-zinc-900 dark:group-hover:text-zinc-200 border border-zinc-300 dark:border-zinc-700"
                      }`}
                    >
                      {shortcut}
                    </span>
                  )}
                  <span className="text-sm sm:text-base font-medium leading-snug">
                    {opt.label}
                  </span>
                </div>

                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                    isSelected
                      ? "bg-orange-500 border-orange-500 text-white"
                      : "border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950/60"
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>

              {/* Text input if option has text input and is selected */}
              {opt.hasTextInput && isSelected && (
                <div className="pl-10 pr-2 pb-1 animate-fadeIn">
                  <input
                    type="text"
                    value={otherInput}
                    onChange={(e) => handleOtherInputChange(opt.value, e)}
                    placeholder={
                      opt.value === "other"
                        ? "Please specify your role / designation..."
                        : "Please specify details..."
                    }
                    autoFocus
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-orange-500 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
