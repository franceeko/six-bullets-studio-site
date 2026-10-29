import { m } from "framer-motion";
import { ArrowUpRight, Activity, Eye, Layers3 } from "lucide-react";
import { useState } from "react";

import { images } from "@/assets";
import { socialLinks } from "@/data/studio";
import { SectionHeader } from "@/components/site/SectionHeader";

const details = [
  {
    label: "Status",
    value: "In development",
    note: "Chapter-based horror / investigation",
    icon: Layers3,
  },
  { label: "Platform", value: "Roblox", note: "R6-focused experience", icon: Activity },
  { label: "Visits", value: "—", note: "Live after launch", icon: Eye },
];

const chapters = ["The First Siren", "Happy Mall"];

export function HappyTown() {
  const [failed, setFailed] = useState(false);

  return (
    <section id="happy-town" className="project-section" aria-labelledby="happy-town-title">
      <div className="project-grid-mark" aria-hidden="true">
        HT / 001
      </div>
      <div className="section-shell">
        <SectionHeader title="Happy Town" titleId="happy-town-title" />

        <div className="project-intro-row">
          <div>
            <m.p
              className="project-intro-lead"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              A strange little town where everything changes after dark.
            </m.p>
            <div className="project-chapters" aria-label="Happy Town chapters">
              {chapters.map((chapter, index) => (
                <m.span
                  key={chapter}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                >
                  <b>0{index + 1}</b>
                  {chapter}
                </m.span>
              ))}
            </div>
          </div>
          <span className="project-status">
            <i /> In development
          </span>
        </div>

        <div className="project-showcase">
          <m.div
            className="project-artwork"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-70px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="project-artwork-frame">
              <div className="project-artwork-image-wrap">
                {failed ? (
                  <div
                    className="project-artwork-fallback"
                    role="img"
                    aria-label="Happy Town artwork unavailable"
                  >
                    <span>Happy Town</span>
                    <small>Artwork unavailable</small>
                  </div>
                ) : (
                  <m.img
                    src={images.happyTownBanner.src}
                    srcSet={images.happyTownBanner.srcSet}
                    sizes="(max-width: 900px) 100vw, 68vw"
                    width={images.happyTownBanner.width}
                    height={images.happyTownBanner.height}
                    alt="Happy Town key art"
                    loading="lazy"
                    decoding="async"
                    onError={() => setFailed(true)}
                  />
                )}
              </div>
            </div>
          </m.div>

          <div className="project-details" aria-label="Happy Town details">
            {details.map(({ label, value, note, icon: Icon }, index) => (
              <m.div
                className="project-detail"
                key={label}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.58, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="project-detail-head">
                  <Icon aria-hidden />
                  <span>{label}</span>
                </div>
                <strong>{value}</strong>
                <p>{note}</p>
              </m.div>
            ))}
          </div>
        </div>

        <div className="project-bottom-row">
          <p>Follow the project as the town gets stranger.</p>
          <m.a
            href={socialLinks.discord.href}
            target="_blank"
            rel="noopener noreferrer"
            className="project-cta"
            whileHover={{ x: 7 }}
          >
            <span>Follow development on Discord</span>
            <ArrowUpRight aria-hidden />
          </m.a>
        </div>
      </div>
    </section>
  );
}
