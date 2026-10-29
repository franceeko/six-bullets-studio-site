import { m } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";

import { socialLinks } from "@/data/studio";

export function Contact() {
  return (
    <section id="contato" className="contact-finale" aria-labelledby="contact-title">
      <div className="contact-shell">
        <div className="contact-layout">
          <div className="contact-copy">
            <m.h2
              id="contact-title"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-70px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              Let's make
              <br />
              <em>something worth playing.</em>
            </m.h2>
            <p>
              For collaborations, questions or just to say hello, find us on our community channels.
            </p>
          </div>

          <div className="contact-links">
            {Object.values(socialLinks).map((social, index) => (
              <m.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.08, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="contact-link-content">
                  <span className="contact-link-index">0{index + 1}</span>
                  <span className="contact-link-label">{social.label}</span>
                  <ArrowUpRight aria-hidden />
                </span>
              </m.a>
            ))}
          </div>
        </div>

        <div className="contact-bottom">
          <a href="#top">
            Back to top <ArrowDown aria-hidden />
          </a>
        </div>
      </div>
    </section>
  );
}
