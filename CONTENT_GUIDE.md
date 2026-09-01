# Content Guide

This site is a working template. Every bracketed value like `[COMPANY NAME]` is
placeholder text — find and replace it with real content. No code changes are
needed to fill in content; just edit text inside the HTML files below.

## Files

```
index.html                 Home page: Overview, Services, Contact sections
services/service-1.html    Detail page for Service 1
services/service-2.html    Detail page for Service 2
services/service-3.html    Detail page for Service 3
assets/css/style.css       All styling (colors, fonts, spacing)
assets/js/main.js          Mobile nav toggle behavior
```

## 1. Company name & branding

- `index.html` and every file in `services/`: replace `[COMPANY NAME]` (nav
  logo, page `<title>`) and `[Company Name]` (footer, headings).
- `index.html` hero section: replace the tagline and description text.
- Colors/fonts: edit the CSS variables at the top of
  `assets/css/style.css` under `:root { ... }` (e.g. `--color-primary`,
  `--color-accent`).

## 2. Overview section (sectors) — `index.html`

Find `SECTION 1: COMPANY OVERVIEW`. Each sector is one `.sector-card` block:

```html
<div class="card sector-card">
  <div class="sector-icon">01</div>
  <h3>[Sector 1 – e.g. Healthcare]</h3>
  <p>[Optional one-line note about your work in this sector.]</p>
</div>
```

- Replace the `<h3>` text with the real sector name.
- Replace or delete the `<p>` note.
- Copy/paste the whole `.sector-card` block to add more sectors, or delete
  blocks you don't need. The grid automatically re-flows for any number of
  cards.

## 3. Services section — `index.html` + `services/*.html`

Each service has **two** places to edit:

**a) The card on the home page** (`SECTION 2: SERVICES` in `index.html`):

```html
<a class="card service-card" href="services/service-1.html">
  <h3>[Service Name 1]</h3>
  <p>[Brief 1–2 sentence description of this service.]</p>
  <span class="service-link">View details</span>
</a>
```

Replace the service name and brief description. The `href` must point to that
service's detail page.

**b) The detail page** (`services/service-1.html`, etc.):

- `<h1>` and hero paragraph: service name + expanded description.
- **Past Experience**: replace the three `<li>` items in
  `.experience-list` with real past engagements (sector, outcome, year).
  Add/remove `<li>` items as needed.
- **Transaction Size Range**: replace the text inside `.stat-highlight`
  (e.g. `$5 million – $50 million`).
- **Value We Add**: replace the three `<li>` items in `.value-list`
  (each has a bold title + short description). Add/remove as needed.

### Adding or removing a service

- To add a 4th service: copy `services/service-1.html` to
  `services/service-4.html`, edit its content, then add a matching
  `.service-card` link in `index.html` pointing to `services/service-4.html`.
- To remove a service: delete its `.service-card` block from `index.html`
  and delete the corresponding file in `services/`.

## 4. Contact section — `index.html`

Find `SECTION 3: CONTACT`. Replace:

- Email address (appears twice: the contact card and the `mailto:` link).
- Phone number.
- Address.
- Social links (`href="#"`) with real LinkedIn/Twitter/etc. URLs.

## Publishing

This is a static site (no build step). Once content is filled in, commit and
push — if GitHub Pages is enabled for this repository (Settings → Pages),
the site will be live automatically at the repository's Pages URL.
