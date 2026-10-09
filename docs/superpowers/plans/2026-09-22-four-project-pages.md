# Four Project Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add four fact-bounded, responsive portfolio case pages without altering the existing home page or menu.

**Architecture:** A project registry owns the four supported routes and their page data. A single `CasePage` reads a registry entry, while a pathname resolver keeps home, privacy, project, and unknown-path rendering explicit. SEO reads the same registry so routes cannot diverge from metadata or sitemap entries.

**Tech Stack:** React 18, Vite 6, Tailwind utility classes, plain CSS, Node test runner.

**Spec:** `docs/superpowers/specs/2026-09-22-four-project-pages-design.md`

## Global Constraints

- Preserve `/` and `/privacy` exactly; do not modify the home page or menu.
- Implement exactly four `/work/*` case routes; do not add service pages.
- Use visible or otherwise confirmed project facts only. Do not claim role, research, metrics, conversion, or client outcomes.
- Use the 24 colab Figma desktop (1586 px), tablet (873 px), and mobile (440 px) frame as the shared layout source.
- Reuse current social links and contact form; do not duplicate or change form submission behavior.
- Do not publish, deploy, or modify production.

## Review Focus

- A trailing slash must resolve to the same registered case as its canonical path.
- An unknown path must never render the home page.
- Each registry record must have all metadata needed by the case layout and SEO.
- Each related project route must resolve to a registry record.
- `/privacy` must stay `noindex`, while registered case routes are `index, follow`.

---

## File Structure

- Create: `src/content/projects.js` — project records and pure pathname helpers.
- Create: `src/content/projects.test.js` — registry and resolver tests.
- Create: `src/pages/CasePage.jsx` — shared responsive case template.
- Create: `src/pages/CasePage.css` — Figma-driven responsive layout rules.
- Create: `src/pages/NotFoundPage.jsx` — explicit unknown-route page.
- Modify: `src/App.jsx` — choose home, privacy, case, or not-found page without changing home-page composition.
- Modify: `src/seo.jsx` — look up case metadata from the registry.
- Create: `src/seo.test.js` — SEO route assertions.
- Create: `scripts/generate-sitemap.mjs` — write a sitemap from registered project routes.
- Modify: `public/sitemap.xml` — generated public route list.

### Task 1: Project registry and route resolver

**Files:**
- Create: `src/content/projects.js`
- Create: `src/content/projects.test.js`

**Interfaces:**
- Produces: `projects`, `getProjectByPath(pathname)`, `getRouteKind(pathname)`, `isProjectPath(pathname)`, and `normalizePath(pathname)`.
- Consumes: no application modules.

- [ ] **Step 1: Write the failing registry tests**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { projects, getProjectByPath } from "./projects.js";

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
```

- [ ] **Step 2: Run the registry test to verify it fails**

Run: `node --test src/content/projects.test.js`

Expected: FAIL because `src/content/projects.js` does not exist.

- [ ] **Step 3: Implement the registry and resolver**

```js
export function normalizePath(pathname = "/") {
  return pathname === "/" ? "/" : pathname.replace(/\/+$/, "") || "/";
}

export const projects = [/* four fact-bounded project records */];

export function getProjectByPath(pathname) {
  const path = normalizePath(pathname);
  return projects.find((project) => project.path === path) ?? null;
}

export function isProjectPath(pathname) {
  return getProjectByPath(pathname) !== null;
}

export function getRouteKind(pathname) {
  const path = normalizePath(pathname);
  if (path === "/") return "home";
  if (path === "/privacy") return "privacy";
  return isProjectPath(path) ? "project" : "not-found";
}
```

Use existing `Case/Compressed` images and live URLs currently declared in `src/App.jsx`. The 24 colab record uses `Project type: B2B service website` and `Website goal: Present services clearly`.

- [ ] **Step 4: Run the registry tests to verify they pass**

Run: `node --test src/content/projects.test.js`

Expected: PASS.

- [ ] **Step 5: Commit the registry**

```bash
git add src/content/projects.js src/content/projects.test.js
git commit -m "feat: add project page registry"
```

### Task 2: Shared responsive case-page layout

**Files:**
- Create: `src/pages/CasePage.jsx`
- Create: `src/pages/CasePage.css`

**Interfaces:**
- Consumes: one `project` object from `projects`, `TopLinks`, `HoverText`, and the existing `Footer` export extracted from `src/App.jsx` or a focused shared footer component.
- Produces: `CasePage({ project })`.

- [ ] **Step 1: Add a failing render-contract test**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { getProjectByPath } from "../content/projects.js";

test("a case project exposes the four hero metadata rows", () => {
  const project = getProjectByPath("/work/24colab-content-services-website");
  assert.deepEqual(Object.keys(project.meta), ["Project type", "Industry", "Scope of work", "Website goal"]);
});
```

Add this test to `src/content/projects.test.js`.

- [ ] **Step 2: Run the contract test to verify it fails**

Run: `node --test src/content/projects.test.js`

Expected: FAIL because `meta` is not yet present in the registry.

- [ ] **Step 3: Add the hero metadata and build `CasePage`**

```jsx
export function CasePage({ project }) {
  return (
    <main className="case-page" aria-label={`${project.name} project case study`}>
      <CaseTopBar />
      <CaseHero project={project} />
      <CaseOverview project={project} />
      <CaseFeatures project={project} />
      <CaseRelatedProject project={project} />
      <Footer />
    </main>
  );
}
```

Implement CSS mobile-first at 440 px; add tablet rules beginning at 768 px and desktop rules beginning at 1024 px. Match the supplied Figma hierarchy: black hero, white content area, metadata dividers, project-image composition, feature grid, two next-project cards, and black contact area. Use real project image files; do not create replacement icons or placeholder images.

- [ ] **Step 4: Run the contract test and build**

Run: `node --test src/content/projects.test.js && npm run build`

Expected: PASS and a successful Vite build.

- [ ] **Step 5: Commit the page template**

```bash
git add src/content/projects.js src/content/projects.test.js src/pages/CasePage.jsx src/pages/CasePage.css
git commit -m "feat: add responsive case page template"
```

### Task 3: Explicit application routing

**Files:**
- Create: `src/pages/NotFoundPage.jsx`
- Modify: `src/App.jsx`
- Test: `src/content/projects.test.js`

**Interfaces:**
- Consumes: `getProjectByPath(pathname)`, `getRouteKind(pathname)`, and `CasePage({ project })`.
- Produces: unchanged home and privacy rendering plus case and not-found branches.

- [ ] **Step 1: Confirm the failing classification test from Task 1**

Run: `node --test src/content/projects.test.js`

Expected before Task 1 implementation: FAIL because `getRouteKind` is not exported. Expected after Task 1: PASS.

- [ ] **Step 2: Implement explicit branches**

```jsx
const routeKind = getRouteKind(pathname);
const project = getProjectByPath(pathname);

if (routeKind === "privacy") return <PrivacyPolicy />;
if (routeKind === "project") return <CasePage project={project} />;
if (routeKind === "not-found") return <NotFoundPage />;
return homePage;
```

Keep the existing home `page` memo unchanged. Keep current analytics and privacy behavior intact.

- [ ] **Step 3: Run the route test and build**

Run: `node --test src/content/projects.test.js && npm run build`

Expected: PASS and a successful Vite build.

- [ ] **Step 4: Commit routing**

```bash
git add src/App.jsx src/pages/NotFoundPage.jsx src/content/projects.test.js
git commit -m "feat: route project case pages"
```

### Task 4: Registry-backed SEO and sitemap

**Files:**
- Modify: `src/seo.jsx`
- Create: `src/seo.test.js`
- Create: `scripts/generate-sitemap.mjs`
- Modify: `public/sitemap.xml`

**Interfaces:**
- Consumes: `projects`, `getProjectByPath(pathname)`, and existing `SeoManager`.
- Produces: unique project metadata and sitemap URL entries.

- [ ] **Step 1: Write failing SEO tests**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { getSeoForPath } from "./seo.js";

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
```

- [ ] **Step 2: Run SEO tests to verify they fail**

Run: `node --test src/seo.test.js`

Expected: FAIL because registered project metadata is not included in `getSeoForPath`.

- [ ] **Step 3: Implement registry-backed SEO and sitemap generator**

```js
export function getSeoForPath(pathname) {
  const project = getProjectByPath(pathname);
  if (project) return project.seo;
  return seoRoutes[normalizePath(pathname)] ?? seoRoutes["/"];
}
```

The sitemap script imports `projects`, joins their paths with `siteUrl`, and writes valid XML containing `/` plus all four project routes. Keep `/privacy` out of the sitemap.

- [ ] **Step 4: Verify SEO and sitemap**

Run: `node --test src/seo.test.js && node scripts/generate-sitemap.mjs && npm run build`

Expected: PASS, an updated `public/sitemap.xml`, and a successful Vite build.

- [ ] **Step 5: Commit SEO infrastructure**

```bash
git add src/seo.jsx src/seo.test.js scripts/generate-sitemap.mjs public/sitemap.xml src/content/projects.js
git commit -m "feat: add project page seo"
```

### Task 5: Final responsive verification

**Files:**
- Modify only files required by visual corrections discovered during local review.

**Interfaces:**
- Consumes: all previous tasks.
- Produces: a buildable, fact-bounded branch without home or menu edits.

- [ ] **Step 1: Run the complete automated checks**

Run: `node --test src/analyticsConsent.test.js src/content/projects.test.js src/seo.test.js && node scripts/generate-sitemap.mjs && npm run build && git diff --check`

Expected: all Node tests pass, Vite build succeeds, and the diff has no whitespace errors.

- [ ] **Step 2: Review each case locally at the Figma widths**

Run: `npm run dev -- --host 127.0.0.1`

Open each route at widths 1586 px, 873 px, and 440 px. Confirm a single H1, readable metadata rows, non-overlapping image composition, reachable live link, related-project link, and current contact form.

- [ ] **Step 3: Commit any verification corrections**

```bash
git add src/content/projects.js src/pages/CasePage.jsx src/pages/CasePage.css src/App.jsx src/seo.jsx public/sitemap.xml
git commit -m "fix: refine project page responsiveness"
```

- [ ] **Step 4: Report the branch state without publishing**

Report changed files, test/build results, and the branch commit range. Do not push, merge, or deploy.
