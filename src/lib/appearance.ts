import raw from '../content/appearance.json'

/* Keystatic stores a conditional field as { discriminant, value }, and `value`
   is null whenever the "Show advanced options" box is off. These defaults are
   what the site uses in that case, and they must match the defaultValue of each
   advanced field in keystatic.config.ts — otherwise ticking the box would
   silently change the design. */
const ADVANCED_DEFAULTS = {
  accent: 'theme',
  width: 'normal',
  heroStyle: 'glow',
  cardStyle: 'bordered',
  showContact: true,
} as const

export type Layout = 'grid' | 'centred' | 'list'

export type Appearance = {
  theme: string
  layout: Layout
  accent: string
  width: string
  heroStyle: string
  cardStyle: string
  showContact: boolean
}

const advanced = raw.advanced as { discriminant: boolean; value: unknown }

export const appearance: Appearance = {
  theme: raw.theme || 'modern',
  layout: (raw.layout || 'grid') as Layout,
  ...ADVANCED_DEFAULTS,
  ...(advanced?.discriminant && advanced.value ? (advanced.value as object) : {}),
}

/* `data-accent` is only emitted when it actually overrides the theme, so the
   theme's own accent applies when nothing is chosen. */
export const accentAttr = appearance.accent === 'theme' ? undefined : appearance.accent
