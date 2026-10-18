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
      Introduction: ['company', 'whoWeAre'],
      Offerings: ['pillars', 'services', 'privateEquity', 'funds', 'advisory'],
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

    whoWeAre: singleton({
      label: 'Who we are',
      path: 'src/content/who-we-are',
      format: { data: 'json' },
      previewUrl: 'http://localhost:4321/#who-we-are',
      schema: {
        heading: fields.text({ label: 'Heading', description: 'e.g. Who we are' }),
        body: fields.text({
          label: 'Brief description',
          multiline: true,
          description:
            'A short paragraph or two near the top of the page — who you are, the services you offer, how you are structured, and what you focus on.',
        }),
        points: fields.array(
          fields.object(
            {
              label: fields.text({ label: 'Label', description: 'e.g. Services offered, Structure, Focus' }),
              text: fields.text({ label: 'Detail', multiline: true, description: 'One or two sentences.' }),
            },
            { layout: [4, 8] }
          ),
          {
            label: 'Points',
            description: 'Optional. Short points shown beside the description — e.g. Services offered, Structure, Focus.',
            itemLabel: (props) => props.fields.label.value || 'Point',
          }
        ),
      },
    }),

    pillars: singleton({
      label: 'Offering boxes',
      path: 'src/content/pillars',
      format: { data: 'json' },
      previewUrl: 'http://localhost:4321/#offerings',
      schema: {
        intro: fields.text({ label: 'Intro line', description: 'Optional line shown above the three boxes.' }),
        privateEquity: fields.object(
          {
            title: fields.text({ label: 'Title', description: 'e.g. Private Equity Investments' }),
            tagline: fields.text({ label: 'Tagline', multiline: true, description: 'One line shown in the box.' }),
          },
          { label: 'Box — Private Equity' }
        ),
        privateLending: fields.object(
          {
            title: fields.text({ label: 'Title', description: 'e.g. Private Lending Solutions' }),
            tagline: fields.text({ label: 'Tagline', multiline: true, description: 'One line shown in the box.' }),
          },
          { label: 'Box — Private Lending' }
        ),
        funds: fields.object(
          {
            title: fields.text({ label: 'Title', description: 'e.g. Funds Investments' }),
            tagline: fields.text({ label: 'Tagline', multiline: true, description: 'One line shown in the box.' }),
          },
          { label: 'Box — Funds Investments' }
        ),
        emphasis: fields.select({
          label: 'Which box is larger',
          description: 'The chosen box is shown wider than the other two.',
          defaultValue: 'privateLending',
          options: [
            { label: 'Private Equity', value: 'privateEquity' },
            { label: 'Private Lending', value: 'privateLending' },
            { label: 'Funds Investments', value: 'funds' },
          ],
        }),
      },
    }),

    privateEquity: singleton({
      label: 'Private Equity section',
      path: 'src/content/private-equity',
      format: { data: 'json' },
      previewUrl: 'http://localhost:4321/#private-equity-investments',
      schema: {
        intro: fields.text({
          label: 'What it is',
          multiline: true,
          description:
            'Placeholder — briefly explain what Private Equity Investments means for XSpring. A short paragraph or two.',
        }),
        currentSegments: fields.array(
          fields.object(
            {
              name: fields.text({ label: 'Segment' }),
              note: fields.text({ label: 'Note', multiline: true, description: 'Optional — a line about this sector or holding.' }),
            },
            { layout: [5, 7] }
          ),
          {
            label: 'Current segments of our investments',
            description: 'Sectors or companies you are currently invested in.',
            itemLabel: (props) => props.fields.name.value || 'Segment',
          }
        ),
        targetSegments: fields.array(
          fields.object(
            {
              name: fields.text({ label: 'Segment' }),
              note: fields.text({ label: 'Note', multiline: true, description: 'Optional — what you are looking for here.' }),
            },
            { layout: [5, 7] }
          ),
          {
            label: 'Target segments we are looking for',
            description: 'Sectors or profiles you want to invest in next.',
            itemLabel: (props) => props.fields.name.value || 'Segment',
          }
        ),
      },
    }),

    funds: singleton({
      label: 'Funds Investments section',
      path: 'src/content/funds',
      format: { data: 'json' },
      previewUrl: 'http://localhost:4321/#funds-investments',
      schema: {
        intro: fields.text({
          label: 'What it is',
          multiline: true,
          description:
            'Placeholder — briefly explain what Funds Investments means for XSpring. A short paragraph or two.',
        }),
      },
    }),

    advisory: singleton({
      label: '"No Capital Needed Now" section',
      path: 'src/content/advisory',
      format: { data: 'json' },
      previewUrl: 'http://localhost:4321/#no-capital-needed',
      schema: {
        heading: fields.text({
          label: 'Heading',
          description: "e.g. No Capital Needed Now? Let's Start Somewhere",
        }),
        intro: fields.text({
          label: 'Intro',
          multiline: true,
          description:
            'Optional line under the heading. The two service cards below it (M&A Advisory, Valuation Service) are edited under Services — set "Which section" to Advisory.',
        }),
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
            'Modern — spring green, rounded corners. Corporate — blue, square corners, serif headings. Minimal — black and white, no colour.',
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
            'Grid — cards in columns. Centred — everything centred, cards in two columns. List — cards as full-width rows.',
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
                  label: 'Card style',
                  defaultValue: 'bordered',
                  options: [
                    { label: 'Bordered box', value: 'bordered' },
                    { label: 'Filled panel', value: 'filled' },
                    { label: 'No box, just text', value: 'plain' },
                  ],
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
      previewUrl: 'http://localhost:4321/#private-lending-solutions',
      columns: ['title', 'section', 'order'],
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
        section: fields.select({
          label: 'Which section',
          description:
            'Private Lending Solutions — the debt investment offerings. Advisory — the "No Capital Needed Now" services (M&A Advisory, Valuation Service).',
          defaultValue: 'lending',
          options: [
            { label: 'Private Lending Solutions', value: 'lending' },
            { label: 'Advisory (No Capital Needed Now)', value: 'advisory' },
          ],
        }),
        icon: fields.select({
          label: 'Icon',
          description: 'The small symbol above the heading.',
          options: [
            { label: 'Lending / credit', value: 'bank' },
            { label: 'Real estate', value: 'building' },
            { label: 'Equity / growth', value: 'chart' },
            { label: 'Shares / trading', value: 'trending' },
            { label: 'Inventory / stock', value: 'boxes' },
            { label: 'Invoice / receipt', value: 'receipt' },
            { label: 'Partnership / co-lending', value: 'link' },
            { label: 'Funds', value: 'layers' },
            { label: 'Advisory', value: 'spark' },
            { label: 'Security', value: 'shield' },
            { label: 'Global', value: 'globe' },
            { label: 'Cloud', value: 'cloud' },
            { label: 'Software', value: 'code' },
          ],
          defaultValue: 'bank',
        }),
        summary: fields.text({
          label: 'Summary',
          multiline: true,
          description: 'One short paragraph under the heading. Around 25 words. Shown on the card.',
        }),
        description: fields.text({
          label: 'Full description (pop-up)',
          multiline: true,
          description:
            'The longer explanation shown in the pop-up when someone clicks this service. A few short paragraphs. Optional — the summary is used if this is empty.',
        }),
        regions: fields.array(fields.text({ label: 'Region' }), {
          label: 'Regional coverage (pop-up)',
          description:
            'Where you offer this — e.g. Thailand, Southeast Asia. Shown as tags on the pop-up.',
          itemLabel: (props) => props.value || 'Region',
        }),
        segments: fields.array(
          fields.object({
            name: fields.text({
              label: 'Segment',
              description: 'The industry or segment, e.g. Hospitality, Residential Real Estate.',
            }),
            examples: fields.array(
              fields.text({
                label: 'Example',
                multiline: true,
                description:
                  'A specific example for this segment — client, project, deal or opportunity. Describe them if the name is confidential, and include the size/value in the text if useful.',
              }),
              {
                label: 'Examples',
                description: 'Add as many examples as you like for this segment.',
                itemLabel: (props) => props.value || 'Example',
              }
            ),
          }),
          {
            label: 'Our Past Engagements (pop-up)',
            description:
              'Group examples by industry or segment — shown in the pop-up, below the description.',
            itemLabel: (props) => props.fields.name.value || 'Segment',
          }
        ),
        deals: fields.array(
          fields.object(
            {
              client: fields.text({
                label: 'Client or deal',
                description: 'A real name only with permission — otherwise describe them.',
              }),
              summary: fields.text({
                label: 'What was delivered',
                multiline: true,
                description: 'One or two sentences on the deal and the result.',
              }),
            },
            { layout: [5, 7] }
          ),
          {
            label: 'Past successful deals (pop-up)',
            description: 'Examples shown on the pop-up page for this service.',
            itemLabel: (props) => props.fields.client.value || 'Deal',
          }
        ),
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
