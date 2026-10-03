import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { socialLinks } from "@/data/studio";

export function Contact() {
  return (
    <section className="contact-finale relative isolate overflow-hidden" aria-labelledby="contact-title">
      <div className="contact-art" aria-hidden="true">
        <svg viewBox="0 0 900 650" preserveAspectRatio="xMidYMid meet">
          <path
            className="contact-orbit-path"
            d="M420 652C630 570 245 520 400 374S815 342 671 170 392 88 562-22"
          />
          <path
            className="contact-orbit-path contact-orbit-path-secondary"
            d="M900 500C708 452 806 330 575 360S250 460 260 265 566 203 440 32"
          />
          <circle className="contact-orbit-ring" cx="590" cy="322" r="210" />
          <circle className="contact-orbit-satellite" cx="800" cy="322" r="5" />
          <text className="contact-art-mark" x="590" y="350" textAnchor="middle">
            6B
          </text>
        </svg>
      </div>

      <div className="contact-layout">
        <div className="contact-copy">
          <div className="contact-kicker">004 / The next story starts here</div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            id="contact-title"
            className="contact-heading font-display font-normal text-ink"
          >
            Let's make
            <br />
            <span>something odd.</span>
          </motion.h2>
          <p className="contact-description">
            We love meeting people who care about thoughtful games, strange worlds, and stories
            worth sharing.
          </p>
        </div>

        <div className="contact-links">
          {Object.values(socialLinks).map((social, index) => (
            <motion.a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              whileHover={{ x: 8 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="contact-link group"
            >
              <span>{social.label}</span>
              <ArrowUpRight aria-hidden className="contact-link-arrow" />
            </motion.a>
          ))}
        </div>
      </div>

      <div className="contact-signoff" aria-hidden="true">
        <span>Six Bullets Studio / Get in touch</span>
        <span>6B — {new Date().getFullYear()}</span>
      </div>
    </section>
  );
}
