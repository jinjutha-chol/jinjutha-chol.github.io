import { config, fields, collection, singleton } from '@keystatic/core'
import { BrandMark } from './src/keystatic/BrandMark'

// Paths have NO trailing slash, so Keystatic writes flat files:
//   src/content/company.json
//   src/content/services/<slug>.json
// Astro imports those directly at build time.
export default config({
  storage: { kind: 'local' },

  ui: {
    brand: { name: 'XSpring website', mark: BrandMark },
    navigation: {
      'Your content': ['company', 'services'],
      'How it looks': ['appearance'],
    },
  },

  singletons: {
    company: singleton({
      label: 'Company profile',
      path: 'src/content/company',
      format: { data: 'json' },
      // Adds a "Preview" link to the running local site.
      previewUrl: 'http://localhost:4321',
      schema: {
        name: fields.text({
          label: 'Company name',
          validation: { length: { min: 1 } },
        }),
        tagline: fields.text({
          label: 'Tagline',
          description: 'The small line shown above the company name at the top of the page.',
        }),
        intro: fields.text({
          label: 'Introduction',
          multiline: true,
          description: 'Two or three sentences on who you are. Shown under the company name.',
        }),
        stats: fields.array(
          fields.object({
            value: fields.text({
              label: 'Figure',
              description: 'Keep it short — 12+, 98%, 24/7',
            }),
            label: fields.text({
              label: 'What it means',
              description: 'A few words — Years in business',
            }),
          }),
          {
            label: 'Key figures',
            description:
              'The row of boxes under the introduction. Four fits neatly across.',
            itemLabel: (props) => `${props.fields.value.value} — ${props.fields.label.value}`,
          }
        ),
        about: fields.text({
          label: 'About us',
          multiline: true,
          description:
            'The longer description further down the page. Leave a blank line between paragraphs.',
        }),
        contact: fields.object(
          {
            email: fields.text({ label: 'Email', description: 'hello@example.com' }),
            phone: fields.text({ label: 'Phone', description: '+66 2 000 0000' }),
            address: fields.text({
              label: 'Office',
              multiline: true,
              description: 'Shown at the bottom of the page.',
            }),
          },
          // 12-column grid: email and phone share a row, address takes its own.
          { label: 'Contact details', layout: [6, 6, 12] }
        ),
        links: fields.array(
          fields.object(
            {
              label: fields.text({ label: 'Link text', description: 'e.g. LinkedIn' }),
              url: fields.url({ label: 'Address', description: 'Starts with https://' }),
            },
            { layout: [5, 7] }
          ),
          {
            label: 'Footer links',
            description: 'Optional. Shown at the very bottom of the page.',
            itemLabel: (props) => props.fields.label.value || 'Link',
          }
        ),
      },
    }),

    appearance: singleton({
      label: 'Design',
      path: 'src/content/appearance',
      format: { data: 'json' },
      previewUrl: 'http://localhost:4321',
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
      // Services share one page, so preview jumps to that section.
      previewUrl: 'http://localhost:4321/#services',
      columns: ['title', 'order'],
      schema: {
        title: fields.slug({
          name: {
            label: 'Service name',
            description: 'The heading on the card. Keep it short.',
            validation: { length: { min: 1 } },
          },
          // Keystatic always shows this second box. Relabelled in plain words
          // so it reads as housekeeping rather than something to worry about.
          slug: {
            label: 'Short name (filled in for you)',
            description:
              'Taken from the service name and used to file this service away. You can leave it alone.',
          },
        }),
        icon: fields.select({
          label: 'Icon',
          description: 'The small symbol above the heading.',
          // Named for what the service IS, not what the picture looks like.
          options: [
            { label: 'Software', value: 'code' },
            { label: 'Cloud', value: 'cloud' },
            { label: 'Analytics', value: 'chart' },
            { label: 'Security', value: 'shield' },
            { label: 'Integration', value: 'layers' },
            { label: 'Consulting', value: 'spark' },
          ],
          defaultValue: 'spark',
        }),
        summary: fields.text({
          label: 'Summary',
          multiline: true,
          description: 'One short paragraph under the heading. Around 25 words.',
        }),
        highlights: fields.array(fields.text({ label: 'Highlight' }), {
          label: 'Highlights',
          description: 'Short bullet points. Three is ideal.',
          itemLabel: (props) => props.value || 'Highlight',
        }),
        order: fields.integer({
          label: 'Position on the page',
          description: 'Lower numbers appear first. Drag is not supported here, so use 10, 20, 30 to leave room in between.',
          defaultValue: 10,
        }),
      },
    }),
  },
})
