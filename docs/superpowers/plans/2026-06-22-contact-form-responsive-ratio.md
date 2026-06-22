# Contact Form Responsive Ratio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the contact image/form layout use a 25/75 ratio from 1024 through 1439 px while preserving the existing tablet and desktop layouts.

**Architecture:** Keep the existing Footer markup and Tailwind breakpoint strategy. Change only the grid columns and image width utilities in `src/App.jsx`; no new component or CSS file is needed.

**Tech Stack:** React, Tailwind CSS, Vite

---

### Task 1: Update the contact grid ratio

**Files:**
- Modify: `src/App.jsx:759-760`

- [ ] **Step 1: Record the current failing browser geometry**

At 1298 px, verify that the image is currently 496 px and the form is 616 px. The target is 278 px and 834 px after subtracting the existing 40 px gap from the 1152 px inner container.

- [ ] **Step 2: Implement the breakpoint-specific columns**

Replace the large-screen grid and image width utilities with:

```jsx
lg:grid-cols-[3fr_9fr] min-[1440px]:grid-cols-[496px_minmax(0,1fr)]
```

and:

```jsx
lg:w-full min-[1440px]:w-[496px]
```

Use `3fr 9fr` so the two columns receive 25% and 75% of the width remaining after the 40 px gap.

- [ ] **Step 3: Verify responsive geometry**

Check viewports 1023, 1024, 1298, 1439, 1440, and 1586 px. Expected behavior:

- 1023 px: image hidden, form fills the container.
- 1024–1439 px: image/form columns are 25%/75% after the 40 px gap.
- 1440 px and above: image width is 496 px and the form fills the remaining column.

- [ ] **Step 4: Run project verification**

Run:

```bash
npm run build
git diff --check
```

Expected: both commands exit successfully with no errors.
