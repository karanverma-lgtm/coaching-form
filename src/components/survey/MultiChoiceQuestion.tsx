"use client";

import React, { useState } from "react";
import { OptionItem } from "@/lib/survey/schema";
import { Check } from "lucide-react";

interface MultiChoiceQuestionProps {
  options: OptionItem[];
  values?: string[];
  customOtherText?: string;
  maxSelections?: number;
  onChange: (vals: string[], otherText?: string) => void;
}

const SHORTCUT_KEYS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];

export const MultiChoiceQuestion: React.FC<MultiChoiceQuestionProps> = ({
  options,
  values = [],
  customOtherText,
  maxSelections,
  onChange,
}) => {
  const [otherInput, setOtherInput] = useState(customOtherText || "");

  const handleToggle = (option: OptionItem) => {
    const isCurrentlySelected = values.includes(option.value);

    // If exclusive options like "None in particular" or "Not applicable"
    if (
      option.value === "Not applicable" ||
      option.value === "None in particular" ||
      option.value === "No formal indicators"
    ) {
      if (!isCurrentlySelected) {
        onChange([option.value]);
        return;
      }
    }

    // If previously selected an exclusive option, clear it
    let newValues = values.filter(
      (v) => v !== "Not applicable" && v !== "None in particular" && v !== "No formal indicators"
    );

    if (isCurrentlySelected) {
      newValues = newValues.filter((v) => v !== option.value);
    } else {
      if (maxSelections && newValues.length >= maxSelections) {
        return; // Max reached
      }
      newValues = [...newValues, option.value];
    }

    onChange(newValues, newValues.includes("Other") ? otherInput : undefined);
  };

  const handleOtherInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setOtherInput(text);
    onChange(values, text);
  };

  const isMaxReached = Boolean(maxSelections && values.length >= maxSelections);

  return (
    <div className="space-y-3 w-full max-w-2xl mx-auto">
      {maxSelections && (
        <div className="flex items-center justify-between px-1 text-xs">
          <span className="text-zinc-600 dark:text-zinc-400 font-medium">
            Select up to <strong className="text-zinc-900 dark:text-white">{maxSelections}</strong>
          </span>
          <span
            className={`font-mono px-2 py-0.5 rounded-full text-[11px] font-semibold ${
              isMaxReached
                ? "bg-amber-500/15 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700"
            }`}
          >
            {values.length} / {maxSelections} selected
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-2.5">
        {options.map((opt, idx) => {
          const isSelected = values.includes(opt.value);
          const isDisabled = !isSelected && isMaxReached;
          const shortcut = idx < SHORTCUT_KEYS.length ? SHORTCUT_KEYS[idx] : null;

          return (
            <div key={opt.value} className="flex flex-col gap-2">
              <button
                type="button"
                disabled={isDisabled}
                onClick={() => handleToggle(opt)}
                className={`w-full group text-left px-4 py-3.5 rounded-2xl border transition-all duration-150 flex items-center justify-between shadow-xs ${
                  isSelected
                    ? "bg-orange-500/10 dark:bg-orange-500/15 border-orange-500 text-zinc-950 dark:text-white ring-1 ring-orange-500 shadow-md shadow-orange-500/10"
                    : isDisabled
                    ? "opacity-40 bg-zinc-100/50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-850 cursor-not-allowed text-zinc-400 dark:text-zinc-500"
                    : "bg-white dark:bg-zinc-900/60 hover:bg-zinc-50 dark:hover:bg-zinc-850 border-zinc-200 dark:border-zinc-800/90 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-800 dark:text-zinc-200"
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {shortcut && (
                    <span
                      className={`w-7 h-7 rounded-lg text-xs font-mono font-bold flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? "bg-orange-500 text-white"
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
                  className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 border transition-all ${
                    isSelected
                      ? "bg-orange-500 border-orange-500 text-white shadow-sm"
                      : "border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950/60"
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>

              {opt.hasTextInput && isSelected && (
                <div className="pl-10 pr-2 pb-1 animate-fadeIn">
                  <input
                    type="text"
                    value={otherInput}
                    onChange={handleOtherInputChange}
                    placeholder="Please specify details..."
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
