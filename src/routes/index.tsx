import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, type ReactNode } from "react";

import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { SectionBoundary } from "@/components/perf/SectionBoundary";
import { About } from "@/components/site/About";
import { Hero } from "@/components/site/Hero";

const Team = lazy(() => import("@/components/site/Team").then(({ Team }) => ({ default: Team })));
const HappyTown = lazy(() =>
  import("@/components/site/HappyTown").then(({ HappyTown }) => ({ default: HappyTown })),
);
const FAQ = lazy(() => import("@/components/site/FAQ").then(({ FAQ }) => ({ default: FAQ })));
const Contact = lazy(() =>
  import("@/components/site/Contact").then(({ Contact }) => ({ default: Contact })),
);

function DeferredSection({ children, minHeight }: { children: ReactNode; minHeight: string }) {
  return (
    <Suspense fallback={<div aria-hidden="true" style={{ minHeight }} />}>{children}</Suspense>
  );
}

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
          <DeferredSection minHeight="72rem">
            <Team />
          </DeferredSection>
        </SectionBoundary>
        <SectionBoundary label="Happy Town">
          <DeferredSection minHeight="64rem">
            <HappyTown />
          </DeferredSection>
        </SectionBoundary>
        <SectionBoundary label="FAQ">
          <DeferredSection minHeight="40rem">
            <FAQ />
          </DeferredSection>
        </SectionBoundary>
        <SectionBoundary label="Contact">
          <DeferredSection minHeight="38rem">
            <Contact />
          </DeferredSection>
        </SectionBoundary>
      </main>
      <Footer />
    </div>
  );
}
