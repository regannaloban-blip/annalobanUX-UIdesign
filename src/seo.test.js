import test from "node:test";
import assert from "node:assert/strict";

import { getSeoForPath } from "./seoRoutes.js";

test("registered case routes have unique indexable metadata", () => {
  const first = getSeoForPath("/work/24colab-content-services-website");
  const second = getSeoForPath("/work/smart-business-intelligence-website");
  assert.equal(first.robots, "index, follow");
  assert.notEqual(first.title, second.title);
  assert.equal(first.path, "/work/24colab-content-services-website");
});

test("privacy remains noindex", () => {
  assert.equal(getSeoForPath("/privacy").robots, "noindex, follow");
});
