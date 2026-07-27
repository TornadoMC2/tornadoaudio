# Tornado Audio — Growth Plan

## Status (2026-07-26)

P0–P4 are implemented. What still blocks full effect is content only Hunter can
supply — every such element is gated off in config so nothing unsubstantiated
ships in the meantime:

| Needed | Where it goes | Currently |
| --- | --- | --- |
| Portrait photo | `siteConfig.about.photo` | `null` — About renders single-column |
| Streaming links | `releaseUrl` in `Portfolio.js` | `null` — link hidden |
| Venue names | `siteConfig.liveSound.venues` | `[]` — block hidden |
| Testimonials | `src/config/testimonials.js` + `features.showTestimonials` | empty + `false` — section returns `null` |
| Confirm 50+/100+/5+ figures | `HeroSection.js`, `siteConfig.business` | flagged with a TODO |

Off-site actions from P3 (Google Business Profile, ISU/IWU outreach, asking the
three existing artists for testimonials) are not code and remain outstanding.

## Context

The site is well built and technically clean, but it is not set up to win clients.
Three things are working against it:

1. **Pricing signals amateur.** $40–$200/song sits below the budget floor of the
   2026 market (entry mastering $20–50, budget mixing ~$100, mid-tier mixing
   $400–800). An unexplained low price tells serious clients this isn't their
   tier, and attracts clients who will burn an uncapped revision budget.
2. **There is no substantiated trust.** No photo of Hunter, no About section, no
   testimonials, no linkable released credits, only 3 audio samples. Meanwhile
   `index.html` carries a **fabricated** 5.0/15-review `aggregateRating` — a
   Google structured-data violation and an FTC exposure.
3. **Facts contradict each other** across the page, the config, and the schema
   (years of experience, email address, payment methods, turnaround times,
   copyright year). Any prospect who spots one starts doubting everything else.

There is also a half-removed analytics stack: the previous commit removed the
analytics *stack* but `index.html` still loads GA4 + Google Ads and fires a
conversion on page load, and `ContactSection.js` still ships visitor **name and
email to Google** with no consent notice.

### Decisions taken (2026-07-26)

| Decision | Choice |
| --- | --- |
| Primary offer | **Remote studio mixing/mastering.** Live sound stays as a real, secondary offer. |
| Pricing | Anchor + expiring introductory rate (table below). Kill the $40 tier. |
| Location | Claim **Bloomington-Normal, IL** as home base; Central Illinois + Chicago as live-sound travel radius. Do *not* claim Chicago as a base. |
| Social proof available | Released tracks to link, photos of Hunter/studio/FOH, named venues. **No testimonials yet** — these get collected via the intro-rate trade. |

### Target price structure

```
                 Standard   Intro rate
Master only        $120    →    $75
Mix                $250    →   $125
Mix + Master       $350    →   $175

Intro rate: next 8 projects, in exchange for portfolio use + a written testimonial.
Revisions:  2 (master) / 2 (mix) / 3 (mix+master), then hourly.
Deposit:    50% up front.
Album rate: 15% off 4+ songs.
```

The anchor is the point. It's what clients remember, it makes the eventual raise
a scheduled event rather than a betrayal, and it reframes the discount as a *deal
with a reason* instead of a statement about the quality of the work. The intro
rate must genuinely expire — a permanent introductory rate is a fake sale.

---

## P0 — Credibility and legal (ship before anything else)

These are small diffs with outsized downside if left alone.

- **Delete the fabricated `aggregateRating`** from the `ProfessionalService` block
  in `public/index.html` (~line 161). Nothing replaces it until real reviews
  exist. When they do, add `Review` objects with real author names and dates.
- **Resolve the analytics contradiction.** Recommended: finish the removal —
  strip the `gtag`/`dataLayer` loader and the page-load conversion ping from
  `public/index.html`, and remove the `window.gtag` calls and `TRACKING_CONFIG` /
  `SERVICE_VALUES` blocks from `src/components/ContactSection.js` and
  `src/components/PricingSection.js` (24 references across the three files).
  The `user_data` payload at `ContactSection.js:74` sends PII to Google and must
  go regardless of which way this is decided.
- **Reconcile every contradictory fact.** Pick one truth per item and make
  `siteConfig.js` the single source where a value appears more than once:
  - Years of experience — hero says `5+`, meta description says `3+`,
    `foundingDate` says 2020. Pick one.
  - Contact email — `siteConfig.js:34` says `hunter@tornadoaudio.com`,
    `ContactSection.js` displays `contact@tornadoaudio.net`.
  - Payment methods — three different lists (`siteConfig.js:48`,
    `ContactSection.js`, `index.html` schema).
  - Turnaround — page says 72h/48h/24h, FAQ schema says "2–3 days".
  - Footer copyright is hardcoded `2025` in `src/App.js` (two places). Derive it.
- **Remove "unlimited revisions"** from the top tier in `PricingSection.js`. It is
  uncapped liability and it contradicts the 24-hour turnaround printed beside it.
- **Update `ServiceAgreement.js` and `TermsOfService.js`** to match the new
  revision caps, deposit requirement, and turnaround figures.

## P1 — Pricing restructure

Files: `src/components/PricingSection.js`, `src/config/siteConfig.js`,
`src/components/ContactSection.js` (the Project Type `<select>` mirrors the
tiers and prices — it must stay in sync), `public/index.html` (`hasOfferCatalog`
and the FAQ `priceRange` answers).

- Replace the three tiers with **Master Only / Mix / Mix + Master** at the prices
  above. Mastering is currently advertised in `ServicesSection.js` but cannot be
  purchased — that's free money left on the table.
- Render each card as anchor + intro price, with the reason stated inline, not as
  a generic "SALE" badge. The existing `calculateSalePrice` / `formatPrice`
  helpers in `src/hooks/useSiteConfig.js` already do the two-price display —
  reuse them rather than adding new logic.
- Add an `introOffer` block to `siteConfig.js`: `{ active, projectsRemaining,
  totalProjects, terms }`. Display the remaining count. Honor it.
- Set `payment.depositRequired: true`, `depositPercentage: 50`.
- Replace the per-tier `bulkPricing` arrays with one album rate (15% off 4+).
  Three separate expandable bulk tables is more UI than the decision warrants.
- **Keep the free sample mix.** It's a good qualifier and competitors use it too.
  Move it below the tiers rather than above them — right now it's the first thing
  in the pricing section, which undercuts the prices before they're read.

## P2 — Trust assets (the actual reason clients don't convert)

- **New `AboutSection` component**, placed directly after the hero. For a
  one-person service the person *is* the product, and Hunter is currently
  invisible. Needs: a real photo, where he's based, what he works on, gear/room,
  and the honest version of his experience. This is the highest-value new section
  on the site.
- **Credits/discography list** — for each portfolio entry, link the released
  track on Spotify/Apple/Bandcamp. Verifiable released credits are the single
  strongest trust signal in this market and cost nothing to add.
- **`Testimonials` component**, built but rendered only when there is real
  content. `siteConfig.js:58` already has `showTestimonials: true` with no
  component behind it — wire the flag to something real. Source the content from
  the intro-rate trade.
- **Named venues** in `LiveSoundSection.js`. "Concert Halls & Theaters" is
  generic and unfalsifiable; three real venue names are worth more than all six
  bullets.
- Grow the portfolio past 3 samples as the intro-rate projects land.

## P3 — Location and local SEO

- Replace `geo.placename: "United States"` and
  `business:contact_data:street_address: "Remote Services Available Worldwide"`
  in `public/index.html` with Bloomington-Normal, IL and a real `PostalAddress`
  (`addressLocality`, `addressRegion: "IL"`, `postalCode`). A `LocalBusiness`
  schema without an address is invalid as-is.
- Add `areaServed` covering Bloomington-Normal, Central Illinois, and the Chicago
  area — as a service radius for live sound, not as a second business location.
- Put the location in visible copy: header tagline or hero byline, plus the live
  sound section and the footer. Naming a city makes a *remote* engineer more
  credible, not less — "Worldwide" reads like a content farm.
- Rewrite the `<title>`, meta description, and OG/Twitter copy: they currently
  claim "3+ years" and lead with "$40", both of which are being retired.
- Drop the `keywords` meta tag (ignored by every major engine since ~2009).

### Off-site, not code — but this is where the local leads come from

- **Register a Google Business Profile** for Bloomington-Normal. Highest-ROI free
  channel available, and it needs the real address that P3 puts in the schema.
- **ISU and Illinois Wesleyan are both in Normal.** Two music schools and several
  thousand student musicians in the home market, with essentially no online
  competition for them. Worth targeted outreach (music dept. bulletin boards,
  student band Facebook/Discord groups, campus venue sound work) independent of
  anything on the website.
- Ask the three existing portfolio artists for testimonials now, before the intro
  offer even launches.

## P4 — Conversion plumbing

- **Add Blog to `NAV_ITEMS`** in `src/components/Header.js`. Seven solid posts are
  currently reachable only from the footer, which wastes the whole SEO asset.
- **Email capture** on blog posts and the blog index. Blog traffic currently has
  no path to becoming a lead. A single-field form posting to the existing
  `/api/contact` endpoint (with a `type` discriminator) avoids adding a service.
- Make the displayed email a real `mailto:` link in `ContactSection.js`. Some
  people will not use a form.
- Add a "typical turnaround / what happens next" line near the form. Reducing
  uncertainty at the point of contact is the cheapest conversion win available.
- Add an internal link from each blog post to the relevant service.

---

## Verification

Ordered so that a failure is caught before it compounds:

1. `npm run build` — must complete clean. Confirms the sitemap prebuild still
   runs and nothing referenced a removed export.
2. **Schema validation** — paste the built `index.html` into
   [validator.schema.org](https://validator.schema.org) and Google's Rich
   Results Test. Confirms the `LocalBusiness` address is valid and that no
   `aggregateRating` remains.
3. `grep -rn "gtag\|dataLayer\|G-0VX\|AW-719" src public/index.html` — must
   return nothing (or, if analytics is being kept, must not include `user_data`).
4. **Price consistency sweep** — `grep -rn '\$40\|\$75\|\$200'` across `src/` and
   `public/`. Prices appear in the pricing cards, the contact form `<select>`,
   the service agreement, the meta description, and three schema blocks; a stale
   figure in any of them is exactly the contradiction this plan is fixing.
5. `npm start` and walk the page on a phone-width viewport: hero → about →
   services → live sound → portfolio → pricing → contact. Click every CTA and
   confirm the pricing → contact-form service preselection still works (it moves
   through `sessionStorage`).
6. Submit the contact form against a real SMTP config and confirm delivery.
7. Re-read the live pricing copy once cold, asking only: *would I pay $250 for
   this?* If the About section and credits aren't carrying that, P2 isn't done.

## Open items / needs Hunter

- Photo of Hunter, studio room, and at least one FOH shot.
- Streaming links for the three existing portfolio tracks.
- Three venue or event names cleared for public use.
- Final call on years of experience, and on the canonical contact email.
- Whether the "5+ Years Live Sound" and "100+ Live Events" figures are accurate
  as written — they're load-bearing now that prices are going up.

## Deliberately not doing

- Splitting studio and live sound into separate sites or landing paths. Remote
  mixing is the chosen lead; one page with a clear secondary offer is right at
  this size.
- Any booking/calendar integration or payment processing on-site. The form plus a
  50% invoice is sufficient until volume justifies more.
- Chasing Chicago in local SEO. Saturated market, no real address there, and it
  would dilute the Bloomington ranking that's actually winnable.
