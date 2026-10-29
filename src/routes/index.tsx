import { createFileRoute } from "@tanstack/react-router";

import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { SectionBoundary } from "@/components/perf/SectionBoundary";
import { About } from "@/components/site/About";
import { Contact } from "@/components/site/Contact";
import { FAQ } from "@/components/site/FAQ";
import { HappyTown } from "@/components/site/HappyTown";
import { Hero } from "@/components/site/Hero";
import { Team } from "@/components/site/Team";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Six Bullets Studio" },
      {
        name: "description",
        content:
          "Six Bullets is an independent Roblox studio building original games and worlds, including Happy Town.",
      },
      { property: "og:title", content: "Six Bullets Studio" },
      {
        property: "og:description",
        content: "Meet the people behind Six Bullets and explore Happy Town.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div id="top" className="site-page">
      <Nav />
      <main id="conteudo" tabIndex={-1}>
        <Hero />
        <About />
        <SectionBoundary label="The team">
          <Team />
        </SectionBoundary>
        <SectionBoundary label="Happy Town">
          <HappyTown />
        </SectionBoundary>
        <SectionBoundary label="FAQ">
          <FAQ />
        </SectionBoundary>
        <SectionBoundary label="Contact">
          <Contact />
        </SectionBoundary>
      </main>
      <Footer />
    </div>
  );
}
