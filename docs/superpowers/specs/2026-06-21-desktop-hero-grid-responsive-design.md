# Responsive Desktop Hero Grid

## Scope

Change only the desktop first-screen hero grid and the three text groups anchored by plus icons:

- `Personal page`
- `Poland, Poznan`
- hero CTA text and button

Tablet/mobile hero behavior and every section below the first viewport remain unchanged.

## Grid rail

Use one shared CSS grid rail for all four vertical guide lines. At the full 1488 px content width, the rail must preserve the Figma coordinates:

- line 1: 10 px
- line 2: 470 px
- line 3: 930 px
- line 4: 1390 px

The rail therefore starts 10 px from the content container's left edge and ends 98 px from its right edge. The four lines divide that rail into three equal responsive intervals. As the viewport narrows, the rail width and all three intervals shrink automatically.

## Anchored content

Each content group is positioned by the center of its 20 px plus icon:

- `Personal page` plus → line 1
- `Poland, Poznan` plus → line 2
- hero CTA plus → line 3

The text remains offset from its plus by the existing horizontal gap. No text block receives an independent fixed X coordinate.

All three plus centers share one horizontal baseline. The current 2 px vertical mismatch on the CTA plus is removed.

## Implementation

- Add a shared desktop grid-rail class/structure.
- Place guide lines at 0%, 33.333%, 66.667%, and 100% of the rail.
- Position label and CTA wrappers from the same rail coordinates, subtracting half the plus width so each plus center sits exactly on its guide.
- Keep the existing desktop-only visibility and stacking behavior.
- Do not add resize listeners or JavaScript layout measurement.

## Verification

Check desktop viewports 1024, 1180, 1280, 1440, and 1586 px:

- all four lines remain inside the content container;
- three grid intervals are equal within 1 px;
- each plus center matches its assigned line within 1 px;
- all three plus centers share the same Y coordinate within 1 px;
- text and CTA remain readable without horizontal overflow;
- `npm run build` and `git diff --check` pass.
