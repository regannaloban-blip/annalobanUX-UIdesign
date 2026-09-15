# SEO Case Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to execute this plan task-by-task.

**Goal:** Turn the portfolio into a client-acquisition site with crawlable service and case pages that demonstrate UX/UI expertise and lead to the existing project-contact form.

**Architecture:** Keep the existing Vite/React app and add a single public-page registry. The registry supplies page body content, route metadata, JSON-LD, sitemap paths, related links, and the mapping from home-page cards to cases. Retain the current home page, consent flow, privacy page, and contact form.

**Tech Stack:** React, Vite, current pathname-based rendering, `src/seo.jsx`, static Vercel deployment.

## Global constraints

- Draft and approve every public text in Russian before translating it into English.
- Use only confirmed product/interface facts and approved statements of Anna Loban's role.
- Do not invent a client brief, research, metrics, conversion result, or business outcome.
- Explain design intent as: “We did X so that a visitor can Y.” Never present an expected effect as a measured result.
- No hidden keywords, generic text blocks, copied client-site descriptions, or keyword stuffing.
- Do not include the unfinished hairdresser website.
- Do not publish without explicit user approval.

## Evidence status

Confirmed: names, live URLs, portfolio cards, and a compressed project image for 24Colab, Smart Business Intelligence, Skyliner, and Your Dissertation.

Not available: original briefs, confirmed role statements, Figma files, research artefacts, original flows, before/after data, analytics, and commercial outcomes.

The legacy `ai-portfolio.html` has conflicting project labels. It is not evidence for a case claim.

## Approved content model

Each case page contains:

1. Project identity, approved image, category, and live-site link.
2. Product context based on visible facts.
3. UX/UI challenge reconstructed from the product; never described as the original client brief.
4. Three or four distinct design decisions. Each uses the pattern “We did X so that Y.”
5. A screenshot and caption that prove each decision.
6. A concise takeaway for a similar business, without a performance promise.
7. Links to a related service, another relevant case, and the current contact form.

## Content differentiation and search intent

| Project | UX focus | Natural search intent |
| --- | --- | --- |
| 24Colab | Selecting a content-support model | B2B content services website design; content platform UX |
| Smart Business Intelligence | Explaining complex consultancy services progressively | business intelligence website design; data consultancy UX |
| Skyliner | Navigating a large physical space and tenant directory | commercial property website design; tenant directory UX |
| Your Dissertation | Reducing uncertainty before a service order | service website UX; pricing calculator and order flow design |

## Public routes proposed for implementation

| Route | Type |
| --- | --- |
| `/work/24colab-content-services-website` | Case |
| `/work/smart-business-intelligence-website` | Case |
| `/work/skyliner-commercial-property-website` | Case |
| `/work/your-dissertation-order-flow` | Case |
| `/services/website-design` | Service |
| `/services/landing-page-design` | Service |
| `/services/ux-ui-design` | Service |
| `/services/website-audit` | Service |

## File plan

| File | Change |
| --- | --- |
| `src/content/publicPages.js` | Create: approved case/service page registry and route helpers |
| `src/content/publicPages.test.js` | Create: route uniqueness, required content, and related-link integrity tests |
| `src/pages/CasePage.jsx` | Create: case layout using current design primitives |
| `src/pages/ServicePage.jsx` | Create: service layout using current design primitives |
| `src/pages/NotFoundPage.jsx` | Create: explicit page for unknown routes |
| `src/App.jsx` | Modify: route public pages while preserving `/` and `/privacy` |
| `src/seo.jsx` | Modify: registry-backed metadata, canonical URLs, breadcrumbs, and page schema |
| `scripts/generate-sitemap.mjs` | Create: generate sitemap from public approved paths |
| `public/sitemap.xml` | Modify: generated indexable routes only |

## Tasks

### Task 1: Approve Russian content

- [ ] Produce Russian drafts for all four case pages and four service pages.
- [ ] Mark every source statement as confirmed or reconstructed from the visible interface.
- [ ] Receive explicit approval of wording, claims, headings, page titles, paths, and screenshots.
- [ ] Translate only approved Russian copy into English.

### Task 2: Add a public-page registry with tests

- [ ] Write a failing test that asserts every public route is unique and has `path`, `title`, `description`, `h1`, `kind`, and `relatedPaths`.
- [ ] Create `src/content/publicPages.js` with approved content only.
- [ ] Add a test that asserts every `relatedPaths` value resolves to a public page.
- [ ] Run `node --test src/content/publicPages.test.js`.
- [ ] Commit only the registry and its test.

### Task 3: Render pages and preserve route safety

- [ ] Write a failing test for unknown-path resolution.
- [ ] Create `CasePage`, `ServicePage`, and `NotFoundPage`.
- [ ] Update `src/App.jsx` so `/` and `/privacy` remain unchanged, approved pages render by pathname, and unknown paths render `NotFoundPage` instead of the home page.
- [ ] Run the registry test and `npm run build`.
- [ ] Commit page rendering changes.

### Task 4: Add indexation infrastructure

- [ ] Write a failing SEO test for a case route’s unique `title`, `description`, `canonical`, and `index, follow` setting.
- [ ] Update `src/seo.jsx` to use the registry for all public routes and retain `noindex` for `/privacy`.
- [ ] Generate `public/sitemap.xml` from the registry plus `/`.
- [ ] Add route-specific `WebPage` and `BreadcrumbList` JSON-LD.
- [ ] Run SEO tests, sitemap generation, and `npm run build`.
- [ ] Commit SEO changes.

### Task 5: Add crawlable conversion paths

- [ ] Keep each existing live-project link.
- [ ] Add a visible internal link from every home-page work card to its case page.
- [ ] Add related-case and related-service links to every page.
- [ ] Link every case/service CTA to the existing contact form without changing that form.
- [ ] Run link-integrity tests and `npm run build`.
- [ ] Commit internal-link changes.

### Task 6: Verify and publish only after approval

- [ ] Run `node --test src/analyticsConsent.test.js src/content/publicPages.test.js`.
- [ ] Run the SEO test, sitemap generator, `npm run build`, and `git diff --check`.
- [ ] Preview at `http://127.0.0.1:5173/`; do not open Vite source through `file:///`.
- [ ] Verify every public page has one H1, approved text, unique metadata, proof captions, a live-project link where relevant, internal links, and a contact CTA.
- [ ] Request explicit user approval before pushing/deploying.
- [ ] After deployment, confirm production URLs, sitemap, Search Console submission, and GA4 separately.

## Branch and task handoff

Create a dedicated worktree/branch for this work. Suggested branch name: `codex/seo-case-pages`. Do not modify `AnnaSite-1` until the user approves merging or publishing the completed work.

Start execution at Task 1. No English copy or public-page implementation may begin before Russian text is approved.
