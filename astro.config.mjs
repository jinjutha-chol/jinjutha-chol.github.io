// @ts-check
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import keystatic from '@keystatic/astro'

// The Keystatic admin UI needs server-rendered API routes, which GitHub Pages
// cannot run. `npm run build` sets SKIP_KEYSTATIC=true so the production build
// drops those routes and emits a fully static site. `npm run dev` leaves it
// unset, so the editor is available at http://localhost:4321/keystatic
const skipKeystatic = process.env.SKIP_KEYSTATIC === 'true'

export default defineConfig({
  // The deploy workflow sets PAGES_SITE / PAGES_BASE from the repo it runs in:
  //   <owner>.github.io repo -> https://<owner>.github.io/        (base '/')
  //   any other repo         -> https://<owner>.github.io/<repo>/ (base '/<repo>')
  // The defaults keep local builds matching the original project repo.
  site: process.env.PAGES_SITE || 'https://sahatsawatt-a.github.io',
  base: process.env.PAGES_BASE || '/XSpring_Dash',

  output: 'static',

  integrations: [react(), ...(skipKeystatic ? [] : [keystatic()])],
})
