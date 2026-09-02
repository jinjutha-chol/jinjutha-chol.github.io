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
  // CHANGE ME: the GitHub org/user that owns the <owner>.github.io repo.
  // Only affects canonical URLs and sitemaps, not asset paths.
  site: 'https://XSPRING-OWNER.github.io',

  // Root-path deploy (<owner>.github.io), so no `base` is needed.
  output: 'static',

  integrations: [react(), ...(skipKeystatic ? [] : [keystatic()])],
})
