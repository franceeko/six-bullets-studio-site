import assert from "node:assert/strict";
import { existsSync } from "node:fs";
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
    if (asset.type === "image") {
      assertPublicAsset(asset.src2x);
      assertPublicAsset(asset.fallbackSrc);
    }
    if (asset.type === "video") assertPublicAsset(asset.poster);
  }
});

test("image derivatives keep valid intrinsic dimensions", () => {
  for (const asset of [...Object.values(devAvatars), ...Object.values(images)]) {
    if (asset.type !== "image") continue;
    assert.ok(asset.width >= 512 && asset.height >= 512);
    assert.match(asset.src, /\.webp$/);
    assert.match(asset.src2x, /@2x\.webp$/);
    assert.match(asset.fallbackSrc, /\.png$/);
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
