import { motion } from "framer-motion";

type Props = {
  number: string;
  kicker: string;
  title: string;
  titleId?: string;
};

export function SectionHeader({ number, kicker, title, titleId }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 42, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
      className="mb-10 flex items-end justify-between gap-6 md:mb-14"
    >
      <div>
        <div className="section-kicker mb-5 font-mono text-[10px] uppercase text-ink/60 md:text-xs">
          <span>
            {number} — {kicker}
          </span>
          <motion.span
            aria-hidden
            className="section-kicker-rule"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        <h2
          id={titleId}
          className="font-display text-[clamp(2.8rem,12vw,4rem)] italic font-normal leading-none text-ink md:text-8xl"
        >
          {title}
        </h2>
      </div>
    </motion.div>
  );
}
