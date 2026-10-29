export const siteConfig = {
  name: "Six Bullets Studio",
  shortName: "Six Bullets",
  description: "Six Bullets is an independent creative studio building original games and worlds.",
  projectDescription:
    "Meet the people behind Six Bullets and explore our current project, Happy Town.",
  locale: "en",
} as const;

export const navigationLinks = [
  { href: "#about-title", label: "Studio" },
  { href: "#team-title", label: "Team" },
  { href: "#happy-town-title", label: "Project" },
  { href: "#faq-title", label: "FAQ" },
  { href: "#contato", label: "Contact" },
] as const;
