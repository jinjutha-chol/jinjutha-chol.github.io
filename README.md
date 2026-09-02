# XSpring — company site

A company introduction and services page. Content is edited locally through a
browser UI, saved into this repo as JSON, then built into a fully static site and
published to GitHub Pages.

**Astro** (static site) + **Keystatic** (local content editor) + **GitHub Actions**.

---

## How the editing loop works

```
npm run dev  →  edit at /keystatic  →  saves JSON into src/content/
                                              ↓
                                    git commit && git push
                                              ↓
                              GitHub Action builds → GitHub Pages
```

The editor runs **only on your machine**. It needs a server to write files, and
GitHub Pages serves static files only — so the published site has no editor and no
admin route. That is intentional, not a limitation to work around.

Every content change is a normal commit, so you get full history and can roll back
any edit with `git revert`.

---

## Editing content

```bash
npm install          # first time only
npm run dev
```

Then open **<http://localhost:4321/keystatic>**.

| Screen | Edits | Writes to |
|---|---|---|
| Company profile | name, tagline, intro, key figures, about, contact, links | `src/content/company.json` |
| Services | one entry per service | `src/content/services/<slug>.json` |

The site itself previews at <http://localhost:4321> and reloads as you save.

When you're happy:

```bash
git add -A
git commit -m "Update services copy"
git push
```

The Action deploys within a minute or two. Watch it under the repo's **Actions** tab.

---

## Commands

| Command | Does |
|---|---|
| `npm run dev` | Dev server **with** the Keystatic editor at `/keystatic` |
| `npm run build` | Production build to `dist/` — static, no editor |
| `npm run preview` | Serve the built `dist/` locally to check it before pushing |

`build` and `preview` set `SKIP_KEYSTATIC=true`, which drops the editor's
server-rendered routes. Without it the build would fail, because those routes
cannot be prerendered.

---

## First-time setup

1. **Create the repo** as `<owner>.github.io` under the company account and push
   this project to the `main` branch.

2. **Set the site URL.** In `astro.config.mjs`, replace the placeholder:

   ```js
   site: 'https://XSPRING-OWNER.github.io',
   ```

   This only affects canonical URLs and social metadata — assets work regardless.

3. **Turn on Pages.** Repo → Settings → Pages → **Source: GitHub Actions**.
   (Not "Deploy from a branch" — this project builds via the workflow.)

4. Push to `main`. The site goes live at `https://<owner>.github.io`.

### Using a different repo name

A repo named something other than `<owner>.github.io` is served from a subpath, so
add a matching `base` in `astro.config.mjs` or every asset 404s:

```js
site: 'https://<owner>.github.io',
base: '/<repo-name>/',
```

### Using a custom domain

Add a `public/CNAME` file containing just the domain, set the domain under
Settings → Pages, and set `site` to `https://your-domain.com`.

---

## Project layout

```
astro.config.mjs        Astro config; gates Keystatic out of production builds
keystatic.config.ts     The content model — what fields the editor shows
src/content/            Content, written by Keystatic. Edit here or in the UI.
src/pages/index.astro   The page; reads the content and lays it out
src/components/         StatTile, ServiceCard, ServiceIcon
src/layouts/Base.astro  Head, header, footer
src/styles/global.css   Design tokens (light + dark) and base styles
.github/workflows/      The Pages deploy workflow
```

## Adding a content field

Content is typed by the schema, so a new field is two edits:

1. Add it to the relevant schema in `keystatic.config.ts` — it appears in the
   editor immediately.
2. Render it in `src/pages/index.astro` (or a component).

## Notes

- The page ships **zero JavaScript**. React is installed only because Keystatic's
  editor needs it in dev; the built page references no script.
- Light and dark themes both follow the OS setting. The two accent steps were
  picked separately per theme and contrast-checked — don't derive one by
  inverting the other.
- All current copy is **placeholder**. Replace it in the editor.
