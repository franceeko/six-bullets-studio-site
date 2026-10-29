import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { detectPerfTier, downgrade, PERF_SETTINGS } from "../src/lib/perf-profile.ts";

test("downgrades one tier at a time", () => {
  assert.equal(downgrade("ultra"), "high");
  assert.equal(downgrade("balanced"), "eco");
});

test("never upgrades a tier below the configured floor", () => {
  assert.equal(downgrade("minimal", "eco"), "minimal");
  assert.equal(downgrade("static", "eco"), "static");
});

test("keeps the current tier at its floor", () => {
  assert.equal(downgrade("eco", "eco"), "eco");
});

test("uses a safe server default when browser globals are unavailable", () => {
  assert.equal(detectPerfTier(), "balanced");
});

test("keeps pixel budgets finite and ordered from static to ultra", () => {
  assert.equal(PERF_SETTINGS.static.maxPixels, 0);
  for (const tier of ["minimal", "eco", "balanced", "high", "ultra"] as const) {
    assert.ok(Number.isFinite(PERF_SETTINGS[tier].maxPixels));
    assert.ok(PERF_SETTINGS[tier].maxPixels > 0);
  }
  assert.ok(PERF_SETTINGS.minimal.maxPixels < PERF_SETTINGS.eco.maxPixels);
  assert.ok(PERF_SETTINGS.eco.maxPixels < PERF_SETTINGS.balanced.maxPixels);
  assert.ok(PERF_SETTINGS.balanced.maxPixels < PERF_SETTINGS.high.maxPixels);
  assert.ok(PERF_SETTINGS.high.maxPixels < PERF_SETTINGS.ultra.maxPixels);
});

test("avoids deprecated WebGL renderer probing and forced context loss", () => {
  const source = readFileSync(new URL("../src/lib/perf-profile.ts", import.meta.url), "utf8");
  assert.doesNotMatch(source, /WEBGL_debug_renderer_info/);
  assert.doesNotMatch(source, /loseContext/);
});

test("strips Firefox-only text-size-adjust warnings from generated CSS", () => {
  const source = readFileSync(new URL("../vite.config.ts", import.meta.url), "utf8");
  assert.match(source, /strip-firefox-css-warnings/);
  assert.match(source, /text-size-adjust/);
});
