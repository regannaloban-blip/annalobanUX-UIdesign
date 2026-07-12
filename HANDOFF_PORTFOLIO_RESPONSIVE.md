# Portfolio Responsive Handoff

Date: 2026-07-13
Branch: AnnaSite-1
Base before commit: 13fea49
Local site: http://127.0.0.1:5173/

## Hard Rules

- User wants strict scoped edits.
- Do not deploy.
- Do not touch mobile/form/other sections unless explicitly requested.
- Do not add/remove/commit untracked user videos or documents.
- Before every edit, state the exact target.

## Current Scope

Only the first two responsive sections were changed:

- responsive hero / first screen
- responsive UX/Product/Designer block

Main files:

- `src/App.jsx`
- `src/index.css`

## Current Breakpoints For First Two Sections

- mobile preset: `0-874px`
- tablet preset: `875-1439px`
- desktop preset: `1440px+`

This was chosen because the user explicitly asked that `601-874` behave as mobile if it was switched to mobile. Earlier Figma frame widths were mobile `440px`, tablet `873px`, desktop `1440px+`.

## Figma Sources Used

- tablet hero node: `418:1304`
- mobile hero node: `418:1482`
- tablet full frame: `418:1290`
- mobile full frame: `418:1468`

Important Figma measurements:

- Hero CTA height: `173px`
- Gap from CTA bottom to hero title top: `80px`
- Tablet hero CTA block y inside hero block: `112px`
- Mobile hero CTA block y inside hero block: originally `80px`, but user later asked CTA/STA block not to move between mobile/tablet; current code fixes it at `112px`.
- Hero block to UX block gap in Figma: `80px`, composed as hero bottom `40px` + UX top `40px`.

## Current Implemented Decisions

- CTA/STA block is fixed at `top: 112px` in `ResponsiveIntro`.
- `ResponsiveIntro` no longer has mobile `mt-[59px]`, because that caused CTA position jumps between mobile and tablet.
- `.responsive-hero-block` has `padding-top: 365px` in mobile/tablet responsive ranges so CTA bottom to title top stays `80px`.
- `.responsive-hero-block` has `padding-bottom: 40px`.
- `.ux-block` keeps `padding-block: 40px`, making hero-to-UX gap match Figma total `80px`.
- JSX breakpoint typography was removed from `Hello`, `Anna`, `Product`, and `Designer`; responsive title sizes are now controlled by CSS presets.
- `600-874px` uses mobile title sizes:
  - `Hello/Product`: `84px / 85px`
  - `Anna/UX/UI/Designer`: `78px / 84px`
  - `Anna` line-height override: `75px`
- `875-1439px` uses tablet title sizes:
  - `Hello/Product`: `132px / 122px`
  - `Anna/UX/UI/Designer`: `126px / 136px`
  - letter spacing: `-5.04px`
- Desktop starts at `1440px`.

## Known User Concern

The user is checking visually and is very sensitive to:

- CTA/STA block jumping between viewport widths
- inconsistent typography between first and second sections
- mixed mobile layout with tablet typography
- insufficient gap between `IAM ANNA` and `UX/UI`
- Product/Designer being too large or clipped on mobile-like widths

If continuing, verify first at:

- `440px`
- `599px`
- `600px`
- `865px`
- `874px`
- `875px`
- `1439px`
- `1440px`

## Verification Done

- `npm run build` passes.
- `git diff --check` passes.

## Untracked Files Not To Touch

- `Case/AdobeStock_1889890236.mp4`
- `Case/AdobeStock_429054677.mp4`
- `Case/Compressed/contact-liquid-palette.mp4`
- `Case/Compressed/contact-liquid.mp4`
- `Case/Compressed/contact-smoke-base.mp4`
- `Case/Compressed/contact-smoke-red-crf27.mp4`
- `Case/Compressed/Запись экрана — 2026-07-08 в 00.01.06.mov`
- `HANDOFF_CONTACT_LIQUID.md`
- `docs/superpowers/plans/2026-07-09-final-production-readiness.md`

