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
