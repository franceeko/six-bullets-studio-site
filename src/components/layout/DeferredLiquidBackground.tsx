import { useEffect, useState } from "react";
import type { ComponentType } from "react";
import { detectPerfTier } from "@/lib/perf-profile";

export function DeferredLiquidBackground() {
  const [Background, setBackground] = useState<ComponentType | null>(null);

  useEffect(() => {
    if (detectPerfTier() === "static") return;

    let cancelled = false;
    const activate = () => {
      void import("./LiquidBackground").then(({ LiquidBackground }) => {
        if (!cancelled) setBackground(() => LiquidBackground);
      });
    };

    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    let idleId: number | undefined;
    let timerId: number | undefined;
    if (idleWindow.requestIdleCallback) {
      idleId = idleWindow.requestIdleCallback(activate, { timeout: 2500 });
    } else {
      timerId = window.setTimeout(activate, 1200);
    }

    return () => {
      cancelled = true;
      if (idleId !== undefined) idleWindow.cancelIdleCallback?.(idleId);
      if (timerId !== undefined) window.clearTimeout(timerId);
    };
  }, []);

  if (Background) return <Background />;

  return (
    <div className="liquid-bg" aria-hidden="true">
      <div className="liquid-base" />
      <div className="liquid-shader-tint" />
      <div className="liquid-shader-vignette" />
      <div className="liquid-flow-fallback" />
    </div>
  );
}
