import { useEffect, useState } from "react";
import { m } from "framer-motion";

const HOLD_DURATION = 300;
const EXIT_DURATION = 300;

export function Intro() {
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    const exitTimer = window.setTimeout(() => setLeaving(true), HOLD_DURATION);
    const removeTimer = window.setTimeout(() => {
      setGone(true);
      document.documentElement.style.overflow = previousOverflow;
    }, HOLD_DURATION + EXIT_DURATION);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(removeTimer);
      document.documentElement.style.overflow = previousOverflow;
    };
  }, []);

  if (gone) return null;

  return (
    <m.div
      aria-hidden="true"
      className="intro-curtain intro-curtain--minimal"
      initial={{ opacity: 1 }}
      animate={leaving ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: EXIT_DURATION / 1000, ease: [0.76, 0, 0.24, 1] }}
    >
      <m.div
        className="intro-word intro-word--minimal"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        Six <em>Bullets</em>
      </m.div>
    </m.div>
  );
}
