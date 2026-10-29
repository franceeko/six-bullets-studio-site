import assert from "node:assert/strict";
import test from "node:test";

import { withSecurityHeaders } from "../src/lib/security-headers.ts";

test("applies browser hardening headers", () => {
  const response = withSecurityHeaders(new Response("ok"), "https://sixbullets.example/");

  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("x-frame-options"), "DENY");
  assert.equal(response.headers.get("referrer-policy"), "strict-origin-when-cross-origin");
  const csp = response.headers.get("content-security-policy") ?? "";
  assert.match(csp, /frame-ancestors 'none'/);
  assert.match(csp, /script-src 'self'/);
  assert.doesNotMatch(csp, /script-src[^;]*unsafe-inline/);
  assert.match(csp, /style-src 'self'/);
  assert.match(csp, /style-src-attr 'unsafe-inline'/);
  assert.match(csp, /font-src 'self' data:/);
  assert.match(csp, /script-src 'self' 'nonce-[^']+'/);
  assert.equal(response.headers.get("x-permitted-cross-domain-policies"), "none");
  assert.equal(response.headers.get("origin-agent-cluster"), "?1");
  assert.match(response.headers.get("strict-transport-security") ?? "", /^max-age=31536000/);
  assert.match(response.headers.get("content-security-policy") ?? "", /upgrade-insecure-requests/);
});

test("allows Vite-injected styles only on loopback development origins", () => {
  const response = withSecurityHeaders(new Response("ok"), "http://localhost:3000/");
  const csp = response.headers.get("content-security-policy") ?? "";

  assert.match(csp, /style-src 'self' 'unsafe-inline'/);
  assert.match(csp, /connect-src 'self' ws: wss:/);
  assert.doesNotMatch(csp, /script-src[^;]*unsafe-inline/);

  const loopbackIp = withSecurityHeaders(new Response("ok"), "http://127.0.0.1:4173/");
  assert.match(
    loopbackIp.headers.get("content-security-policy") ?? "",
    /style-src 'self' 'unsafe-inline'/,
  );

  const production = withSecurityHeaders(new Response("ok"), "https://sixbullets.example/");
  assert.match(production.headers.get("content-security-policy") ?? "", /style-src 'self';/);
  assert.doesNotMatch(
    production.headers.get("content-security-policy") ?? "",
    /style-src 'self' 'unsafe-inline'/,
  );
});

test("uses a revalidation cache for stable team asset URLs", () => {
  const response = withSecurityHeaders(
    new Response("asset"),
    "https://sixbullets.example/assets/team/francez.webp",
  );
  assert.equal(
    response.headers.get("cache-control"),
    "public, max-age=86400, stale-while-revalidate=604800",
  );
});

test("marks fingerprinted build assets as immutable", () => {
  const response = withSecurityHeaders(
    new Response("asset"),
    "https://sixbullets.example/assets/app-a1b2c3d4.js",
  );
  assert.equal(response.headers.get("cache-control"), "public, max-age=31536000, immutable");
});

test("streams HTML and adds CSP nonces to script tags on runtimes without HTMLRewriter", async () => {
  const chunks = [
    "<!doctype html><html><body><scr",
    'ipt src="/theme-init.js"></scr',
    'ipt><script>window.note = "<script fake>";</script></body></html>',
  ];
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const chunk of chunks) controller.enqueue(new TextEncoder().encode(chunk));
      controller.close();
    },
  });
  const response = withSecurityHeaders(
    new Response(body, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "content-length": "999",
        etag: "obsolete",
      },
    }),
    "https://sixbullets.example/",
  );
  const html = await response.text();
  const nonce = (response.headers.get("content-security-policy") ?? "").match(/nonce-([^']+)/)?.[1];

  assert.ok(nonce, "CSP nonce should exist");
  assert.equal(html.split(`nonce="${nonce}"`).length - 1, 2);
  assert.match(html, /<script src="\/theme-init\.js" nonce=/);
  assert.match(html, /window\.note = "<script fake>"/);
  assert.equal(response.headers.get("content-length"), null);
  assert.equal(response.headers.get("etag"), null);
});

test("forces server errors to stay out of browser caches", () => {
  const response = withSecurityHeaders(
    new Response("error", { status: 500 }),
    "https://sixbullets.example/",
  );
  assert.equal(response.headers.get("cache-control"), "no-store");
});

test("does not send HSTS on local HTTP development", () => {
  const response = withSecurityHeaders(new Response("ok"), "http://localhost:4173/");
  assert.equal(response.headers.get("strict-transport-security"), null);
  assert.doesNotMatch(
    response.headers.get("content-security-policy") ?? "",
    /upgrade-insecure-requests/,
  );
});
