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
  assert.equal(response.headers.get("x-permitted-cross-domain-policies"), "none");
  assert.equal(response.headers.get("origin-agent-cluster"), "?1");
  assert.match(response.headers.get("strict-transport-security") ?? "", /^max-age=31536000/);
  assert.match(response.headers.get("content-security-policy") ?? "", /upgrade-insecure-requests/);
});

test("marks versioned runtime assets as immutable", () => {
  const response = withSecurityHeaders(
    new Response("asset"),
    "https://sixbullets.example/assets/team/francez.webp",
  );
  assert.equal(
    response.headers.get("cache-control"),
    "public, max-age=31536000, immutable",
  );
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
  assert.doesNotMatch(response.headers.get("content-security-policy") ?? "", /upgrade-insecure-requests/);
});
