/* The logo in the top-left of the editor. Admin-only: production builds drop
   the Keystatic integration, so none of this reaches the published site. */
export function BrandMark({ colorScheme }: { colorScheme: 'light' | 'dark' }) {
  // Matches the mark in the site header, using each mode's validated accent.
  const fill = colorScheme === 'dark' ? '#2dd4bf' : '#00695c'
  const ink = colorScheme === 'dark' ? '#0d0d0d' : '#ffffff'
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" role="img" aria-label="XSpring">
      <rect width="24" height="24" rx="6" fill={fill} />
      <path
        d="M8 8l8 8M16 8l-8 8"
        stroke={ink}
        strokeWidth="2.25"
        strokeLinecap="round"
      />
    </svg>
  )
}
