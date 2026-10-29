import { m } from "framer-motion";

export function SectionHeader({ title, titleId }: { title: string; titleId?: string }) {
  return (
    <m.header
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="section-header"
    >
      <h2 id={titleId}>{title}</h2>
    </m.header>
  );
}
