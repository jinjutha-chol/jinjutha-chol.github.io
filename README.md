# XSpring — company site

A company introduction and services page. Content is edited in a local admin
console, then published to GitHub Pages as a static site with one click.

**Astro** (static site) + **Keystatic** (admin console) + **GitHub Actions** (publishing).

---

# For whoever edits the content

You do not need to know any code. There are two steps.

### 1. Edit

Double-click **Edit Website** on the Desktop.

A browser tab opens with the admin console. Two sections in the sidebar:

| Section | What you can change |
|---|---|
| **Company profile** | Company name, tagline, introduction, key figures, about text, contact details, footer links |
| **Services** | The service cards — add, remove, reorder, or edit any of them |
| **Design** | The theme (colours) and layout (arrangement) of the page |

### Changing how the site looks

Open **Design**. There are two questions:

- **Theme** — Modern (teal, rounded), Corporate (blue, square, serif headings),
  or Minimal (black and white).
- **Layout** — Grid (services in three columns), Centred (everything centred,
  two columns), or List (services as full-width rows).

Any theme works with any layout, and all nine combinations have been checked in
both light and dark mode.

Below those is a **Show advanced options** box. Leave it unticked — the site
works perfectly without it. Ticking it reveals accent colour, page width, the
style of the top of the page, service card style, and switches to hide the key
figures, about or contact sections.

Fill in the boxes and press **Save** (top right). Saving stores the change on
this computer — the live website has not changed yet.

Every box has a line of grey help text under its label saying what it does and
roughly how long it should be. The **↗** button in the top right opens the real
page so you can see your change.

One box is worth ignoring: **Short name (filled in for you)** on a service. It
fills itself in from the service name and nothing on the page uses it.

### 2. Publish

When you're happy, double-click **Publish Website** on the Desktop.

It checks the site still works, then puts your changes online. The live site
updates a minute or two later.

If something is wrong it tells you and publishes nothing, so a mistake cannot
take the site down.

### If something looks wrong

Every publish is saved separately, so any change can be undone. Ask whoever set
the site up — nothing is ever lost.

---

# For whoever set this up

## How it works

```
./start-editor.sh   →  admin console at /keystatic  →  writes JSON in src/content/
                                                              ↓
./publish.sh        →  build check  →  commit  →  push
                                                              ↓
                              GitHub Action builds → GitHub Pages
```

The admin console runs **only on that machine**. It needs a server to write files,
and GitHub Pages serves static files only — so the published site has no console
and no admin route. That is intentional.

Every publish is an ordinary commit, so content has full history and any change
can be undone with `git revert`.

## Commands

| Command | Does |
|---|---|
| `npm start` | Start the admin console and open it (same as the Desktop icon) |
| `npm run publish` | Build check, commit and push (same as the Desktop icon) |
| `npm run dev` | Dev server with the console at `/keystatic` |
| `npm run build` | Production build to `dist/` — static, no console |
| `npm run preview` | Serve the built `dist/` to check it before publishing |
| `npx astro dev stop` | Stop the console's dev server |

`build` and `preview` set `SKIP_KEYSTATIC=true`, which drops the console's
server-rendered routes. Without it the build fails, because those routes cannot
be prerendered.

## First-time setup

1. **Create the repo** as `<owner>.github.io` under the company account. The
   default branch must be **`main`** — the deploy workflow triggers on it.

2. **Set the site URL.** In `astro.config.mjs`, replace the placeholder:

   ```js
   site: 'https://XSPRING-OWNER.github.io',
   ```

   This only affects canonical URLs and social metadata — assets work regardless.

3. **Connect the repo and push:**

   ```bash
   git remote add origin git@github.com:<owner>/<owner>.github.io.git
   git push -u origin main
   ```

4. **Turn on Pages.** Repo → Settings → Pages → **Source: GitHub Actions**.
   (Not "Deploy from a branch" — this project builds via the workflow.)

5. **Set up the editor's machine.** Install Node.js, clone the repo, make sure
   `git push` works without a password prompt (SSH key or credential helper —
   otherwise Publish will fail), then run:

   ```bash
   ./make-launchers.sh
   ```

   That puts the two Desktop icons in place. Run it once, on their machine.

### Using a different repo name

A repo named something other than `<owner>.github.io` is served from a subpath,
so add a matching `base` in `astro.config.mjs` or every asset 404s:

```js
site: 'https://<owner>.github.io',
base: '/<repo-name>/',
```

### Using a custom domain

Add a `public/CNAME` file containing just the domain, set the domain under
Settings → Pages, and set `site` to `https://your-domain.com`.

## Project layout

```
start-editor.sh         Starts the admin console and opens it
publish.sh              Build check, then commit and push
make-launchers.sh       Creates the two Desktop icons (run once, per machine)

astro.config.mjs        Astro config; gates the console out of production builds
keystatic.config.ts     The content model — what fields the console shows
src/content/            Content, written by the console. Editable by hand too.
src/content/appearance.json  Theme, layout and the advanced settings
src/lib/appearance.ts   Resolves those settings, filling in advanced defaults
src/styles/themes.css   The three themes — light and dark steps for each
src/styles/accents.css  The optional accent presets
src/pages/index.astro   The page; reads the content and lays it out
src/components/         StatTile, ServiceCard, ServiceIcon
src/layouts/Base.astro  Head, header, footer
src/styles/global.css   Design tokens (light + dark) and base styles
.github/workflows/      The Pages deploy workflow
```

## Adding a field to the console

Content is typed by the schema, so a new field is two edits:

1. Add it to the relevant schema in `keystatic.config.ts` — it appears in the
   console immediately, with its label and description.
2. Render it in `src/pages/index.astro` (or a component).

Give every field a `label` and a `description`. The description is the help text
under the input, and it is the main thing that makes the console self-explanatory
to someone who doesn't know the site.

## Notes

- The page ships **zero JavaScript**. React is installed only because the console
  needs it in dev; the built page references no script.
- Light and dark both follow the OS setting. Every theme and accent preset has
  its own separately chosen dark steps — never derive one by inverting the
  other. Before adding a theme or preset, run the palette validator and a
  contrast check on both modes; the comments in `themes.css` and `accents.css`
  say what has to pass.
- The advanced defaults in `src/lib/appearance.ts` must match the `defaultValue`
  of each advanced field in `keystatic.config.ts`. If they drift, ticking
  "Show advanced options" would silently change the design.
- All current copy is **placeholder**. Replace it in the console.
