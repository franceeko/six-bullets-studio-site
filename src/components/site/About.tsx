import { m } from "framer-motion";

import { devs } from "@/data/studio";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeader } from "@/components/site/SectionHeader";

const stats = [
  { value: "01", label: "Current game", note: "Happy Town" },
  {
    value: String(devs.length).padStart(2, "0"),
    label: "People building it",
    note: "Across design, art & development",
  },
  { value: "RBLX", label: "Primary platform", note: "Built for Roblox players" },
];

export function About() {
  return (
    <section id="sobre" className="about-section" aria-labelledby="about-title">
      <div className="section-shell">
        <SectionHeader title="Six Bullets" titleId="about-title" />

        <div className="about-grid">
          <Reveal className="about-copy">
            <p className="about-lead">We make original games and worlds together.</p>
            <p className="about-body">
              Six Bullets is an independent Roblox studio focused on building memorable games,
              strong visual identities and worlds that feel worth exploring.
            </p>
          </Reveal>

          <Reveal className="about-mark" transition={{ delay: 0.1 }}>
            <div className="about-mark-top">
              <span>6B</span>
            </div>
            <div className="about-mark-rule" aria-hidden="true" />
            <p>Build the feeling first. Then build the world.</p>
          </Reveal>
        </div>

        <div className="studio-stats" aria-label="Six Bullets studio facts">
          {stats.map(({ value, label, note }, index) => (
            <m.article
              key={label}
              className="studio-stat"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.55, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="studio-stat-index">0{index + 1}</div>
              <strong>{value}</strong>
              <span>{label}</span>
              <small>{note}</small>
            </m.article>
          ))}
        </div>
      </div>
    </section>
  );
}
