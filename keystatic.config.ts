import { config, fields, collection, singleton } from '@keystatic/core'

// Paths have NO trailing slash, so Keystatic writes flat files:
//   src/content/company.json
//   src/content/services/<slug>.json
// Astro imports those directly at build time.
export default config({
  storage: { kind: 'local' },

  ui: {
    brand: { name: 'XSpring' },
    navigation: {
      'Company profile': ['company'],
      'What we do': ['services'],
      'Design': ['appearance'],
    },
  },

  singletons: {
    company: singleton({
      label: 'Company profile',
      path: 'src/content/company',
      format: { data: 'json' },
      schema: {
        name: fields.text({
          label: 'Company name',
          validation: { length: { min: 1 } },
        }),
        tagline: fields.text({
          label: 'Tagline',
          description: 'One line under the company name in the hero.',
        }),
        intro: fields.text({
          label: 'Introduction',
          multiline: true,
          description: 'Two or three sentences on who you are.',
        }),
        stats: fields.array(
          fields.object({
            value: fields.text({ label: 'Value', description: 'e.g. "12+" or "98%"' }),
            label: fields.text({ label: 'Label', description: 'e.g. "Years in business"' }),
          }),
          {
            label: 'Key figures',
            description: 'Shown as the tile row under the hero. Three or four works best.',
            itemLabel: (props) => `${props.fields.value.value} — ${props.fields.label.value}`,
          }
        ),
        about: fields.text({
          label: 'About us',
          multiline: true,
        }),
        contact: fields.object(
          {
            email: fields.text({ label: 'Email' }),
            phone: fields.text({ label: 'Phone' }),
            address: fields.text({ label: 'Address', multiline: true }),
          },
          { label: 'Contact details' }
        ),
        links: fields.array(
          fields.object({
            label: fields.text({ label: 'Label' }),
            url: fields.url({ label: 'URL' }),
          }),
          {
            label: 'Links',
            itemLabel: (props) => props.fields.label.value || 'Link',
          }
        ),
      },
    }),

    appearance: singleton({
      label: 'Design',
      path: 'src/content/appearance',
      format: { data: 'json' },
      schema: {
        theme: fields.select({
          label: 'Theme',
          description:
            'Modern — teal, rounded corners. Corporate — blue, square corners, serif headings. Minimal — black and white, no colour.',
          defaultValue: 'modern',
          options: [
            { label: 'Modern', value: 'modern' },
            { label: 'Corporate', value: 'corporate' },
            { label: 'Minimal', value: 'minimal' },
          ],
        }),
        layout: fields.select({
          label: 'Layout',
          description:
            'Grid — services in three columns. Centred — everything centred, services in two columns. List — services as full-width rows.',
          defaultValue: 'grid',
          options: [
            { label: 'Grid', value: 'grid' },
            { label: 'Centred', value: 'centred' },
            { label: 'List', value: 'list' },
          ],
        }),

        // Everything below is hidden until the box is ticked, so the everyday
        // screen stays down to two questions.
        advanced: fields.conditional(
          fields.checkbox({
            label: 'Show advanced options',
            description: 'Leave this off unless you specifically want to change something here.',
            defaultValue: false,
          }),
          {
            false: fields.empty(),
            true: fields.object(
              {
                accent: fields.select({
                  label: 'Accent colour',
                  description:
                    'Overrides the theme colour. Every option here has been checked for readability in both light and dark mode.',
                  defaultValue: 'theme',
                  options: [
                    { label: 'Theme default', value: 'theme' },
                    { label: 'Teal', value: 'teal' },
                    { label: 'Blue', value: 'blue' },
                    { label: 'Violet', value: 'violet' },
                    { label: 'Green', value: 'green' },
                    { label: 'Amber', value: 'amber' },
                    { label: 'Rose', value: 'rose' },
                  ],
                }),
                width: fields.select({
                  label: 'Page width',
                  description: 'How wide the content runs on a large screen.',
                  defaultValue: 'normal',
                  options: [
                    { label: 'Narrow', value: 'narrow' },
                    { label: 'Normal', value: 'normal' },
                    { label: 'Wide', value: 'wide' },
                  ],
                }),
                heroStyle: fields.select({
                  label: 'Top of the page',
                  description: 'Whether a soft wash of the accent colour sits behind the title.',
                  defaultValue: 'glow',
                  options: [
                    { label: 'Colour wash', value: 'glow' },
                    { label: 'Plain', value: 'flat' },
                  ],
                }),
                cardStyle: fields.select({
                  label: 'Service card style',
                  defaultValue: 'bordered',
                  options: [
                    { label: 'Bordered box', value: 'bordered' },
                    { label: 'Filled panel', value: 'filled' },
                    { label: 'No box, just text', value: 'plain' },
                  ],
                }),
                showStats: fields.checkbox({
                  label: 'Show the key figures row',
                  defaultValue: true,
                }),
                showAbout: fields.checkbox({
                  label: 'Show the about section',
                  defaultValue: true,
                }),
                showContact: fields.checkbox({
                  label: 'Show the contact section',
                  defaultValue: true,
                }),
              },
              { label: 'Advanced' }
            ),
          }
        ),
      },
    }),
  },

  collections: {
    services: collection({
      label: 'Services',
      slugField: 'title',
      path: 'src/content/services/*',
      format: { data: 'json' },
      columns: ['title'],
      schema: {
        title: fields.slug({
          name: {
            label: 'Service name',
            validation: { length: { min: 1 } },
          },
        }),
        icon: fields.select({
          label: 'Icon',
          options: [
            { label: 'Chart / analytics', value: 'chart' },
            { label: 'Code / development', value: 'code' },
            { label: 'Cloud / infrastructure', value: 'cloud' },
            { label: 'Shield / security', value: 'shield' },
            { label: 'Spark / consulting', value: 'spark' },
            { label: 'Layers / integration', value: 'layers' },
          ],
          defaultValue: 'spark',
        }),
        summary: fields.text({
          label: 'Summary',
          multiline: true,
          description: 'One short paragraph shown on the service card.',
        }),
        highlights: fields.array(fields.text({ label: 'Highlight' }), {
          label: 'Highlights',
          description: 'Short bullet points listed under the summary.',
          itemLabel: (props) => props.value || 'Highlight',
        }),
        order: fields.integer({
          label: 'Sort order',
          description: 'Lower numbers appear first.',
          defaultValue: 10,
        }),
      },
    }),
  },
})
