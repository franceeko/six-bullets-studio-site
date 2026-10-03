import { motion } from "framer-motion";
import { useState } from "react";
import { Activity, ArrowUpRight, Eye, Layers3, UsersRound } from "lucide-react";

import { images } from "@/assets";
import { devs, socialLinks } from "@/data/studio";

const details = [
  { label: "CCU", value: "—", note: "Live once the game launches", icon: Activity },
  { label: "Visits", value: "—", note: "Live once the game launches", icon: Eye },
  {
    label: "Team",
    value: `${devs.length} people`,
    note: "Artists, designers & developers",
    icon: UsersRound,
  },
  { label: "Active projects", value: "01", note: "Happy Town is in development", icon: Layers3 },
];

function HappyTownArtwork() {
  const [failed, setFailed] = useState(false);
  const src = failed ? images.happyTownBanner.fallbackSrc : images.happyTownBanner.src;
  const srcSet = failed
    ? undefined
    : `${images.happyTownBanner.src} 1x, ${images.happyTownBanner.src2x} 2x`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 36, clipPath: "inset(9% 3% 0)" }}
      whileInView={{ opacity: 1, y: 0, clipPath: "inset(0% 0% 0)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="project-artwork group relative overflow-hidden bg-ink"
    >
      <div className="relative aspect-[17/9] overflow-hidden">
        <img
          src={src}
          srcSet={srcSet}
          sizes="(max-width: 1023px) 100vw, 92vw"
          alt="Happy Town key art"
          width={images.happyTownBanner.width}
          height={images.happyTownBanner.height}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="absolute inset-0 size-full object-cover object-center"
        />
      </div>
    </motion.div>
  );
}

export function HappyTown() {
  return (
    <section
      className="section-bridge relative overflow-hidden py-16 md:py-28"
      aria-labelledby="happy-town-title"
    >
      <div className="mx-auto w-full px-5 sm:px-8 xl:px-[4vw]">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 md:mb-12">
          <div className="font-mono text-[10px] uppercase text-ink/70 md:text-xs">
            002 — Current project
          </div>
          <span className="project-status font-mono text-[10px] uppercase text-ink/60">
            In development
          </span>
        </div>

        <h2
          id="happy-town-title"
          className="mb-8 max-w-3xl font-display text-[clamp(2.4rem,7vw,6rem)] uppercase leading-[0.9] tracking-[-0.035em] text-ink md:mb-10"
        >
          Happy Town
        </h2>

        <div className="project-showcase">
          <HappyTownArtwork />

          <dl className="project-details">
            {details.map(({ label, value, note, icon: Icon }) => (
              <div className="project-detail" key={label}>
                <dt>
                  <Icon aria-hidden />
                  {label}
                </dt>
                <dd>{value}</dd>
                <dd>{note}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-6">
          <a
            href={socialLinks.discord.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 border border-ink/35 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.24em] text-ink transition-colors hover:border-ink hover:bg-ink/5"
          >
            Follow along on Discord
            <ArrowUpRight
              aria-hidden
              className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
