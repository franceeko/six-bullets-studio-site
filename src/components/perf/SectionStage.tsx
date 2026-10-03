import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  minHeight?: number;
  margin?: string;
  once?: boolean;
  id?: string;
  className?: string;
};

/** Keeps expensive section subtrees mounted only near the viewport on desktop. */
export function SectionStage({
  children,
  minHeight = 720,
  margin = "600px 0px 600px 0px",
  once = false,
  id,
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [reserved, setReserved] = useState(minHeight);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (typeof IntersectionObserver === "undefined") {
      setActive(true);
      return;
    }

    const keepMounted =
      once || window.matchMedia("(pointer: coarse), (prefers-reduced-motion: reduce)").matches;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;

        if (entry.isIntersecting) {
          setActive(true);
          if (keepMounted) observer.disconnect();
          return;
        }

        if (!keepMounted) {
          const height = element.getBoundingClientRect().height;
          if (height > 0) setReserved(height);
          setActive(false);
        }
      },
      { rootMargin: margin, threshold: 0 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [margin, once]);

  return (
    <div
      ref={ref}
      id={id}
      className={className}
      style={active ? undefined : { minHeight: reserved, contain: "layout paint" }}
      data-stage={active ? "on" : "off"}
    >
      {active ? children : null}
    </div>
  );
}
