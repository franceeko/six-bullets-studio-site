import { m } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { MobileMenu } from "@/components/layout/MobileMenu";
import { navigationLinks } from "@/data/site";
import { socialLinks } from "@/data/studio";

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("top");
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const targets = navigationLinks
      .map((link) => {
        const id = link.href.slice(1);
        const anchor = document.getElementById(id);
        if (!anchor) return null;
        const section = anchor.closest<HTMLElement>("section") ?? anchor;
        return { id, anchor, section };
      })
      .filter(
        (entry): entry is { id: string; anchor: HTMLElement; section: HTMLElement } =>
          entry !== null,
      );

    let animationFrame = 0;
    let stateFrame = 0;
    let originalScrollBehavior: string | null = null;

    const restoreScrollBehavior = () => {
      if (originalScrollBehavior === null) return;
      document.documentElement.style.scrollBehavior = originalScrollBehavior;
      originalScrollBehavior = null;
    };

    const cancelAnchorScroll = () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      restoreScrollBehavior();
    };

    const updateActiveSection = () => {
      stateFrame = 0;
      if (animationFrame) return;

      const marker = window.scrollY + Math.min(window.innerHeight * 0.32, 260) + 72;
      let current = "top";

      for (const entry of targets) {
        const top = entry.section.getBoundingClientRect().top + window.scrollY;
        if (top <= marker) current = entry.id;
        else break;
      }

      const atBottom =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8;
      if (atBottom && targets.length > 0) current = targets[targets.length - 1]!.id;

      setActiveSection(current);
    };

    const scheduleStateUpdate = () => {
      setScrolled(window.scrollY > 24);
      if (!stateFrame && !animationFrame) {
        stateFrame = window.requestAnimationFrame(updateActiveSection);
      }
    };

    const animateTo = (targetY: number) => {
      cancelAnchorScroll();

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        window.scrollTo({ top: targetY, behavior: "auto" });
        scheduleStateUpdate();
        return;
      }

      const startY = window.scrollY;
      const distance = targetY - startY;
      if (Math.abs(distance) < 2) {
        window.scrollTo({ top: targetY, behavior: "auto" });
        scheduleStateUpdate();
        return;
      }

      const duration = Math.min(1400, Math.max(850, Math.abs(distance) * 0.45));
      const startTime = performance.now();
      originalScrollBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = "auto";

      const easeInOut = (progress: number) =>
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      const frame = (now: number) => {
        const progress = Math.min(1, (now - startTime) / duration);
        window.scrollTo(0, startY + distance * easeInOut(progress));

        if (progress < 1) {
          animationFrame = window.requestAnimationFrame(frame);
        } else {
          animationFrame = 0;
          restoreScrollBehavior();
          scheduleStateUpdate();
        }
      };

      animationFrame = window.requestAnimationFrame(frame);
    };

    const onAnchorClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        !(event.target instanceof Element)
      ) {
        return;
      }

      const anchor = event.target.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;

      let id: string;
      try {
        id = decodeURIComponent(anchor.hash.slice(1));
      } catch {
        return;
      }

      const target = document.getElementById(id);
      if (!target) return;

      event.preventDefault();
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

      let destination = maxScroll;
      if (id !== "contato") {
        const marginTop = Number.parseFloat(window.getComputedStyle(target).scrollMarginTop) || 0;
        destination = Math.max(
          0,
          Math.min(maxScroll, target.getBoundingClientRect().top + window.scrollY - marginTop),
        );
      }

      if (window.location.hash !== anchor.hash) {
        window.history.pushState(null, "", anchor.hash);
      }
      setActiveSection(id);
      animateTo(destination);
    };

    const onUserScrollIntent = (event: Event) => {
      if (!animationFrame) return;
      if (event.type === "keydown") {
        const key = (event as KeyboardEvent).key;
        if (!["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(key))
          return;
      }
      cancelAnchorScroll();
      scheduleStateUpdate();
    };

    const onPopState = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      const target = document.getElementById(id);
      if (!target) {
        scheduleStateUpdate();
        return;
      }
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const marginTop = Number.parseFloat(window.getComputedStyle(target).scrollMarginTop) || 0;
      const destination =
        id === "contato"
          ? maxScroll
          : Math.max(
              0,
              Math.min(maxScroll, target.getBoundingClientRect().top + window.scrollY - marginTop),
            );
      setActiveSection(id || "top");
      animateTo(destination);
    };

    scheduleStateUpdate();
    document.addEventListener("click", onAnchorClick);
    window.addEventListener("scroll", scheduleStateUpdate, { passive: true });
    window.addEventListener("resize", scheduleStateUpdate, { passive: true });
    window.addEventListener("popstate", onPopState);
    window.addEventListener("wheel", onUserScrollIntent, { passive: true });
    window.addEventListener("touchstart", onUserScrollIntent, { passive: true });
    window.addEventListener("pointerdown", onUserScrollIntent, { passive: true });
    window.addEventListener("keydown", onUserScrollIntent);

    return () => {
      document.removeEventListener("click", onAnchorClick);
      window.removeEventListener("scroll", scheduleStateUpdate);
      window.removeEventListener("resize", scheduleStateUpdate);
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("wheel", onUserScrollIntent);
      window.removeEventListener("touchstart", onUserScrollIntent);
      window.removeEventListener("pointerdown", onUserScrollIntent);
      window.removeEventListener("keydown", onUserScrollIntent);
      if (stateFrame) window.cancelAnimationFrame(stateFrame);
      cancelAnchorScroll();
    };
  }, []);

  return (
    <>
      <a className="skip-link" href="#conteudo">
        Skip to content
      </a>
      <m.header
        initial={{ y: -22, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={`site-nav ${scrolled ? "site-nav--scrolled" : ""}`}
      >
        <nav aria-label="Primary navigation" className="site-nav-inner">
          <a href="#top" className="site-nav-brand" aria-label="Six Bullets home">
            <span className="site-nav-brand-stamp" aria-hidden="true">
              6B
            </span>
            <span className="site-nav-brand-word">six bullets</span>
          </a>

          <div className="site-nav-links">
            {navigationLinks.map((link) => {
              const sectionId = link.href.slice(1);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`site-nav-link ${activeSection === sectionId ? "is-active" : ""}`}
                  aria-current={activeSection === sectionId ? "location" : undefined}
                >
                  <span>{link.label}</span>
                </a>
              );
            })}
          </div>

          <div className="site-nav-actions">
            <a
              href={socialLinks.discord.href}
              target="_blank"
              rel="noopener noreferrer"
              className="site-nav-discord"
            >
              Discord <ArrowUpRight aria-hidden />
            </a>
            <button
              type="button"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen((open) => !open)}
              className="site-nav-menu"
            >
              <span aria-hidden className="site-nav-menu-line site-nav-menu-line--top" />
              <span aria-hidden className="site-nav-menu-line" />
              <span aria-hidden className="site-nav-menu-line site-nav-menu-line--short" />
            </button>
          </div>
        </nav>
      </m.header>
      <MobileMenu open={menuOpen} onClose={closeMenu} links={navigationLinks} />
    </>
  );
}
