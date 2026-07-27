# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Marketing/portfolio site for Tornado Audio — Hunter Johanson, mixing/mastering
and live sound engineer, based in Bloomington-Normal, IL — at tornadoaudio.net.
A Create React App frontend (via `react-app-rewired`) plus a small Express
server that serves the built SPA and handles two form endpoints. Deployed as a
single Docker container on port 3001.

**There is no database and no analytics.** The server holds no state beyond an
in-memory rate limit. If you find yourself adding a tracker, read the "Trust
and claims" section first.

## Commands

```bash
npm install                  # also installs server deps via postinstall

# Dev
npx react-app-rewired start  # React dev server on :3000, proxies /api to :3001
npm run server:dev           # Express + nodemon on :3001
npm start                    # NOT a dev server — runs the Express server (cd server && npm start)

# Build
npm run build                # prebuild auto-runs generate-sitemap
npm run build:memory-efficient  # 512MB heap cap, no sourcemaps, no eslint — used by Docker
npm run generate-sitemap     # regenerate public/sitemap.xml from blog frontmatter

# Docker
npm run docker:up / docker:down / docker:logs
```

There is no lint script; ESLint runs inside the webpack build unless
`DISABLE_ESLINT_PLUGIN=true`.

**There is no test suite.** `npm test` starts CRA/Jest in watch mode and finds
nothing — no test files exist, and `@testing-library/*` is not installed. If
you need tests, add those devDependencies first. To smoke-test a change, build
and then render the built app; jsdom is available transitively and can load
`http://localhost:3001/` with `runScripts: 'dangerously'`, though it lacks
`fetch`, so blog pages won't populate.

## Architecture

**Routing lives in `src/index.js`, not `src/App.js`.** `App.js` is only the `/`
route — a one-page scroll layout of Hero → About → Services → LiveSound →
Portfolio → Testimonials → Pricing → Contact. Standalone routes:
`/privacy-policy`, `/terms-of-service`, `/service-agreement`, `/blog`,
`/blog/:slug`. All five are `React.lazy` code-split behind a `Suspense`
fallback. `BrowserRouter` + `HelmetProvider` wrap everything; Express has a
catch-all `app.get('*')` serving `build/index.html` so deep links work.

**Business logic is config-driven.** `src/config/siteConfig.js` is the single
knob file, and it is the intended home for any value that appears in more than
one place — prices, location, contact details, experience claims, feature
flags. Components never read it directly; they use the `useSiteConfig` hook
(`src/hooks/useSiteConfig.js`), which resolves tier pricing, capacity status,
and adjusted turnaround strings. `business.maintenanceMode: true` makes
`App.js` render `MaintenanceMode` instead of the site — this only affects `/`,
not the other routes.

**Pricing appears in five places and they must agree**: the `PRICING_TIERS`
array in `PricingSection.js`, the Project Type `<select>` in
`ContactSection.js`, the `hasOfferCatalog` and FAQ blocks in
`public/index.html`, and the rate tables in `ServiceAgreement.js` and
`TermsOfService.js`. Changing one without the others is the easiest way to
reintroduce the contradictions this site was cleaned up to remove.

**Content that can't be substantiated is gated off, not faked.** Several
sections render `null` until real content exists — `Testimonials` needs both
`features.showTestimonials` and a non-empty `src/config/testimonials.js`; the
About portrait needs `about.photo`; the live-sound venue list needs
`liveSound.venues`; portfolio release links need a `releaseUrl`. Leave these
gates in place. Do not populate them with placeholder or invented content.

**Blog posts are markdown files bundled by webpack.** Posts live in
`src/blog/posts/*.md` with gray-matter frontmatter (`title`, `date`, `slug`,
`author`, `excerpt`, `image`, `tags`). `config-overrides.js` adds a `.md` →
`asset/resource` rule, so `require.context` in `useBlogPosts.js` and
`BlogPost.js` yields URLs that are then `fetch`ed and parsed with gray-matter
at runtime (this is why `buffer` is polyfilled via `ProvidePlugin`). The
`slug` frontmatter field, not the filename, determines the URL. `BlogPost`
renders with `react-markdown` + `remark-gfm` + `rehype-raw` + `rehype-sanitize`.

Adding a post: drop the `.md` in `src/blog/posts/`, include frontmatter, then
`npm run generate-sitemap` (or just build — `prebuild` does it).
`scripts/generate-sitemap.js` reads the same frontmatter and writes
`public/sitemap.xml`; the static section-anchor and legal-page URLs in it are
hardcoded in that script, so new top-level routes must be added there manually.
Do not hardcode prices in post copy — link to `/#pricing` instead; posts have
drifted out of sync with the pricing page before.

**Chunk splitting is deliberate.** `config-overrides.js` sets
`chunks: 'initial'` on the vendor cache groups. Without it, a dependency
reachable only from a lazy route (react-markdown and its plugins) gets hoisted
into the entry bundle, defeating the code splitting in `src/index.js`.

**Server (`server/`).** A single `server.js`; dependencies are just express,
cors, dotenv and nodemailer. It serves `../build` statically, sets security
headers, gives `sitemap.xml`/`robots.txt`/`manifest.json` their own content
types and cache lifetimes, and exposes:

- `POST /api/contact` — sends a notification email to `RECIPIENT_EMAIL` plus a
  confirmation to the submitter. A failed confirmation does not fail the
  request; the inquiry already landed.
- `POST /api/subscribe` — mailing-list signup. There is no database, so a
  signup is delivered as mail and added to the list by hand.
- `GET /api/health` — status, uptime, whether mail is enabled, whether the
  sitemap built.

Both POST routes share an in-memory rate limiter (5/hour/IP, resets on
restart, fine for a single-instance deploy). User input is escaped with
`escapeHtml` before it goes into an HTML email body.

## Environment

`server/.env` (gitignored; `server/.env.example` is checked in) supplies:
`MAIL_ENABLED`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`,
`SMTP_PASS`, `MAIL_FROM`, `MAIL_FROM_NAME`, `RECIPIENT_EMAIL`, `PORT`. When
`MAIL_ENABLED` is not exactly `"true"`, the contact form accepts submissions
and returns success without sending anything.

`MAIL_FROM_NAME` is a display name only. Putting a full address in it produces
a malformed `From` header and hurts deliverability.

## Trust and claims

This site sells a service, and its credibility is load-bearing. Two rules:

- **Never add review or rating markup without real, collected reviews.** A
  fabricated `aggregateRating` was removed from `public/index.html` in July
  2026; it is a Google structured-data violation and an FTC exposure.
- **Never add analytics or tracking without saying so in the privacy policy.**
  The previous stack shipped visitor names and emails to Google as "enhanced
  conversion" data with no consent notice. `PrivacyPolicy.js` currently states
  that the site uses no analytics cookies, pixels, or third-party tracking — if
  that stops being true, that section has to change in the same commit.

Experience figures (`50+` tracks, `100+` events, `yearsExperience`) live in
`siteConfig.business` and `HeroSection.js`. They sit next to a $250 price, so
treat them as claims to verify rather than copy to tweak.

## Reference docs in repo

`GROWTH_PLAN.md` (business strategy and outstanding items), `README.md`,
`SEO_ENHANCEMENT_GUIDE.md`, `SITEMAP_GENERATOR.md`,
`PRIVACY_POLICY_IMPLEMENTATION.md`, `server/SETUP_GUIDE.md`. Some of the older
guides predate the July 2026 rework — check them against the code before
trusting them.

## Conventions

- One `.css` file per component, colocated in `src/components/`, imported by
  the component. Mobile-first: base rules assume a narrow single column and
  `min-width` queries add columns.
- Styling is flat — hairline rules, near-square corners, no gradients, shadows,
  hover lift, or entrance animations. Colours and spacing come from the custom
  properties defined in `App.css`; don't hardcode values.
- Form inputs must stay at `var(--step-0)` (1rem) or larger, or iOS Safari
  zooms the page on focus. Tap targets are `min-height: 44px`.
- Pages carry SEO markup: `Helmet` blocks for title/description/canonical/OG,
  plus schema.org microdata (`itemScope`/`itemProp`) — preserve these when
  editing markup.
- Standalone pages render `<Header />` themselves; `Header` switches between
  hash anchors and router links depending on whether it's on `/`.
