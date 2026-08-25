"use client";

import React, { useRef, useEffect } from "react";
import { User, Mail } from "lucide-react";

interface TextInputQuestionProps {
  value?: string;
  placeholder?: string;
  type?: "text" | "email";
  onChange: (val: string) => void;
  onEnter?: () => void;
}

export const TextInputQuestion: React.FC<TextInputQuestionProps> = ({
  value = "",
  placeholder,
  type = "text",
  onChange,
  onEnter,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input on step change
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onEnter) {
      e.preventDefault();
      onEnter();
    }
  };

  return (
    <div className="space-y-3 w-full max-w-2xl mx-auto">
      <div className="relative flex items-center">
        <div className="absolute left-4.5 pointer-events-none text-zinc-400">
          {type === "email" ? <Mail className="w-5 h-5" /> : <User className="w-5 h-5" />}
        </div>
        <input
          ref={inputRef}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || (type === "email" ? "name@company.com" : "Your full name")}
          className="w-full pl-13 pr-5 py-4 rounded-2xl bg-white dark:bg-zinc-900/80 border border-zinc-300 dark:border-zinc-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 text-lg leading-relaxed outline-none shadow-xs transition-all"
        />
      </div>
      <p className="text-xs text-zinc-500 px-2 font-mono">
        Press <kbd className="px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700">Enter ↵</kbd> to proceed
      </p>
    </div>
  );
};
