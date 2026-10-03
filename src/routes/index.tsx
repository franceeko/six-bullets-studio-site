import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, type ReactNode } from "react";

import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { SectionStage } from "@/components/perf/SectionStage";
import { SectionBoundary } from "@/components/perf/SectionBoundary";
import { About } from "@/components/site/About";
import { Hero } from "@/components/site/Hero";

const HappyTown = lazy(() => import("@/components/site/HappyTown").then((m) => ({ default: m.HappyTown })));
const Team = lazy(() => import("@/components/site/Team").then((m) => ({ default: m.Team })));
const Contact = lazy(() => import("@/components/site/Contact").then((m) => ({ default: m.Contact })));

function SectionFallback({ height = 720 }: { height?: number }) {
  return <div aria-hidden style={{ minHeight: height }} />;
}

function Deferred({ children, height }: { children: ReactNode; height?: number }) {
  return <Suspense fallback={<SectionFallback height={height} />}>{children}</Suspense>;
}

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div id="top" className="relative text-ink">
      <Nav />
      <main id="conteudo" tabIndex={-1} className="relative z-10">
        <Hero />
        <About />
        <SectionStage id="happy-town" className="scroll-mt-20" minHeight={860} once>
          <SectionBoundary label="Happy Town">
            <Deferred height={860}>
              <HappyTown />
            </Deferred>
          </SectionBoundary>
        </SectionStage>
        <SectionStage id="equipe" className="scroll-mt-20" minHeight={1600} once>
          <SectionBoundary label="The team">
            <Deferred height={1600}>
              <Team />
            </Deferred>
          </SectionBoundary>
        </SectionStage>
      </main>
      <div className="closing-texture relative z-10 overflow-hidden bg-cream">
        <SectionStage id="contato" className="scroll-mt-20" minHeight={640} once>
          <SectionBoundary label="Contact">
            <Deferred height={640}>
              <Contact />
            </Deferred>
          </SectionBoundary>
        </SectionStage>
        <Footer />
      </div>
    </div>
  );
}
