import { useEffect } from "react";

import contactStyles from "@/components/site/Contact.css?url";
import faqStyles from "@/components/site/FAQ.css?url";
import happyTownStyles from "@/components/site/HappyTown.css?url";
import teamStyles from "@/components/site/Team.css?url";

const sectionStyles = [
  ["equipe", teamStyles],
  ["happy-town", happyTownStyles],
  ["faq", faqStyles],
  ["contato", contactStyles],
] as const;

function loadStylesheet(href: string) {
  const existingLinks = document.querySelectorAll<HTMLLinkElement>("link[data-section-style]");
  if ([...existingLinks].some((link) => link.dataset["sectionStyle"] === href)) return;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  link.dataset["sectionStyle"] = href;
  document.head.append(link);
}

export function DeferredSectionStyles() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      for (const [, href] of sectionStyles) loadStylesheet(href);
      return;
    }

    if (!("IntersectionObserver" in window)) {
      for (const [, href] of sectionStyles) loadStylesheet(href);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;

          const href = sectionStyles.find(([id]) => entry.target.id === id)?.[1];
          if (href) loadStylesheet(href);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "500px" },
    );

    for (const [id] of sectionStyles) {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  return null;
}
