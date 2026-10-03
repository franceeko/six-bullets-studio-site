import { motion } from "framer-motion";
import { useState } from "react";

import { devs, type Dev } from "@/data/studio";
import { SectionHeader } from "./SectionHeader";

function Portrait({ dev }: { dev: Dev }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className="member-card-portrait flex items-center justify-center"
        role="img"
        aria-label={`${dev.name} portrait unavailable`}
      >
        <span className="font-display text-5xl italic text-ink/50">{dev.name.slice(0, 2)}</span>
      </div>
    );
  }

  if (dev.avatar.type === "video") {
    return (
      <div className="member-card-portrait">
        <video
          src={dev.avatar.src}
          poster={dev.avatar.poster}
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          aria-label={`${dev.name} portrait`}
          onError={() => setFailed(true)}
          className="size-full object-cover object-top"
        />
      </div>
    );
  }

  const src = failed ? dev.avatar.fallbackSrc : dev.avatar.src;
  const srcSet = failed ? undefined : `${dev.avatar.src} 1x, ${dev.avatar.src2x} 2x`;

  return (
    <div className="member-card-portrait">
      <img
        src={src}
        srcSet={srcSet}
        sizes="(max-width: 639px) 46vw, (max-width: 1023px) 30vw, 22vw"
        alt={`${dev.name} — ${dev.role}`}
        loading="lazy"
        decoding="async"
        width={dev.avatar.width}
        height={dev.avatar.height}
        onError={() => setFailed(true)}
        className="size-full object-cover object-top"
      />
    </div>
  );
}

function MemberCard({ dev, index }: { dev: Dev; index: number }) {
  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 38,
        x: index % 2 === 0 ? -16 : 16,
        rotate: index % 2 === 0 ? -2 : 2,
        scale: 0.95,
      }}
      whileInView={{ opacity: 1, y: 0, x: 0, rotate: 0, scale: 1 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{
        duration: 0.8,
        delay: (index % 5) * 0.075,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -6, transition: { type: "spring", stiffness: 250, damping: 25 } }}
      className={`member-card member-card--${dev.id} group min-w-0`}
    >
      <div className="member-card-frame">
        <Portrait dev={dev} />
        <div className="member-card-caption">
          <div className="w-full min-w-0">
            <span className="member-card-category">Six Bullets / {dev.tag}</span>
            <h3 className="member-card-name">{dev.name}</h3>
            <p className="member-card-role">{dev.role}</p>
          </div>
        </div>
        <span aria-hidden className="member-card-emblem" />
      </div>
    </motion.article>
  );
}

export function Team() {
  return (
    <section className="relative py-16 md:py-24" aria-labelledby="team-title">
      <div className="mx-auto w-full px-5 sm:px-8 xl:px-[4vw]">
        <SectionHeader
          number="003"
          kicker={`${devs.length} people making things together`}
          title="The team"
          titleId="team-title"
        />
        <div className="member-formation">
          {devs.map((dev, index) => (
            <MemberCard key={dev.id} dev={dev} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
