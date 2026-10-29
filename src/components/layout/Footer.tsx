import { ArrowUpRight } from "lucide-react";
import { socialLinks } from "@/data/studio";

const futureSocials = ["X / Twitter", "TikTok", "YouTube", "Instagram"] as const;

export function Footer() {
  return (
    <footer id="site-footer" className="six-footer">
      <div className="six-footer__inner">
        <a href="#top" className="six-footer__brand">
          six bullets
        </a>

        <nav className="six-footer__socials" aria-label="Studio social links">
          <a
            href={socialLinks.roblox.href}
            target="_blank"
            rel="noopener noreferrer"
            className="six-footer__link"
          >
            Roblox Group
            <ArrowUpRight aria-hidden="true" />
          </a>

          {futureSocials.map((label) => (
            <span className="six-footer__future" key={label}>
              {label}
              <span>Soon</span>
            </span>
          ))}
        </nav>

        <span className="six-footer__region">BR STUDIO</span>
      </div>
    </footer>
  );
}
