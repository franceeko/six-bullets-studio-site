import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import { devAvatars, images } from "../src/assets/index.ts";

function assertPublicAsset(url: string) {
  assert.match(url, /^\/assets\/team\//);
  assert.ok(existsSync(join(process.cwd(), "public", url.slice(1))), `${url} is missing`);
}

test("all registered media assets exist under public", () => {
  const allAssets = [...Object.values(devAvatars), ...Object.values(images)];

  for (const asset of allAssets) {
    assertPublicAsset(asset.src);
    if (asset.type === "image") assertPublicAsset(asset.src2x);
    if (asset.type === "video") assertPublicAsset(asset.poster);
  }
});

test("largest team portraits expose width-based responsive candidates", () => {
  for (const name of ["zark", "francez", "samuca"] as const) {
    const srcSet = devAvatars[name].srcSet ?? "";
    assert.match(srcSet, /320w/);
    assert.match(srcSet, /400w/);
    assert.match(srcSet, /512w/);
    assert.match(srcSet, /832w/);
    for (const candidate of srcSet.split(",")) {
      const url = candidate.trim().split(/\s+/)[0];
      assert.ok(url, `${name} has an empty srcset candidate`);
      assertPublicAsset(url);
    }
  }
});

test("flagged crew portraits have right-sized desktop candidates", () => {
  for (const name of ["eater", "poli", "syntax", "thugo", "whirle"] as const) {
    const srcSet = devAvatars[name].srcSet ?? "";
    for (const width of [320, 400, 512, 1024]) assert.match(srcSet, new RegExp(`${width}w`));
    for (const candidate of srcSet.split(",")) {
      assertPublicAsset(candidate.trim().split(/\s+/)[0] ?? "");
    }
  }
});

test("portrait parallax stays inside a stationary crop window", () => {
  const team = readFileSync(join(process.cwd(), "src", "components", "site", "Team.tsx"), "utf8");
  const styles = readFileSync(join(process.cwd(), "src", "components", "site", "Team.css"), "utf8");
  assert.match(
    team,
    /<div className="member-card-portrait-wrap">\s*<m\.div className="member-card-portrait-motion" style=\{\{ x: imageX, y: imageY \}\}>[\s\S]*?<Portrait dev=\{dev\} \/>/,
  );
  assert.match(styles, /\.member-card-portrait-wrap\s*\{[^}]*overflow: hidden/);
  assert.match(styles, /\.member-card-portrait-motion\s*\{\s*position: absolute;\s*inset: -18px;/);
});

test("hero key art is not hidden behind a delayed entrance animation", () => {
  const hero = readFileSync(join(process.cwd(), "src", "components", "site", "Hero.tsx"), "utf8");
  assert.doesNotMatch(hero, /initial=\{\{ opacity: 0, y: 18 \}\}/);
});

test("liquid shader is deferred until the browser is idle", () => {
  const root = readFileSync(join(process.cwd(), "src", "routes", "__root.tsx"), "utf8");
  const deferred = readFileSync(
    join(process.cwd(), "src", "components", "layout", "DeferredLiquidBackground.tsx"),
    "utf8",
  );
  assert.doesNotMatch(root, /import\s+\{\s*LiquidBackground\s*\}/);
  assert.match(deferred, /requestIdleCallback\(activate,\s*\{\s*timeout:\s*2500\s*\}\)/);
  assert.match(deferred, /import\("\.\/LiquidBackground"\)/);
  assert.match(deferred, /detectPerfTier\(\) === "static"\) return/);
});

test("LCP key art is preloaded with responsive candidates", () => {
  const root = readFileSync(join(process.cwd(), "src", "routes", "__root.tsx"), "utf8");
  assert.match(root, /rel: "preload",\s*as: "image"/);
  assert.match(root, /imageSrcSet: images\.happyTownBanner\.srcSet/);
  assert.match(root, /imageSizes: "\(max-width: 639px\) 84vw/);
  assert.match(root, /href: jetBrainsMonoLatinFont,[\s\S]*?fetchPriority: "low"/);
});

test("below-fold section styles are loaded on approach rather than in global CSS", () => {
  const globalStyles = readFileSync(join(process.cwd(), "src", "site.css"), "utf8");
  const deferredStyles = readFileSync(
    join(process.cwd(), "src", "components", "layout", "DeferredSectionStyles.tsx"),
    "utf8",
  );
  assert.doesNotMatch(globalStyles, /Contact|FAQ|HappyTown|Team\.css/);
  for (const section of ["equipe", "happy-town", "faq", "contato"]) {
    assert.match(deferredStyles, new RegExp(section));
  }
  assert.match(deferredStyles, /new IntersectionObserver/);
  assert.match(deferredStyles, /rootMargin: "500px"/);
});

test("reduced-motion preference loads section styles before observer setup", () => {
  const deferredStyles = readFileSync(
    join(process.cwd(), "src", "components", "layout", "DeferredSectionStyles.tsx"),
    "utf8",
  );
  const reducedMotionBranch = deferredStyles.indexOf(
    'if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {',
  );
  const eagerLoad = deferredStyles.indexOf(
    "for (const [, href] of sectionStyles) loadStylesheet(href);",
    reducedMotionBranch,
  );
  const earlyReturn = deferredStyles.indexOf("return;", eagerLoad);
  const observer = deferredStyles.indexOf("new IntersectionObserver", earlyReturn);

  assert.ok(reducedMotionBranch >= 0, "deferred styles must detect reduced motion");
  assert.ok(eagerLoad > reducedMotionBranch, "reduced motion must load every section stylesheet");
  assert.ok(earlyReturn > eagerLoad, "reduced-motion branch must return after loading styles");
  assert.ok(observer > earlyReturn, "reduced-motion branch must bypass observer setup");
});

test("silent team portrait video is decorative to assistive technology", () => {
  const team = readFileSync(join(process.cwd(), "src", "components", "site", "Team.tsx"), "utf8");
  assert.match(team, /<video[\s\S]*?muted[\s\S]*?aria-hidden="true"/);
  assert.doesNotMatch(team, /<video[\s\S]*?aria-label=/);
  assert.match(team, /new IntersectionObserver/);
  assert.match(team, /src=\{videoActive \? dev\.avatar\.src : undefined\}/);
  assert.match(team, /poster=\{videoActive \? dev\.avatar\.poster : undefined\}/);
});

test("image derivatives keep valid intrinsic dimensions", () => {
  for (const asset of [...Object.values(devAvatars), ...Object.values(images)]) {
    if (asset.type !== "image") continue;
    assert.ok(asset.width >= 512 && asset.height >= 512);
    assert.match(asset.src, /\.webp$/);
    assert.match(asset.src2x, /@2x\.webp$/);
  }
});

test("team member identifiers stay unique", () => {
  const ids = [
    "francez",
    "samuca",
    "zark",
    "thugo",
    "marpuf",
    "syntax",
    "yuki",
    "stray",
    "eater",
    "thug",
    "whirle",
    "poli",
  ];
  assert.equal(new Set(ids).size, ids.length);
});

test("the visual material system stays CSS-first", () => {
  const styles = readFileSync(join(process.cwd(), "src", "styles.css"), "utf8");
  assert.doesNotMatch(styles, /assets\/textures/);
  assert.match(styles, /liquid-bg/);
});

test("hero display type stays bounded on narrow viewports", () => {
  const styles = readFileSync(join(process.cwd(), "src", "styles.css"), "utf8");
  assert.match(styles, /\.hero-title[\s\S]*max-width: 100%/);
  assert.match(styles, /@media \(max-width: 639px\)[\s\S]*\.hero-title[\s\S]*17\.5vw/);
  assert.match(styles, /\.hero-title-stage,[\s\S]*?overflow: visible !important/);
});

test("liquid shader uses a viewport-sized native canvas without Three.js", () => {
  const source = readFileSync(
    join(process.cwd(), "src", "components", "layout", "LiquidBackground.tsx"),
    "utf8",
  );
  assert.match(source, /getContext\("webgl"/);
  assert.match(source, /gl\.drawArrays\(gl\.TRIANGLE_STRIP/);
  assert.match(source, /pixelBudget = 300_000/);
  assert.match(source, /scrollPaused \? 1000 \/ 12 : 1000 \/ 30/);
  assert.match(source, /float t = u_time \* 0\.48/);
  assert.match(source, /for \(int i = 0; i < 1; i\+\+\)/);
  assert.doesNotMatch(source, /@shadergradient\/react|@react-three\/fiber|THREE\.Clock/);

  const styles = readFileSync(join(process.cwd(), "src", "styles.css"), "utf8");
  assert.match(styles, /@keyframes fluid-fallback-drift\s*\{\s*from\s*\{\s*opacity:/);
  assert.match(
    styles,
    /@media \(pointer: coarse\), \(max-width: 639px\)[\s\S]*?animation: none !important/,
  );
});

test("motion layer keeps reduced-motion escape hatches", () => {
  const styles = readFileSync(join(process.cwd(), "src", "styles.css"), "utf8");
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /project-artwork-scan/);
  assert.match(styles, /contact-finale::after/);
  const intro = readFileSync(
    join(process.cwd(), "src", "components", "layout", "Intro.tsx"),
    "utf8",
  );
  const reducedMotionGuard = intro.indexOf(
    'if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;',
  );
  const scrollLock = intro.indexOf('document.documentElement.style.overflow = "hidden";');

  assert.ok(reducedMotionGuard >= 0, "intro must detect reduced-motion preference");
  assert.ok(
    scrollLock > reducedMotionGuard,
    "intro must check reduced motion before locking document scroll",
  );
  assert.match(intro, /const HOLD_DURATION = (?:[0-2]?\d{1,2}|300);/);
  assert.match(intro, /const EXIT_DURATION = (?:[0-2]?\d{1,2}|300);/);
});

test("removes the clipped title override and theme switch", () => {
  const styles = readFileSync(join(process.cwd(), "src", "styles.css"), "utf8");
  const hero = readFileSync(join(process.cwd(), "src", "components", "site", "Hero.tsx"), "utf8");
  const nav = readFileSync(join(process.cwd(), "src", "components", "layout", "Nav.tsx"), "utf8");
  assert.match(styles, /\.hero-title > span[\s\S]*overflow: visible !important/);
  assert.doesNotMatch(hero, /hero-teaser-crosshair|hero-teaser-index/);
  assert.doesNotMatch(nav, /ThemeToggle/);
});

test("studio contact footer stays clean and Thugo remains identified as Sub Owner", () => {
  const contact = readFileSync(
    join(process.cwd(), "src", "components", "site", "Contact.tsx"),
    "utf8",
  );
  const studio = readFileSync(join(process.cwd(), "src", "data", "studio.ts"), "utf8");
  assert.doesNotMatch(contact, /className="contact-mark"/);
  assert.match(studio, /id: "thugo",[\s\S]*?role: "Sub Owner · Server Manager"/);
});

test("keeps decorative ticker and duplicated project team metric out of the UI", () => {
  const about = readFileSync(join(process.cwd(), "src", "components", "site", "About.tsx"), "utf8");
  const project = readFileSync(
    join(process.cwd(), "src", "components", "site", "HappyTown.tsx"),
    "utf8",
  );
  assert.doesNotMatch(about, /about-marquee/);
  assert.doesNotMatch(project, /label: "Team"/);
  assert.doesNotMatch(project, /whileHover=\{\{ x: 3 \}\}/);
});

test("contact hover moves contents without translating row dividers", () => {
  const contact = readFileSync(
    join(process.cwd(), "src", "components", "site", "Contact.tsx"),
    "utf8",
  );
  const styles = readFileSync(join(process.cwd(), "src", "styles.css"), "utf8");
  assert.match(contact, /className="contact-link-content"/);
  assert.doesNotMatch(contact, /whileHover=\{\{ x: 8 \}\}/);
  assert.match(styles, /\.contact-link:hover \.contact-link-content/);
});

test("keeps the page headings clean and removes redundant section labels", () => {
  const hero = readFileSync(join(process.cwd(), "src", "components", "site", "Hero.tsx"), "utf8");
  const header = readFileSync(
    join(process.cwd(), "src", "components", "site", "SectionHeader.tsx"),
    "utf8",
  );
  const about = readFileSync(join(process.cwd(), "src", "components", "site", "About.tsx"), "utf8");
  const project = readFileSync(
    join(process.cwd(), "src", "components", "site", "HappyTown.tsx"),
    "utf8",
  );
  const contact = readFileSync(
    join(process.cwd(), "src", "components", "site", "Contact.tsx"),
    "utf8",
  );
  const footer = readFileSync(
    join(process.cwd(), "src", "components", "layout", "Footer.tsx"),
    "utf8",
  );

  assert.doesNotMatch(
    hero,
    /Independent game studio|Brazil \/ 6B|Original games · worlds · stories|Explore Happy Town/,
  );
  assert.doesNotMatch(header, /section-header-meta|section-header-number|section-header-kicker/);
  assert.doesNotMatch(about, /Independent \/ Brazil/);
  assert.doesNotMatch(project, /project-artwork-label|project-artwork-overlay|Night falls here/);
  assert.doesNotMatch(contact, /04 \/ Get in touch|SIX BULLETS \/ 6B|Six Bullets Studio \/ Brazil/);
  assert.doesNotMatch(footer, /Discord|Independent \/ Brazil|Games · Worlds · Stories/);
});

test("uses a muted colored liquid shader and preserves the GPU pixel budget", () => {
  const source = readFileSync(
    join(process.cwd(), "src", "components", "layout", "LiquidBackground.tsx"),
    "utf8",
  );
  assert.match(source, /vec3\(0\.105, 0\.042, 0\.060\)/);
  assert.match(source, /vec3\(0\.035, 0\.082, 0\.070\)/);
  assert.match(source, /const pixelBudget = 300_000/);
  assert.match(source, /prefers-reduced-motion: reduce/);
});

test("navigation links match stable rendered heading targets and section order", () => {
  const navigation = readFileSync(join(process.cwd(), "src", "data", "site.ts"), "utf8");
  const route = readFileSync(join(process.cwd(), "src", "routes", "index.tsx"), "utf8");
  const team = readFileSync(join(process.cwd(), "src", "components", "site", "Team.tsx"), "utf8");
  const project = readFileSync(
    join(process.cwd(), "src", "components", "site", "HappyTown.tsx"),
    "utf8",
  );
  const faq = readFileSync(join(process.cwd(), "src", "components", "site", "FAQ.tsx"), "utf8");
  const footer = readFileSync(
    join(process.cwd(), "src", "components", "layout", "Footer.tsx"),
    "utf8",
  );
  const contact = readFileSync(
    join(process.cwd(), "src", "components", "site", "Contact.tsx"),
    "utf8",
  );
  const nav = readFileSync(join(process.cwd(), "src", "components", "layout", "Nav.tsx"), "utf8");
  const intro = readFileSync(
    join(process.cwd(), "src", "components", "layout", "Intro.tsx"),
    "utf8",
  );
  const root = readFileSync(join(process.cwd(), "src", "routes", "__root.tsx"), "utf8");
  const styles = readFileSync(join(process.cwd(), "src", "styles.css"), "utf8");
  const motionFeatures = readFileSync(
    join(process.cwd(), "src", "lib", "motion-features.ts"),
    "utf8",
  );

  const navIds = [
    ...navigation.matchAll(/href: "#([a-z-]+)", label: "(?:Studio|Team|Project|FAQ|Contact)"/g),
  ].map((match) => match[1]);
  const renderedOrder = ["<About />", "<Team />", "<HappyTown />", "<FAQ />", "<Contact />"];
  let previous = -1;
  for (const marker of renderedOrder) {
    const next = route.indexOf(marker);
    assert.ok(next > previous, `${marker} must be rendered in navigation order`);
    previous = next;
  }

  assert.deepEqual(navIds, [
    "about-title",
    "team-title",
    "happy-town-title",
    "faq-title",
    "contato",
  ]);
  assert.match(team, /id="equipe"/);
  assert.match(project, /id="happy-town"/);
  assert.match(faq, /id="faq"/);
  assert.match(contact, /<section id="contato"/);
  assert.match(footer, /id="site-footer"/);
  assert.match(nav, /const duration = Math\.min\(1400, Math\.max\(850/);
  assert.match(nav, /cancelAnchorScroll/);
  assert.match(intro, /className="intro-curtain intro-curtain--minimal"/);
  assert.doesNotMatch(
    intro,
    /intro-loader|intro-header|intro-footer|intro-sequence|Entering the studio/,
  );
  assert.match(styles, /#about-title,[\s\S]*?scroll-margin-top: 6\.75rem/);
  assert.match(styles, /#happy-town-title[\s\S]*?scroll-margin-top: 9\.25rem/);
  assert.match(motionFeatures, /domAnimation/);
  assert.doesNotMatch(route, /SectionStage|React\.lazy|<Suspense/);
  assert.doesNotMatch(root, /<SmoothScroll\s*\/>/);
});
