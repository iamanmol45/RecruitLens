"use client";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    // Read from localStorage or system preference
    const savedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
    const systemPrefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    const initialTheme = savedTheme || (systemPrefersLight ? "light" : "dark");
    setTheme(initialTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    if (nextTheme === "light") {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className={`w-9 h-9 rounded-xl border flex items-center justify-center cursor-pointer transition-all duration-200 ${
        theme === "dark"
          ? "border-white/5 hover:border-white/15 bg-[#1E1E22]/50 text-neutral-400 hover:text-white"
          : "border-emerald-500/20 bg-white text-emerald-600 hover:bg-emerald-50 shadow-[0_2px_10px_rgba(16,185,129,0.06)]"
      }`}
      aria-label="Toggle theme"
      title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-brand-primary" />
      ) : (
        <Moon className="w-4 h-4 text-emerald-600" />
      )}
    </button>
  );
}
