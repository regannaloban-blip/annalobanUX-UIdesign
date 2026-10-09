# Unified Project Case Template Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render every project route from one case-page component, with project data supplying only copy and visual assets.

**Architecture:** Replace the 24 Colab, Smart Business Intelligence, and generic case-page branches with one `CaseTemplate`. The template owns header, hero, metadata, visual section, challenge, screen mosaic, solution, feature grid, next-project carousel, footer/contact, and all responsive rules. `projects.js` supplies text and references to project-local assets only.

**Tech Stack:** React 18, Vite, CSS.

**Spec:** User-approved 24 Colab case page is the fixed template: only text and images inside its sections vary by project; header, contact form, section order, typography, and breakpoints are shared.

## Global Constraints

- Keep all four routes and their existing live URLs.
- Do not create per-project JSX or CSS branches for layout, header, footer/contact, or breakpoints.
- Keep the approved 24 Colab section order for every project.
- Use local Figma-exported assets only.

## Review Focus

- A project with no logo asset must retain the same visual-section geometry without creating a layout variant.
- All four projects must render the same header, mobile menu, footer/contact, and next-project carousel.
- Feature cards must reserve the same icon, heading, and copy positions at every breakpoint.
- Resizing across 1020px, 645px, and 600px must apply shared rules rather than project-specific rules.
- All project asset imports must resolve locally and production build must succeed.

### Task 1: Normalize case data

**Files:**
- Modify: `src/content/projects.js`
- Modify: `src/content/projects.test.js`

**Interfaces:**
- Produces: a `caseAssets` object on every project with `visual`, `screens`, and four feature-icon references; `features` is always an array of `{ title, description }`.

- [ ] Add a failing data test that requires identical case-data keys and four feature records for all projects.
- [ ] Replace ad-hoc strings and per-component asset constants with the common `caseAssets` shape.
- [ ] Run `node --test src/content/projects.test.js` and confirm it passes.

### Task 2: Build one `CaseTemplate`

**Files:**
- Modify: `src/pages/CasePage.jsx`

**Interfaces:**
- Consumes: a project with normalized case data.
- Produces: `CasePage({ project, footer })` rendered through a single JSX tree.

- [ ] Fold `ColabCasePage`, `SmartBusinessCasePage`, and generic JSX into one `CaseTemplate`.
- [ ] Keep `CaseTemplateHeader`, the shared contact footer, and `NextProjectCard` as the sole implementations.
- [ ] Render visual, mosaic, and feature icons only from `project.caseAssets`; do not test `project.path` for layout decisions.
- [ ] Run `npm run build` and confirm it passes.

### Task 3: Consolidate responsive CSS

**Files:**
- Modify: `src/pages/CasePage.css`

**Interfaces:**
- Consumes: fixed template class names from `CaseTemplate`.
- Produces: one desktop/tablet/mobile rule set for all projects.

- [ ] Remove `.smart-business-case`, `.skyliner-case`, `.case-*`, and project-name-specific layout branches.
- [ ] Preserve the 24 Colab sizing and breakpoints as the single template rule set.
- [ ] Verify desktop, tablet, and mobile screenshots for each route; check header, feature cards, mosaic bounds, next-project cards, and footer/contact placement.
- [ ] Run `npm run build && git diff --check` and confirm both pass.
