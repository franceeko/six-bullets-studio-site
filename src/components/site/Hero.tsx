import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * Letter of the hero title.
 *
 * The entry mask (`overflow-hidden`) is dropped once the reveal finishes.
 * The pointer drift is applied to the whole title block (see below), never to
 * a single glyph — that is what used to slice letters against their clip box.
 */
function Letter({ char, index, revealed }: { char: string; index: number; revealed: boolean }) {
  return (
    <span
      className={`inline-block align-bottom ${revealed ? "" : "overflow-hidden"}`}
      style={{ lineHeight: 0.82 }}
    >
      <motion.span
        initial={{ y: "115%", rotate: 4 }}
        animate={{ y: "0%", rotate: 0 }}
        transition={{
          delay: 0.12 + index * 0.055,
          duration: 1.15,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="inline-block will-change-transform"
      >
        {char}
      </motion.span>
    </span>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const LINES = ["SIX", "BULLETS"];
  const [revealed, setRevealed] = useState(false);
  const totalLetters = LINES.reduce((count, line) => count + line.length, 0);
  const lastLetterDelay = 0.12 + (totalLetters - 1) * 0.055;
  const revealAfterMs = Math.ceil((lastLetterDelay + 1.15 + 0.08) * 1000);

  // Unmask the letters once the entry animation is over.
  useEffect(() => {
    const t = window.setTimeout(() => setRevealed(true), revealAfterMs);
    return () => window.clearTimeout(t);
  }, [revealAfterMs]);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const titleScale = useTransform(scrollYProgress, [0, 1], [1, 0.82]);
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  let counter = 0;

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden"
    >
      <motion.div
        style={{ scale: titleScale, y: titleY, opacity: titleOpacity }}
        className="mx-auto w-full origin-center px-5 sm:px-8 xl:px-[4vw]"
      >
        <h1 className="font-display uppercase leading-[0.82] tracking-[-0.045em] text-ink">
          {LINES.map((line, li) => (
            <span
              key={line}
              className="flex w-full justify-start"
              style={{
                fontSize: li === 0 ? "clamp(4.4rem,24vw,20rem)" : "clamp(2.9rem,16.6vw,14rem)",
              }}
            >
              {line.split("").map((char, ci) => {
                const i = counter++;
                return <Letter key={`${line}-${ci}`} char={char} index={i} revealed={revealed} />;
              })}
            </span>
          ))}
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-7 flex flex-wrap items-center justify-between gap-5 border-t border-ink/25 pt-5"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.34em] text-ink/75 sm:text-xs">
            Independent game studio
          </span>
          <a
            href="#happy-town"
            className="group inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-ink transition-colors hover:text-wine sm:text-xs"
          >
            Happy Town
            <span className="inline-block h-px w-10 bg-ink/50 transition-all group-hover:w-16 group-hover:bg-wine" />
          </a>
        </motion.div>
      </motion.div>

      <motion.a
        href="#sobre"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute inset-x-0 bottom-7 mx-auto flex w-full items-center gap-3 px-5 font-mono text-[10px] uppercase tracking-[0.3em] text-ink/60 sm:px-8 xl:px-[4vw]"
      >
        <ArrowDown className="size-3.5 animate-bounce" />
        Scroll
      </motion.a>
    </section>
  );
}
