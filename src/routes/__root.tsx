import {
  Outlet,
  Link,
  createRootRoute,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { LazyMotion, MotionConfig } from "framer-motion";
import { type ReactNode } from "react";
import interTightLatinFont from "@fontsource-variable/inter-tight/files/inter-tight-latin-wght-normal.woff2?url";
import jetBrainsMonoLatinFont from "@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2?url";

import { images } from "@/assets";
import appCss from "@/site.css?url";
import { Intro } from "@/components/layout/Intro";
import { DeferredSectionStyles } from "@/components/layout/DeferredSectionStyles";

import { DeferredLiquidBackground } from "@/components/layout/DeferredLiquidBackground";
import { siteConfig } from "@/data/site";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error: _error, reset }: { error: unknown; reset: () => void }) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: siteConfig.name },
      { name: "description", content: siteConfig.description },
      { name: "author", content: siteConfig.name },
      { name: "robots", content: "index, follow" },
      { name: "theme-color", content: "#080808" },
      { property: "og:title", content: siteConfig.name },
      { property: "og:description", content: siteConfig.projectDescription },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/assets/team/happy-town-banner.webp" },
      { property: "og:image:alt", content: "Happy Town key art" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: siteConfig.name },
      { name: "twitter:description", content: siteConfig.projectDescription },
      { name: "twitter:image", content: "/assets/team/happy-town-banner.webp" },
    ],
    links: [
      {
        rel: "preload",
        href: interTightLatinFont,
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        href: "/assets/fraunces-latin-wght-normal-ukD16Tqj.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        href: jetBrainsMonoLatinFont,
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
        fetchPriority: "low",
      },
      {
        rel: "preload",
        as: "image",
        href: images.happyTownBanner.src,
        imageSrcSet: images.happyTownBanner.srcSet,
        imageSizes: "(max-width: 639px) 84vw, (max-width: 1023px) 38vw, 34vw",
        fetchPriority: "high",
      },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang={siteConfig.locale} suppressHydrationWarning>
      <head>
        <script src="/theme-init.js" defer></script>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function loadMotionFeatures() {
  return import("@/lib/motion-features").then(function (module) {
    return module.default;
  });
}

function RootComponent() {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={loadMotionFeatures} strict>
        <Intro />
        <DeferredLiquidBackground />
        <DeferredSectionStyles />
        <Outlet />
      </LazyMotion>
    </MotionConfig>
  );
}
