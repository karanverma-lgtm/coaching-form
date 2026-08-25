"use client";

import React, { createContext, useContext, useEffect, ReactNode } from "react";

type Theme = "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
  setTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    // Ensure dark class is permanently removed from the root element
    document.documentElement.classList.remove("dark");
    try {
      localStorage.removeItem("survey_app_theme");
    } catch {
      // ignore
    }
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme: "light",
        toggleTheme: () => {},
        setTheme: () => {},
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

