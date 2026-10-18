# XSpring — company site

A company introduction and services page. Content is edited in a local admin
console, then published to GitHub Pages as a static site with one click.

**Astro** (static site) + **Keystatic** (admin console) + **GitHub Actions** (publishing).

This README has two parts: **[editing content](#for-whoever-edits-the-content)**
(no code needed) and **[running/deploying the project](#for-whoever-set-this-up)**
(for whoever set it up).

---

## For whoever edits the content

You do not need to know any code. There are two steps: **edit**, then **publish**.

### 1. Edit

Double-click **Edit Website** on the Desktop. A browser tab opens with the
admin console. The sidebar is grouped like this:

**Introduction**
- **Company profile** — name, tagline, introduction, contact details, footer links
- **Who we are** — the brief block near the top: heading, description, and the three points beside it

**Offerings**
- **Offering boxes** — the three boxes (Private Equity / Private Lending / Funds): their titles, taglines, and which one is shown larger
- **Services** — the cards under Private Lending Solutions *and* the two under "No Capital Needed Now". Each card's **Which section** field decides where it appears, and opens a pop-up with the full description, regional coverage, and past deals
- **Private Equity section** — the "what it is" text, plus the current-segments and target-segments lists
- **Funds Investments section** — the "what it is" text
- **"No Capital Needed Now" section** — its heading and intro line (the two cards below it live under **Services**)

**How it looks**
- **Design** — the theme (colours) and layout (arrangement) of the page

Fill in the boxes and press **Save** (top right). Saving stores the change on
this computer — the live website has not changed yet. Every box has a line of
grey help text under its label saying what it does. The **↗** button in the
top right opens the real page so you can see your change.

> One box is worth ignoring: **Short name (filled in for you)** on a service.
> It fills itself in from the service name and nothing on the page uses it.

**Pop-up pages.** Clicking a **Service** card opens a panel over a dimmed view
of the page — a shareable link (the address ends in `#svc-…`), closed with the
**×**, the backdrop, or the browser Back button. Fields marked "(pop-up)" in
the console only show there, not on the card; leave one empty and the panel
just falls back to the summary.

**Changing how the site looks.** Open **Design**. Two questions — **Theme**
(Modern/spring green, Corporate/blue, or Minimal/black-and-white) and
**Layout** (Grid, Centred, or List). Any theme works with any layout. A
**Show advanced options** box underneath is safe to leave unticked; ticking it
reveals accent colour, page width, card style, and a switch to hide the
contact section.

### 2. Publish

Double-click **Publish Website** on the Desktop. It checks the site still
works, then puts your changes online — live a minute or two later. If
something is wrong it tells you and publishes nothing, so a mistake can't take
the site down.

**If something looks wrong:** every publish is saved separately, so any change
can be undone. Ask whoever set the site up — nothing is ever lost.

---

## For whoever set this up

### How it works

```
./start-editor.sh  →  admin console at /keystatic  →  writes JSON in src/content/
                                                             ↓
./publish.sh  →  build check  →  commit  →  push
                                                             ↓
                             GitHub Action builds  →  GitHub Pages
```

The admin console runs **only on that machine** — it needs a server to write
files, and GitHub Pages serves static files only, so the published site has no
console and no admin route. That's intentional. Every publish is an ordinary
commit, so content has full history and any change can be undone with
`git revert`.

### Commands

| Command | Does |
|---|---|
| `npm start` | Start the admin console and open it (same as the Desktop icon) |
| `npm run publish` | Build check, commit and push (same as the Desktop icon) |
| `npm run dev` | Dev server with the console at `/keystatic` |
| `npm run build` | Production build to `dist/` — static, no console |
| `npm run preview` | Serve the built `dist/` to check it before publishing |
| `npx astro dev stop` | Stop the console's dev server |

`build` and `preview` set `SKIP_KEYSTATIC=true`, which drops the console's
server-rendered routes — without it the build fails, because those routes
can't be prerendered.

<details>
<summary><strong>Starting manually on Windows (PowerShell, no Desktop icon)</strong></summary>

`start-editor.sh` is a bash script, so it only runs from Git Bash — not a
plain PowerShell window. If Node also isn't on `PATH` (e.g. installed
user-locally via [fnm](https://github.com/Schniz/fnm) instead of the system
installer), start the dev server by hand:

```powershell
# Put Node on PATH for this window (adjust the version to match your install)
$env:PATH = "$env:APPDATA\fnm\node-versions\v24.20.0\installation;" + $env:PATH

cd path\to\XSpring_Dash
npx astro dev --host 127.0.0.1
```

Then open the editor at `http://localhost:4321/keystatic` and the preview at
`http://localhost:4321`. The command runs `astro dev` as a background-ish
daemon (it prints a PID and returns), so the window stays usable. Stop it
later, from the project folder with Node still on `PATH`, with
`npx astro dev stop`.

If `node -v` / `npm -v` don't resolve at all, Node isn't installed — either
run the system installer (`winget install OpenJS.NodeJS.LTS`, needs admin) or
install [fnm](https://github.com/Schniz/fnm) (`winget install Schniz.fnm`, no
admin needed) and `fnm install --lts`.

</details>

### First-time setup

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
   otherwise Publish will fail), then run `./make-launchers.sh` once. That
   puts the two Desktop icons in place.

<details>
<summary>Using a different repo name</summary>

A repo named something other than `<owner>.github.io` is served from a
subpath, so add a matching `base` in `astro.config.mjs` or every asset 404s:

```js
site: 'https://<owner>.github.io',
base: '/<repo-name>/',
```

</details>

<details>
<summary>Using a custom domain</summary>

Add a `public/CNAME` file containing just the domain, set the domain under
Settings → Pages, and set `site` to `https://your-domain.com`.

</details>

### Project layout

```
start-editor.sh                    Starts the admin console and opens it
publish.sh                         Build check, then commit and push
make-launchers.sh                  Creates the two Desktop icons (run once, per machine)

astro.config.mjs                   Astro config; gates the console out of production builds
keystatic.config.ts                The content model — what fields the console shows

src/content/                       Content, written by the console. Editable by hand too.
  company.json                       Company profile
  who-we-are.json                    "Who we are" block
  pillars.json                       The three offering boxes + which is emphasised
  private-equity.json                Private Equity section (intro + segment lists)
  funds.json                         Funds Investments section (intro)
  advisory.json                      "No Capital Needed Now" heading + intro
  appearance.json                    Theme, layout and the advanced settings
  services/                          Services; `section` = lending | advisory. File name is the slug / pop-up id

src/lib/appearance.ts              Resolves appearance settings, filling in advanced defaults
src/pages/index.astro              The page; reads the content and lays it out
src/layouts/Base.astro             Head, header, footer
src/components/                    ServiceCard, ServiceIcon, DetailOverlay (the pop-up panel, hash-addressed, no JS)
src/styles/themes.css              The three themes — light and dark steps for each
src/styles/accents.css             The optional accent presets
src/styles/global.css              Design tokens (light + dark) and base styles

.github/workflows/                 The Pages deploy workflow
```

### Adding a field to the console

Content is typed by the schema, so a new field is two edits:

1. Add it to the relevant schema in `keystatic.config.ts` — it appears in the
   console immediately, with its label and description.
2. Render it in `src/pages/index.astro` (or a component).

Give every field a `label` and a `description`. The description is the help
text under the input, and it's the main thing that makes the console
self-explanatory to someone who doesn't know the site.

### Notes

- The page ships **zero JavaScript**. React is installed only because the
  console needs it in dev; the built page references no script.
- Light and dark both follow the OS setting. Every theme and accent preset has
  its own separately chosen dark steps — never derive one by inverting the
  other. Before adding a theme or preset, run the palette validator and a
  contrast check on both modes; the comments in `themes.css` and `accents.css`
  say what has to pass.
- The advanced defaults in `src/lib/appearance.ts` must match the
  `defaultValue` of each advanced field in `keystatic.config.ts`. If they
  drift, ticking "Show advanced options" would silently change the design.
- All current copy is **placeholder**. Replace it in the console.
