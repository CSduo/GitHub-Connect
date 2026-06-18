"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105"
      style={{
        background: "var(--surface-soft)",
        border: "1px solid var(--border)",
      }}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`${theme === "dark" ? "Light" : "Dark"} mode`}
    >
      <Sun
        size={18}
        className="absolute transition-all duration-300"
        style={{
          opacity: theme === "dark" ? 1 : 0,
          transform: theme === "dark" ? "rotate(0deg)" : "rotate(90deg)",
          color: "var(--gold)",
        }}
      />
      <Moon
        size={18}
        className="absolute transition-all duration-300"
        style={{
          opacity: theme === "dark" ? 0 : 1,
          transform: theme === "dark" ? "rotate(-90deg)" : "rotate(0deg)",
          color: "var(--gold)",
        }}
      />
    </button>
  );
}
