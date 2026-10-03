import { useEffect, useState } from "react";

const MIN_HOLD = 520;
const MAX_WAIT = 1900;
const EXIT_DURATION = 850;

export function Intro() {
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setGone(true);
      return;
    }

    const startedAt = performance.now();
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    let done = false;
    let minTimer = 0;
    let exitTimer = 0;
    let maxTimer = 0;

    const release = () => (document.documentElement.style.overflow = prev);
    const finish = () => {
      if (done) return;
      done = true;
      window.clearTimeout(maxTimer);
      minTimer = window.setTimeout(
        () => {
          setLeaving(true);
          exitTimer = window.setTimeout(() => {
            setGone(true);
            release();
          }, EXIT_DURATION);
        },
        Math.max(0, MIN_HOLD - (performance.now() - startedAt)),
      );
    };

    let resolvePageReady: (() => void) | undefined;
    const onLoad = () => resolvePageReady?.();
    const pageReady = new Promise<void>((resolve) => {
      resolvePageReady = resolve;
      if (document.readyState === "complete") resolve();
      else window.addEventListener("load", onLoad, { once: true });
    });
    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    void Promise.all([pageReady, fontsReady]).then(finish, finish);
    maxTimer = window.setTimeout(finish, MAX_WAIT);

    return () => {
      window.clearTimeout(minTimer);
      window.clearTimeout(exitTimer);
      window.clearTimeout(maxTimer);
      window.removeEventListener("load", onLoad);
      release();
    };
  }, []);

  if (gone) return null;

  return (
    <div
      aria-hidden
      className={`intro-curtain ${leaving ? "intro-curtain-out" : ""}`}
      data-state={leaving ? "leaving" : "loading"}
    >
      <div className="intro-topline">
        <span>Six Bullets / Studio</span>
        <span>001 — Studio</span>
      </div>
      <div className="intro-center">
        <p className="intro-kicker">A new world is taking shape</p>
        <div className="intro-word">
          <span>Six</span> <i>Bullets</i>
        </div>
        <div className="intro-load-row">
          <span>Setting the scene</span>
          <div className="intro-progress" aria-hidden>
            {Array.from({ length: 6 }, (_, index) => (
              <span key={index} style={{ animationDelay: `${index * 90}ms` }} />
            ))}
          </div>
          <span className="intro-index">6B</span>
        </div>
      </div>
      <div className="intro-bottomline">
        <span>Independent studio</span>
        <span>Happy Town / In development</span>
      </div>
    </div>
  );
}
