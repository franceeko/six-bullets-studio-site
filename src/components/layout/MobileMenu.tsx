import { ArrowUpRight, X } from "lucide-react";
import { m } from "framer-motion";
import { useEffect, useRef } from "react";

import { socialLinks } from "@/data/studio";

type LinkItem = { href: string; label: string };

type Props = {
  open: boolean;
  onClose: () => void;
  links: readonly LinkItem[];
};

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

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
      const first = items[0]!;
      const last = items[items.length - 1]!;
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
      if (previousActive && document.body.contains(previousActive)) {
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
      className={`mobile-menu ${open ? "mobile-menu--open" : ""}`}
    >
      <div className="mobile-menu-head">
        <span className="mobile-menu-brand">
          six bullets <small>/ 6B</small>
        </span>
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close navigation menu"
          tabIndex={open ? 0 : -1}
          className="mobile-menu-close"
        >
          <span>Close</span>
          <X aria-hidden />
        </button>
      </div>

      <nav aria-label="Mobile primary navigation" className="mobile-menu-links">
        {links.map((link, index) => (
          <m.a
            key={link.href}
            href={link.href}
            onClick={onClose}
            tabIndex={open ? 0 : -1}
            initial={false}
            animate={open ? { opacity: 1, x: 0 } : { opacity: 0, x: 28 }}
            transition={{ delay: open ? index * 0.06 : 0, duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            className="mobile-menu-link"
          >
            <span className="mobile-menu-index">0{index + 1}</span>
            <span>{link.label}</span>
            <ArrowUpRight aria-hidden />
          </m.a>
        ))}
      </nav>

      <div className="mobile-menu-foot">
        <a
          href={socialLinks.discord.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
        >
          Discord <ArrowUpRight aria-hidden />
        </a>
        <span>Independent studio / Brazil</span>
      </div>
    </div>
  );
}
