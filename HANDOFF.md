# Portfolio Handoff — WebGL Effects Stable, Next: Seamless Scroll

## Start Here

- Repository: `/Users/annaloban/Documents/Codex/Portfolio`
- Branch: `AnnaSite-1`
- Preview: `http://127.0.0.1:5173/`
- Layout baseline: `bcb663c` — `v0.4.5 refine responsive portfolio layouts`
- Current effects baseline: `d49e49a` — `v0.4.15 fix Contact title WebGL flow text`
- Current task for the next chat: add seamless/smooth scroll like the original reference, without changing the approved layout or breaking the current WebGL/fluid effect.

Do not reread the whole project. Start with:

- `src/App.jsx`
- `src/index.css`
- `src/webgl/CanvasScene.js`
- `package.json`

Open individual WebGL plane/shader files only if scroll integration proves it affects plane positioning or RAF timing.

## Non-Negotiable Contract

The DOM layout is fixed and must stay visually equal to baseline `bcb663c`.

Do not change:

- layout
- sizes
- positions
- section heights
- typography
- breakpoints
- vertical spacing
- grid rails
- labels/captions near plus signs
- buttons
- links
- form field layout
- responsive behavior

If an effect breaks the baseline layout, do not “fix” the layout to fit the effect. Fix only:

- clipping
- layer ownership
- z-index
- pointer-events
- WebGL inclusion/exclusion
- scroll/RAF synchronization
- fallback behavior

The current DOM layer remains the source of truth for layout, links, form controls, keyboard focus, text selection, and accessibility.

## Current Stable Effect State

Fluid/WebGL effect is already active on desktop only and accepted section-by-section:

- Hero / first screen
- Product intro
- About media layer
- About text via `FlowTextPlane`
- Purpose list
- Works title and project descriptions
- Contact title via `FlowTextPlane`
- Contact eyebrow/text/image
- Contact submit button

The form fields themselves must stay outside the fluid effect.

Current important commits:

- `d49e49a` — `v0.4.15 fix Contact title WebGL flow text`
- `d2bbced` — `v0.4.14 enable Contact form button WebGL effect`
- `5c4ac39` — `v0.4.13 extend WebGL effect to Contact block`
- `ecfea85` — `v0.4.12 extend WebGL effect to Works blocks`
- `ce33c6c` — `v0.4.11 extend WebGL effect to Purpose list`
- `458d543` — `v0.4.10 update hero background asset`
- `a61d339` — `v0.4.9 add flow WebGL text for About`
- `74a7a10` — `v0.4.8 isolate About WebGL media layer`
- `3dc84ca` — `v0.4.7 extend WebGL effect to product intro`
- `b35c06d` — `v0.4.6 isolate hero WebGL grid layer`
- `bcb663c` — `v0.4.5 refine responsive portfolio layouts`

## Current Implementation Notes

`src/App.jsx`

- Imports `CanvasScene`.
- `CanvasLayer` mounts one fixed canvas with `pointer-events: none`.
- `CanvasLayer` currently creates `CanvasScene` with `enableSmoothScroll: false`.
- On WebGL ready, it adds `body.gl-ready`.
- On fallback, it removes `body.gl-ready`.
- Desktop effects are disabled below desktop/reduced-motion according to existing app logic.

`src/index.css`

- On desktop, `body.gl-ready` hides DOM nodes with:
  - `[data-gl-hero-text]`
  - `[data-gl-hero-media]`
  - `[data-gl-hero-background]`
  - `[data-gl-flow-text]`
- The hidden DOM nodes remain in layout and remain the measurement source for WebGL planes.

`src/webgl/CanvasScene.js`

- Imports `Lenis`.
- Has constructor option `enableSmoothScroll = false`.
- Existing Lenis block currently uses:
  - `infinite: true`
  - `lerp: 0.1`
  - `smoothWheel: true`
  - `wheelMultiplier: 1`
- Do not enable this blindly. It was written before the current WebGL section-by-section stabilization and can affect section order, scroll measurement, plane positions, footer reachability, and browser history/anchors.
- RAF loop already calls `this.lenis?.raf(time)`.
- Plane positions are updated every frame from live DOM bounds, so scroll integration must keep DOM transforms/scroll state compatible with `getBoundingClientRect()`.
- `shouldIgnoreFluidAt(x, y)` ignores `[data-gl-ignore-fluid], input, textarea, select, option`.
- Contact form fields are wrapped in `data-gl-ignore-fluid`; the submit button is not ignored and should keep the effect.
- Contact title must stay on `data-gl-flow-text`. Do not put separate `data-gl-hero-text` markers on its inline spans; that caused clipped/overlapping words.

## Current Markup Rules

Use existing markers only; do not invent a new layout model.

- `data-gl-hero-text` — rasterize text into WebGL and hide DOM text after `gl-ready`.
- `data-gl-hero-media` — rasterize media/image into WebGL.
- `data-gl-hero-background` — rasterize background rectangles/buttons into WebGL.
- `data-gl-flow-text` — preserve complex text wrapping, used for About.
- `data-gl-ignore-fluid` — no new fluid splats over that zone.
- `data-gl-text-no-fluid` — keep text out of fluid replacement when needed.

## Reference

Original reference for effects/scroll behavior:

- https://www.daspritam.in/

User provided a screen recording in the previous chat:

- `/Users/annaloban/Desktop/Запись экрана — 2026-06-23 в 09.53.04.mov`

Use the reference only to understand the scroll feel. Do not copy unrelated layout, typography, content, or section proportions.

## Smooth / Seamless Scroll Plan

Goal: add a smooth/seamless scroll feel like the original, while keeping the current page structure and WebGL effect intact.

Safe order:

1. Read-only audit:
   - confirm current scroll height;
   - confirm each section top/bottom before changing scroll;
   - confirm WebGL planes follow DOM during native scroll.
2. Check current Lenis implementation in `CanvasScene.js`.
3. Decide whether to:
   - enable non-infinite Lenis first, or
   - implement a separate smooth scroll controller outside WebGL.
4. Start with smooth scroll only, not infinite looping.
5. Verify that WebGL planes still align with DOM markers while scrolling.
6. Verify the footer/contact section is reachable and the form is usable.
7. Only after smooth scroll is stable, consider seamless/infinite looping as a separate patch.

Important: “seamless” must not mean duplicating DOM sections in a way that changes layout baseline, focus order, links, or form behavior. If looping is attempted, it needs a fallback and must not duplicate form submission targets or confuse tab order.

## Verification Gate

After any scroll patch:

- `npm run build`
- `git diff --check`
- visual check in the browser at desktop width
- confirm no horizontal overflow
- confirm scrolling reaches Contact
- confirm Contact form fields can be focused/typed
- confirm Contact submit button remains clickable and fluid-enabled
- confirm fluid trail and text/media deformation still work while scrolling
- confirm no duplicated visible sections unless explicitly implementing loop mode
- confirm reduced-motion and WebGL fallback do not blank the page

If adding Lenis:

- verify wheel scroll
- verify trackpad-like scroll
- verify keyboard scroll/PageDown/Home/End as much as browser automation allows
- verify anchor/link clicks still work
- verify cleanup on hot reload/unmount does not create duplicate RAF listeners

## Working Tree Note

Unrelated local files may exist and should not be committed unless explicitly requested:

- `.agents/`
- `skills-lock.json`

`HANDOFF.md` is intentionally edited for this transfer.

## Exact Prompt for the New Chat

> Прочитай HANDOFF.md и продолжай с текущего коммита `d49e49a` (`v0.4.15 fix Contact title WebGL flow text`). Layout baseline для сравнения: `bcb663c` (`v0.4.5 refine responsive portfolio layouts`). Не перечитывай весь проект. Стартуй с `src/App.jsx`, `src/index.css`, `src/webgl/CanvasScene.js`, `package.json`.
>
> Задача: добавить smooth/seamless scroll как у оригинала https://www.daspritam.in/, но не менять DOM-вёрстку. Зафиксированная DOM-вёрстка и responsive неприкосновенны: не менять layout, размеры, позиции, отступы, шрифты, гриды, подписи, кнопки, ссылки и форму. Если после скролла или WebGL ломается вид baseline-вёрстки, не правь саму вёрстку под эффект. Чини только изоляцию/синхронизацию эффекта: clipping, layer ownership, z-index, pointer-events, WebGL inclusion/exclusion, RAF/scroll sync.
>
> Сначала сделай read-only аудит текущего scroll/WebGL состояния и скажи, какой минимальный безопасный вариант предлагаешь: non-infinite Lenis first или другой изолированный smooth-scroll слой. Не включай infinite loop первым патчем. Сначала smooth scroll без зацикливания. После патча проверь `npm run build`, `git diff --check`, Contact reachability, форму/инпуты, кликабельность кнопки, и что WebGL/fluid остаётся синхронным с DOM при скролле. Только после стабильного smooth scroll можно обсуждать настоящий seamless/infinite loop отдельным коммитом.
