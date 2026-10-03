export const siteConfig = {
  name: "Six Bullets Studio",
  shortName: "Six Bullets",
  description:
    "Six Bullets is an independent creative studio building original games and worlds.",
  projectDescription:
    "Meet the people behind Six Bullets and explore our current project, Happy Town.",
  locale: "en",
} as const;

export const navigationLinks = [
  { href: "#happy-town", label: "Project" },
  { href: "#sobre", label: "Studio" },
  { href: "#equipe", label: "Team" },
  { href: "#contato", label: "Contact" },
] as const;
