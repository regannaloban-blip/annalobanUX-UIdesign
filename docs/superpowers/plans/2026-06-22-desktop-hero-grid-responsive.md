# Responsive Desktop Hero Grid Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the desktop hero guide lines and plus-anchored text groups shrink together with the content container.

**Architecture:** Replace fixed pixel X coordinates with a shared CSS rail spanning from 10 px to 98 px inside the shell. Lines and anchor wrappers use the same 0%, 33.333%, 66.667%, and 100% stops, so their geometry cannot drift apart.

**Tech Stack:** React 18, Tailwind CSS utilities, project CSS, in-app browser geometry checks.

---

### Task 1: Shared responsive rail

**Files:**
- Modify: `src/App.jsx:284-349`
- Modify: `src/index.css:54-75`

- [ ] **Step 1: Record the failing browser geometry**

At viewports 1024, 1180, 1280, 1440, and 1586 px, read the shell width, all four line X positions, and three plus centers. Expected current failure: lines remain `10, 470, 930, 1390` while the shell narrows.

- [ ] **Step 2: Replace fixed coordinates with shared stops**

Use these shared stops in `src/App.jsx`:

```jsx
const desktopGridStops = ["0%", "33.333333%", "66.666667%", "100%"];
```

Render `FirstViewportGuide` inside `desktop-hero-grid-rail`. Position both labels with `desktop-hero-grid-anchor`, using the first and second stops. Render `HeroTopBrief` inside the same rail class and position it at the third stop.

- [ ] **Step 3: Add rail and anchor CSS**

Add to `src/index.css`:

```css
.desktop-hero-grid-rail {
  left: 10px;
  right: 98px;
}

.desktop-hero-grid-anchor {
  transform: translateX(-10px);
}

.hero-top-brief-card {
  width: min(390px, calc(33.333333% + 108px));
}
```

The rail boundaries preserve the 1488 px Figma positions while allowing all three intervals to shrink equally.

- [ ] **Step 4: Align plus centers vertically**

Keep label wrappers at the existing effective Y position of 177 px and set the CTA wrapper to the same 177 px. Since every plus is 20 px high, all centers resolve to the same Y.

- [ ] **Step 5: Verify responsive geometry**

At each test viewport, verify:

```text
line intervals differ by no more than 1 px
Personal plus X = line 1
Poznan plus X = line 2
CTA plus X = line 3
all plus center Y values differ by no more than 1 px
all lines remain inside the shell
```

- [ ] **Step 6: Verify project integrity**

Run:

```bash
npm run build
git diff --check
```

Expected: both commands exit successfully.
