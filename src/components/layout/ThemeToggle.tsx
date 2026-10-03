import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/hooks/theme-context";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light palette" : "Switch to dark palette"}
      aria-pressed={isDark}
      title={isDark ? "Cream palette" : "Ink palette"}
      className="edge-frame relative inline-flex size-9 items-center justify-center overflow-hidden rounded-full bg-cream/70 text-ink transition-colors hover:bg-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine"
    >
      <motion.span
        key={theme}
        initial={{ y: 14, opacity: 0, rotate: -30 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="inline-flex"
      >
        {isDark ? <Moon aria-hidden className="size-4" /> : <Sun aria-hidden className="size-4" />}
      </motion.span>
    </button>
  );
}
