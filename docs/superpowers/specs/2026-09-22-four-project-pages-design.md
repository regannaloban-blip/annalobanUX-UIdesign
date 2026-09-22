# Four project pages design

## Goal

Add four standalone, responsive project pages to the portfolio without changing the current home page or its menu. The pages give visitors a clear overview of each project and keep the existing contact conversion path.

## Scope

The new public routes are:

- `/work/24colab-content-services-website`
- `/work/smart-business-intelligence-website`
- `/work/skyliner-commercial-property-website`
- `/work/your-dissertation-order-flow`

Each route uses one shared React template backed by a small case registry. The registry supplies project name, industry, scope, website goal, project image, live-site URL, and interface-level copy. It must only contain visible or otherwise confirmed facts; no role, research, metric, conversion, or client-result claims are permitted.

## Responsive layout

The 24 colab Figma frame is the visual source of truth at its three supplied widths: desktop 1586 px, tablet 873 px, and mobile 440 px. It establishes the shared layout for all four case pages:

1. Top project link and existing social links.
2. Project hero with identity, short context and four metadata rows.
3. Pattern/logo area, challenge and screen-preview sections.
4. Solution and four feature cards.
5. Next-project links and the existing contact form.

For 24 colab the metadata wording is:

- Project type: B2B service website
- Industry: Content services
- Scope of work: UX/UI web design
- Website goal: Present services clearly

The other three cases reuse this layout and responsive behavior with their own existing project images and fact-bounded copy. No separate Figma screen for them has been supplied.

## Routing and safety

`/` and `/privacy` retain their current rendering unchanged. A pathname resolver renders a project page only for one of the four explicitly registered routes; unsupported paths render a not-found page rather than silently showing the home page. The existing contact form is reused, not copied or altered.

## SEO and links

Each case has its own title, description, canonical URL, WebPage/BreadcrumbList schema, and sitemap entry. Each page keeps a direct link to the live project and links to another case. These are structural changes only; publication remains out of scope.

## Verification

Tests cover route uniqueness, required project fields, related-route integrity, and unknown-path resolution. Final checks run the relevant node tests, `npm run build`, `git diff --check`, and local responsive review at the Figma desktop, tablet, and mobile widths.

## Non-goals

- No edits to the home page.
- No menu changes.
- No service pages.
- No deployment, publishing, or changes to production.
