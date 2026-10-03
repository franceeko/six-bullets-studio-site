import { ArrowUpRight, X } from "lucide-react";
import { useEffect, useRef } from "react";

import { socialLinks } from "@/data/studio";

type LinkItem = { href: string; label: string };

type Props = {
  open: boolean;
  onClose: () => void;
  links: readonly LinkItem[];
};

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function MobileMenu({ open, onClose, links }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const container = containerRef.current;
    const previousActive = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus({ preventScroll: true });

    const getFocusable = () =>
      Array.from(container?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []).filter(
        (element) => !element.hasAttribute("disabled"),
      );

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const items = getFocusable();
      if (!items.length) return;

      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previousActive && document.body.contains(previousActive) && !container?.contains(previousActive)) {
        previousActive.focus({ preventScroll: true });
      }
    };
  }, [onClose, open]);

  return (
    <div
      ref={containerRef}
      id="mobile-navigation"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
      aria-hidden={!open}
      className={`fixed inset-0 z-[70] bg-cream/97 backdrop-blur-md transition-all duration-500 md:hidden ${
        open ? "visible opacity-100" : "pointer-events-none invisible opacity-0"
      }`}
    >
      <div className="flex h-16 items-center justify-between px-6">
        <span className="text-3xl leading-none text-ink" style={{ fontFamily: "var(--font-script)" }}>
          six bullets
        </span>
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close navigation menu"
          tabIndex={open ? 0 : -1}
          className="inline-flex size-10 items-center justify-center rounded-full border border-ink/15 text-ink"
        >
          <X aria-hidden className="size-5" />
        </button>
      </div>

      <nav
        aria-label="Mobile primary navigation"
        className="flex h-[calc(100dvh-4rem)] flex-col justify-center gap-2 px-6 pb-24"
      >
        {links.map((link, index) => (
          <a
            key={link.href}
            href={link.href}
            onClick={onClose}
            tabIndex={open ? 0 : -1}
            className="font-display text-5xl uppercase leading-[0.95] tracking-[-0.03em] text-ink transition-all duration-500"
            style={{
              transitionDelay: `${index * 80 + 100}ms`,
              opacity: open ? 1 : 0,
              transform: open ? "translateY(0)" : "translateY(20px)",
            }}
          >
            {link.label}
          </a>
        ))}

        <a
          href={socialLinks.discord.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          tabIndex={open ? 0 : -1}
          className="mt-10 inline-flex w-fit items-center gap-2 border-b border-ink/30 pb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink"
        >
          Discord
          <ArrowUpRight aria-hidden className="size-3.5" />
        </a>
      </nav>
    </div>
  );
}
