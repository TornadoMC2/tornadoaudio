# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Marketing/portfolio site for Tornado Audio (Hunter Johanson, audio mixing engineer) at tornadoaudio.net. A Create React App frontend (via `react-app-rewired`) plus an Express backend that serves the built SPA, handles the contact form, and records visitor/event analytics in MongoDB. Deployed as a single Docker container on port 3001.

## Commands

```bash
npm install                  # also installs server deps via postinstall

# Dev
npx react-app-rewired start  # React dev server on :3000, proxies /api to :3001
npm run server:dev           # Express + nodemon on :3001
npm start                    # NOT a dev server — runs the Express server (cd server && npm start)

# Build & test
npm run build                # prebuild auto-runs generate-sitemap
npm run build:memory-efficient  # 512MB heap cap, no sourcemaps, no eslint — used by Docker
npm test                     # CRA/Jest watch mode — currently fails, see below
CI=true npx react-app-rewired test --watchAll=false -t "renders pricing section"  # single test
npm run generate-sitemap     # regenerate public/sitemap.xml from blog frontmatter

# Docker
npm run docker:up / docker:down / docker:logs
```

There is no lint script; ESLint runs inside the webpack build (`react-app` config in `package.json`) unless `DISABLE_ESLINT_PLUGIN=true`.

**The test suite does not currently run.** `src/App.test.js` imports `@testing-library/react` and `src/setupTests.js` imports `@testing-library/jest-dom`, but neither package is declared in `package.json` or installed, so the one suite fails at module resolution. Install `@testing-library/react`, `@testing-library/jest-dom`, and `@testing-library/user-event` as devDependencies before relying on tests. The four existing tests assert on visible section headings in `App`.

## Architecture

**Routing lives in `src/index.js`, not `src/App.js`.** `App.js` is only the `/` route (a one-page scroll layout of Hero → Services → LiveSound → Portfolio → Pricing → Contact). Standalone routes: `/privacy-policy`, `/terms-of-service`, `/service-agreement`, `/blog`, `/blog/:slug`, `/analytics`. `BrowserRouter` + `HelmetProvider` wrap everything; Express has a catch-all `app.get('*')` serving `build/index.html` so deep links work.

**Business logic is config-driven.** `src/config/siteConfig.js` is the single knob file for sales/discounts, order capacity, maintenance mode, turnaround multipliers, contact info, and feature flags. Components never read it directly — they use the `useSiteConfig` hook (`src/hooks/useSiteConfig.js`), which derives sale prices (rounded down to the nearest $5, with per-service exclusion via `excludeServiceIds`), capacity status, adjusted turnaround strings, and the sale banner message. `maintenanceMode: true` makes `App.js` render `MaintenanceMode` instead of the site — this only affects `/`, not the other routes.

**Blog posts are markdown files bundled by webpack.** Posts live in `src/blog/posts/*.md` with gray-matter frontmatter (`title`, `date`, `slug`, `author`, `excerpt`, `image`, `tags`). `config-overrides.js` adds a `.md` → `asset/resource` rule, so `require.context` in `useBlogPosts.js` and `BlogPost.js` yields URLs that are then `fetch`ed and parsed with gray-matter at runtime (this is why `buffer` is polyfilled via `ProvidePlugin`). The `slug` frontmatter field, not the filename, determines the URL. `BlogPost` renders with `react-markdown` + `remark-gfm` + `rehype-raw` + `rehype-sanitize`.

Adding a post: drop the `.md` in `src/blog/posts/`, include frontmatter, then `npm run generate-sitemap` (or just build — `prebuild` does it). `scripts/generate-sitemap.js` reads the same frontmatter and writes `public/sitemap.xml`; the static section-anchor and legal-page URLs in it are hardcoded in that script, so new top-level routes must be added there manually.

**Server (`server/`).** `server.js` mounts `visitorLoggingMiddleware` globally, then `/api/analytics`, then static `../build`. Two Mongoose models: `VisitorLog` (per-request) and `EventLog` (typed events — the `eventType` enum in `models/EventLog.js` must be extended before logging a new kind). `utils/logger.js` hashes IPs with `IP_SALT` before storage and hand-rolls user-agent parsing; logging failures are swallowed so they never break a request. The middleware deliberately skips static assets, `/api/analytics*`, `/analytics`, and anything referred from `/analytics` to avoid the dashboard inflating its own numbers.

`POST /api/contact` sends two Resend emails (notification + confirmation) but only when `RESEND_ENABLED=true`; email failures are logged as events and the request still returns success. Analytics routes are gated by `authenticateApiKey` + in-memory `rateLimit(100, 15min)` from `middleware/auth.js` (which also exports unused-but-available `authenticateToken`, `requireAdmin`, `ipWhitelist`).

**`server/server_with_logging.js` is a stale variant of `server.js` and is not the entrypoint** — `server/package.json` runs `server.js`. Don't edit it expecting effects.

## Environment

`server/.env` (gitignored, no `.env.example` checked in) supplies: `MONGODB_URI`, `RESEND_API_KEY`, `RESEND_ENABLED`, `RECIPIENT_EMAIL`, `ANALYTICS_API_KEY`, `IP_SALT`, `JWT_SECRET`, `PORT`. Changing `IP_SALT` orphans all previously stored `ipHash` values. Frontend may set `REACT_APP_API_URL`; it defaults to relative paths, which is correct in production since Express serves the bundle.

## Known issues worth knowing before you touch them

- The analytics API key is **hardcoded in `src/components/Analytics.js`** and therefore shipped in the client bundle; the same value is documented in plaintext in `server/SECURITY_GUIDE.md`. The `/analytics` "login" only compares user input against that constant. Treat the analytics data as effectively public until this is moved server-side.
- `VisitorLog` stores the raw `ipAddress` alongside the hash, despite the privacy docs describing hashing as the privacy measure.
- Contact-form email templates interpolate user input directly into HTML in `server/server.js`.

## Reference docs in repo

`SEO_ENHANCEMENT_GUIDE.md`, `SITEMAP_GENERATOR.md`, `PRIVACY_POLICY_IMPLEMENTATION.md`, `server/SETUP_GUIDE.md` (partly stale — describes a Gmail/Google Sheets setup that Resend replaced), `server/SECURITY_GUIDE.md`, `server/README_LOGGING.md`. `README.md` is the untouched CRA boilerplate.

## Conventions

- One `.css` file per component, colocated in `src/components/`, imported by the component.
- Pages carry heavy SEO markup: `Helmet` blocks for title/description/canonical/OG/Twitter, plus inline schema.org microdata (`itemScope`/`itemProp`) — preserve these when editing markup.
- Standalone pages render `<Header />` themselves; `Header` switches between hash anchors and router links depending on whether it's on `/`.
