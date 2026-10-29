import { m, type MotionProps } from "framer-motion";
import type { ReactNode } from "react";

type Props = MotionProps & {
  children: ReactNode;
  className?: string;
};

export function Reveal({ children, className, ...props }: Props) {
  return (
    <m.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      {...props}
    >
      {children}
    </m.div>
  );
}
