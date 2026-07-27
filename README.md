# Tornado Audio

Marketing site for Tornado Audio — studio mixing, mastering, and live sound
engineering by Hunter Johanson.

A Create React App frontend (via `react-app-rewired`) served in production by a
small Express process that also handles the contact form.

## Architecture

```
src/                React app
  components/       Page sections and routes
  blog/posts/       Blog posts as markdown, read at build time
  config/           siteConfig.js - pricing, capacity, feature toggles
server/             Express: serves build/ and handles POST /api/contact
scripts/            Sitemap generator, runs on prebuild
```

There is no database. The server holds no state beyond an in-memory rate limit
on the contact endpoint.

## Running locally

```bash
npm install                 # also installs server deps via postinstall
cp server/.env.example server/.env
```

Fill in `server/.env` (see `server/SETUP_GUIDE.md` for SMTP settings), then:

```bash
npm run server:dev          # API on :3001
npm start                   # ...or the full production-style server
```

For frontend work with hot reload, run `react-app-rewired start` alongside the
API — `package.json` proxies API requests to `:3001`.

## Building

```bash
npm run build                   # generates sitemap, then builds
npm run build:memory-efficient  # same, capped at 512MB heap for small VPS boxes
```

## Docker

```bash
npm run docker:up
npm run docker:logs
npm run docker:down
```

The compose file reads `server/.env` and health-checks `/api/health`.

## Design system

Tokens live at the top of `src/App.css` — colours, a fluid type scale, spacing,
and radii. Component stylesheets consume those custom properties and should not
hardcode colours or font sizes.

The house style is deliberately plain: flat fills, hairline `1px` rules instead
of drop shadows, near-square corners, a serif for headings and a system sans for
body text. No gradients, no entrance animations, no hover lifts.

All CSS is **mobile-first** — base rules target small screens and `min-width`
media queries add complexity for larger ones. Please keep it that way; do not
introduce `max-width` queries.

## Content

- **Blog posts** — add a markdown file to `src/blog/posts/` with frontmatter.
  Picked up automatically and included in the sitemap.
- **Pricing, capacity, sales, feature toggles** — `src/config/siteConfig.js`.
- **Maintenance mode** — set `business.maintenanceMode` in `siteConfig.js`.
