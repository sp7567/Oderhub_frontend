/**
 * context/ThemeContext.jsx
 * Provides theme state (light | dark) via React Context.
 * - Default: "light" (white UI)
 * - Persists choice in localStorage
 * - Applies/removes the "dark" class on <html> for Tailwind's darkMode:"class"
 */

import { createContext, useContext, useState, useEffect } from "react";

// ─── Context ──────────────────────────────────────────────────────────────────
const ThemeContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Read persisted preference; fall back to "light"
    return localStorage.getItem("oms-theme") || "light";
  });

  // Sync theme class on <html> whenever theme changes
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("oms-theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
/**
 * useTheme — consume the theme context anywhere in the tree.
 * Returns { theme: "light"|"dark", toggleTheme: () => void }
 */
export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
};
