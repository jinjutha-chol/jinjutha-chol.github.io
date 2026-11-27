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
  // Served from the project repo's Pages URL:
  // https://sahatsawatt-a.github.io/XSpring_Dash/
  site: 'https://sahatsawatt-a.github.io',
  base: '/XSpring_Dash',

  output: 'static',

  integrations: [react(), ...(skipKeystatic ? [] : [keystatic()])],
})
