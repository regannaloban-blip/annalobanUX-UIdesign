import test from "node:test";
import assert from "node:assert/strict";

import { getProjectByPath, getRouteKind, projects } from "./projects.js";

test("registers four unique project routes with required page data", () => {
  assert.equal(projects.length, 4);
  assert.equal(new Set(projects.map((project) => project.path)).size, 4);

  projects.forEach((project) => {
    for (const key of ["path", "name", "industry", "scope", "websiteGoal", "title", "description", "image", "liveUrl", "relatedPath"]) {
      assert.ok(project[key], `${project.name} is missing ${key}`);
    }
  });
});

test("resolves a registered path with or without a trailing slash", () => {
  assert.equal(getProjectByPath("/work/24colab-content-services-website")?.name, "24 colab");
  assert.equal(getProjectByPath("/work/24colab-content-services-website/")?.name, "24 colab");
});

test("does not resolve an unknown path", () => {
  assert.equal(getProjectByPath("/work/not-a-project"), null);
});

test("classifies home, privacy, project, and unknown paths explicitly", () => {
  assert.equal(getRouteKind("/"), "home");
  assert.equal(getRouteKind("/privacy"), "privacy");
  assert.equal(getRouteKind("/work/skyliner-commercial-property-website"), "project");
  assert.equal(getRouteKind("/missing"), "not-found");
});

test("a case project exposes the four hero metadata rows", () => {
  const project = getProjectByPath("/work/24colab-content-services-website");
  assert.deepEqual(Object.keys(project.meta), ["Project type", "Industry", "Scope of work", "Website goal"]);
});
