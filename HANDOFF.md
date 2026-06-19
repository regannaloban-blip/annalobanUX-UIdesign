# Portfolio Handoff

## Current State

- Branch: `AnnaSite-1`
- Baseline before this draft: `da26217` (`v0.4.4 refine responsive portfolio layout`)
- Effects/WebGL/Lenis are postponed. Current work is layout only.
- Desktop layout is treated as stable and must not be changed without an explicit request.
- Mobile and tablet reference layouts exist in Figma, but intermediate responsive widths are not stable yet.

## Figma Sources

- Main responsive source: https://www.figma.com/design/61c34SjaG1Jvl9lBQE1fy4/experiment-ai?node-id=196-5065
- Tablet-mob frame: https://www.figma.com/design/61c34SjaG1Jvl9lBQE1fy4/experiment-ai?node-id=208-6419
- `block-ux designer`: https://www.figma.com/design/61c34SjaG1Jvl9lBQE1fy4/experiment-ai?node-id=208-6443
- `block-about`: https://www.figma.com/design/61c34SjaG1Jvl9lBQE1fy4/experiment-ai?node-id=208-6456

## Stable / Do Not Touch

- Do not redesign or change content, typography, section order, desktop layout, WebGL, or Lenis.
- Do not change `block-about` text wrapping by trial and error. The photo must align with the second text-line baseline and only the first two lines wrap around it.
- Preserve the contact form behavior and project content.

## Current Problem

`block-ux designer` is still inconsistent at intermediate widths. The existing component mixes responsive flex rules with legacy fixed/absolute positioning.

Required behavior:

- Tablet/tablet-mob: `UX/UI` left and mini text right in one `flex` row with `justify-between` and automatic gap.
- Tablet/tablet-mob: `/WEB` list left and `DESIGNER` right in one `flex` row with `justify-between` and automatic gap.
- Mobile: mini text moves above `UX/UI`; `UX/UI`, `PRODUCT`, and `DESIGNER` stack vertically; services remain left.
- Live text must not use `absolute`, `left`, or `top` for responsive placement.
- Decorative layers may remain absolute.

## Next Step

Work only on `block-ux designer` as an isolated responsive component:

1. Audit its current DOM/classes against the three Figma variants.
2. Define row/column switch points, fixed widths, `fill`, `hug`, and automatic gaps.
3. Replace legacy positioning inside this component only.
4. Verify at the exact mobile, tablet-mob, and tablet widths plus one intermediate width.
5. Run `npm run build` and confirm zero horizontal overflow.

Do not audit or edit the whole page in the same turn.

## Working Tree Note

These unrelated untracked files were intentionally excluded from the layout WIP commit:

- `.agents/`
- `skills-lock.json`
- `assets/ai-portfolio/image 16.png`
