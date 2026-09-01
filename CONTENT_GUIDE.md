# Content Guide

This site's branding, sectors, and services are filled in for **XSPRING
Capital**. What's still placeholder — marked with `[brackets]` or an
`<!-- EDIT -->` comment — is the hero tagline, per-sector notes, per-service
past experience / value-add, and all contact details. No code changes are
needed; just edit text inside the HTML files below.

## Files

```
index.html                                   Home page: Overview, Services, Contact
services/asset-backed-bridge-finance.html    Detail page
services/acquisition-investment-finance.html Detail page
services/project-completion-value-add-finance.html  Detail page
services/share-backed-finance.html           Detail page
services/invoice-receivables-finance.html    Detail page
services/inventory-finance.html              Detail page
services/co-lending-opportunity.html         Detail page
services/ma-advisory.html                    Detail page
services/valuation-services.html             Detail page (range still placeholder)
assets/css/style.css                         All styling (colors, fonts, spacing)
assets/js/main.js                            Mobile nav toggle behavior
```

## 1. Company name & branding

- Company name is set to "XSPRING Capital" in the nav, page titles, and
  footers across all pages — search and replace if it changes.
- `index.html` hero section: still has `[One-line tagline goes here]` and a
  bracketed description — replace with your real positioning statement.
- Colors/fonts: edit the CSS variables at the top of
  `assets/css/style.css` under `:root { ... }` (e.g. `--color-primary`,
  `--color-accent`).

## 2. Overview section (sectors) — `index.html`

Find `SECTION 1: COMPANY OVERVIEW`. Sectors are already set to Manufacturing,
Consumer Brands, Real Estate, Aviation, Logistics, SMEs. Each is one
`.sector-card` block:

```html
<div class="card sector-card">
  <div class="sector-icon">01</div>
  <h3>Manufacturing</h3>
  <p>[Optional one-line note about your work in this sector.]</p>
</div>
```

- Replace or delete the `<p>` note with a real line about your work there.
- Copy/paste the whole `.sector-card` block to add more sectors, or delete
  blocks you don't need. The grid automatically re-flows for any number of
  cards.

## 3. Services section — `index.html` + `services/*.html`

Each of the 9 services has **two** places tied together by the `href` /
filename:

**a) The card on the home page** (`SECTION 2: SERVICES` in `index.html`):

```html
<a class="card service-card" href="services/asset-backed-bridge-finance.html">
  <h3>Asset-Backed Bridge Finance</h3>
  <p>Short-term secured financing collateralized by company assets...</p>
  <div class="tag-row"><span class="tag">Thailand</span><span class="tag tag-accent">Debt Financing</span></div>
  <span class="range">USD 5mn &ndash; USD 20mn</span>
  <span class="service-link">View details</span>
</a>
```

- `<h3>` / `<p>`: name and brief description — already filled in, edit the
  wording as you like.
- `.tag-row`: region/category pills. Use class `tag` for a neutral pill or
  `tag tag-accent` for a highlighted one (used for "Debt Financing" / "M&A").
  Add, remove, or retag as needed.
- `.range`: the headline deal-size range shown on the card.

**b) The detail page** (e.g. `services/asset-backed-bridge-finance.html`):

- `<h1>` and hero paragraph + `.tag-row`: service name, description, and the
  same tags as the card.
- **Past Experience** (`<!-- EDIT -->` comment above it): replace the three
  `<li>` items in `.experience-list` with real past engagements (sector,
  outcome, year). Add/remove `<li>` items as needed.
- **Transaction Size Range**: text inside `.stat-highlight`. All services
  have a real range filled in except `valuation-services.html`, which is
  still `[e.g. $X million – $Y million]`.
- **Value We Add** (`<!-- EDIT -->` comment above it): replace the three
  `<li>` items in `.value-list` (each has a bold title + short description)
  with your firm's real differentiators for that service.

### Adding or removing a service

- To add a 10th service: copy an existing file in `services/` to a new
  `services/your-service-slug.html`, edit its content, then add a matching
  `.service-card` link in `index.html` pointing to that file.
- To remove a service: delete its `.service-card` block from `index.html`
  and delete the corresponding file in `services/`.

## 4. Contact section — `index.html`

Find `SECTION 3: CONTACT`. Still placeholder — replace:

- Email address (appears twice: the contact card and the `mailto:` link).
- Phone number.
- Address.
- Social links (`href="#"`) with real LinkedIn/Twitter/etc. URLs.

## Publishing

This is a static site (no build step). Once content is filled in, commit and
push — if GitHub Pages is enabled for this repository (Settings → Pages),
the site will be live automatically at the repository's Pages URL.
