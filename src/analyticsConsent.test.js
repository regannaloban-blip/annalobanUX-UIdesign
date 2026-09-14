import test from "node:test";
import assert from "node:assert/strict";

import { shouldLoadAnalytics } from "./analyticsConsent.js";

test("loads analytics only after an explicit accept choice", () => {
  assert.equal(shouldLoadAnalytics("granted"), true);
  assert.equal(shouldLoadAnalytics("denied"), false);
  assert.equal(shouldLoadAnalytics(null), false);
});
