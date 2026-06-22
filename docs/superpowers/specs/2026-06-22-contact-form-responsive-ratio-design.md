# Contact form responsive ratio

## Scope

Change only the two-column image-and-form area inside `block-contact`.

## Responsive behavior

- Below 1024 px: keep the current tablet/mobile layout; the image remains hidden and the form fills the container.
- From 1024 px through 1439 px: show the image and form in a two-column grid. After subtracting the existing 40 px gap, allocate 25% of the available width to the image and 75% to the form.
- From 1440 px: keep the current desktop layout unchanged at 496 px for the image and Fill Container for the form.

## Invariants

- Keep the 40 px gap between image and form.
- Keep the image and form heights at 412 px.
- Preserve the current 24 px container padding and all form field geometry.
- Do not change other sections or breakpoints.

## Verification

- Check 1023, 1024, 1298, 1439, 1440, and 1586 px.
- Confirm the image visibility boundary at 1024 px.
- Confirm the 25/75 column ratio at 1024–1439 px.
- Confirm the fixed 496 px desktop image width from 1440 px.
- Run `npm run build` and `git diff --check`.
