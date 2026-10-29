import { m, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useRef } from "react";

import { images } from "@/assets";

function Letter({ char, index }: { char: string; index: number }) {
  return (
    <span className="hero-letter">
      <m.span
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.44 + index * 0.032, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        {char}
      </m.span>
    </span>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const titleScrollY = useTransform(scrollYProgress, [0, 1], [0, -88]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0]);
  const teaserOpacity = useTransform(scrollYProgress, [0, 0.84], [1, 0]);

  let index = 0;
  const renderWord = (word: string) =>
    word.split("").map((char) => {
      const current = index++;
      return <Letter key={`${word}-${current}`} char={char} index={current} />;
    });

  return (
    <section ref={ref} className="hero" aria-labelledby="hero-title">
      <div className="hero-atmosphere" aria-hidden="true" />

      <m.div className="hero-main" initial={false} animate={{ opacity: 1 }}>
        <div className="hero-copy-row">
          <div className="hero-copy">
            <m.div className="hero-title-stage" style={{ y: titleScrollY, opacity: titleOpacity }}>
              <h1 id="hero-title" className="hero-title">
                <span>{renderWord("SIX")}</span>
                <span className="hero-title-italic">{renderWord("BULLETS")}</span>
              </h1>
            </m.div>

            <m.div className="hero-bottom-row" initial={false} animate={{ opacity: 1, y: 0 }}>
              <p className="hero-description">
                We build original experiences with a clear visual identity, a strong point of view
                and worlds worth exploring.
              </p>
            </m.div>
          </div>
        </div>
      </m.div>

      <m.a href="#happy-town" className="hero-teaser" style={{ opacity: teaserOpacity }}>
        <div className="hero-teaser-topline">
          <span>Current project</span>
        </div>
        <div className="hero-teaser-media">
          <img
            src={images.happyTownBanner.src}
            srcSet={images.happyTownBanner.srcSet}
            sizes="(max-width: 639px) 84vw, (max-width: 1023px) 38vw, 34vw"
            width={images.happyTownBanner.width}
            height={images.happyTownBanner.height}
            alt="Happy Town key art"
            fetchPriority="high"
            decoding="async"
          />
        </div>
        <div className="hero-teaser-info">
          <div>
            <span>Chapter-based horror / investigation</span>
            <strong>Happy Town</strong>
          </div>
          <ArrowUpRight aria-hidden />
        </div>
      </m.a>

      <a href="#sobre" className="hero-scroll">
        <span>Scroll to explore</span>
        <ArrowDown aria-hidden />
      </a>
    </section>
  );
}
