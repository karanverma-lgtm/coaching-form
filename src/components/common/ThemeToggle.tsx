"use client";

import React from "react";
import { useTheme } from "@/lib/theme/theme-context";
import { Sun, Moon } from "lucide-react";

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`p-2 rounded-xl border transition-colors flex items-center justify-center ${
        theme === "dark"
          ? "bg-zinc-900 hover:bg-zinc-850 text-amber-400 border-zinc-800"
          : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-300 shadow-sm"
      } ${className}`}
      title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
};
