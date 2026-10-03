import { motion } from "framer-motion";

import { SectionHeader } from "./SectionHeader";

export function About() {
  return (
    <section id="sobre" className="relative py-20 md:py-32" aria-labelledby="about-title">
      <div className="mx-auto w-full px-5 sm:px-8 xl:px-[4vw]">
        <SectionHeader number="001" kicker="Studio" title="Six Bullets" titleId="about-title" />

        <div className="grid md:grid-cols-12 gap-10 md:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="md:col-span-8 space-y-6 text-xl md:text-2xl text-ink/85 leading-relaxed font-display italic font-normal"
          >
            <p>
              <span className="not-italic font-sans text-ink font-medium">
                We make original games and worlds together.
              </span>
            </p>
            <p className="text-lg md:text-xl not-italic font-sans text-ink/70 leading-relaxed">
              Our current project, Happy Town, is a strange little town still taking shape.
            </p>
          </motion.div>
          <aside className="relative mt-4 hidden min-h-48 flex-col justify-between border-l border-ink/15 py-2 pl-6 md:col-span-3 md:col-start-10 md:flex">
            <span
              aria-hidden
              className="font-display text-8xl italic leading-none tracking-[-0.1em] text-wine/80"
            >
              6B
            </span>
            <span className="font-mono text-[9px] uppercase leading-6 tracking-[0.2em] text-ink/55">
              Independent studio
              <br />
              Games · Worlds · Stories
            </span>
          </aside>
        </div>
      </div>
    </section>
  );
}
