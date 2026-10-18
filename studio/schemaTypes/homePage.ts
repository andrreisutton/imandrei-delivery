import { defineArrayMember, defineField, defineType } from "sanity";

const TOOLS = ["DaVinci Resolve", "Premiere Pro", "Lightroom", "FL Studio"];

const text = (name: string, title: string, max: number, description?: string) =>
  defineField({ name, title, type: "string", group: "sections", description, validation: (r) => r.max(max) });

const serviceCard = (name: string, title: string, withUnit: boolean) =>
  defineField({
    name,
    title,
    type: "object",
    fields: [
      defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required().max(60) }),
      defineField({ name: "body", title: "Text", type: "text", rows: 3, validation: (r) => r.required().max(300) }),
      ...(withUnit
        ? [
            defineField({
              name: "unit",
              title: "Price unit",
              type: "string",
              description: 'The price is worked out from your lowest tier; this is the word after it, as in "From $… a song".',
              validation: (r) => r.max(30),
            }),
          ]
        : []),
      defineField({ name: "cta", title: "Link text", type: "string", validation: (r) => r.max(40) }),
    ],
  });

export const homePageType = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  groups: [
    { name: "hero", title: "Top of page", default: true },
    { name: "sections", title: "Sections, top to bottom" },
  ],
  fields: [
    defineField({
      name: "hero",
      title: "Top of page",
      type: "object",
      group: "hero",
      options: { collapsible: false },
      fields: [
        defineField({ name: "headline", title: "Headline", type: "string", validation: (r) => r.required().max(120) }),
        defineField({ name: "sub", title: "Paragraph under the headline", type: "text", rows: 3, validation: (r) => r.required().max(300) }),
        defineField({ name: "primaryCta", title: "Red button", type: "cta" }),
        defineField({ name: "secondaryCta", title: "Outlined button", type: "cta" }),
        defineField({ name: "eyebrow", title: "Small line above the headline", type: "string", hidden: true }),
      ],
    }),
    defineField({
      name: "trustedHeading",
      title: '"Trusted by" heading',
      type: "string",
      group: "hero",
      description: "Over the names at the top, and again over the full roster further down. The names themselves are in My Work & Credits.",
      validation: (r) => r.max(80),
    }),
    defineField({ name: "builtForLabel", title: '"Built for" label', type: "string", group: "hero", validation: (r) => r.max(40) }),
    defineField({
      name: "daws",
      title: '"Built for" logos',
      type: "array",
      group: "hero",
      description: "The software logos under the top of the page. Drag to reorder.",
      of: [defineArrayMember({ type: "string", options: { list: TOOLS } })],
      validation: (r) => r.max(4).unique(),
    }),

    text("marqueeHeading", "Lead videos: heading", 80, 'Over the four videos that lead the page. Pick them in My Work & Credits > Videos with "Show on the home page".'),
    text("marqueeNote", "Lead videos: line beside the heading", 160),
    text("marqueeCta", "Lead videos: button", 40),

    defineField({
      name: "colorBand",
      title: "Colour section (the before/after sliders)",
      type: "object",
      group: "sections",
      description: "The sliders themselves are in My Work & Credits > Before & after.",
      fields: [
        defineField({ name: "heading", title: "Heading", type: "string", validation: (r) => r.required().max(100) }),
        defineField({ name: "body", title: "Text", type: "text", rows: 4, validation: (r) => r.required().max(500) }),
        defineField({ name: "cta", title: "Button", type: "cta" }),
      ],
    }),
    defineField({
      name: "photoBand",
      title: "Photo section",
      type: "object",
      group: "sections",
      description: "The photos are in My Work & Credits > Photos.",
      fields: [
        defineField({ name: "heading", title: "Heading", type: "string", validation: (r) => r.required().max(100) }),
        defineField({ name: "body", title: "Text", type: "text", rows: 2, validation: (r) => r.required().max(300) }),
      ],
    }),
    text("allPhotosLabel", "Photo section: link to all photos", 40),
    text("featuredHeading", "Store section: heading", 80, "The first four products from Store show here."),
    text("viewAllLabel", 'Store section: "View all" link', 40),
    text("allCreditsLabel", "Roster section: link to all credits", 40, "Below the featured video section, which you edit in My Work & Credits > Featured video."),
    defineField({
      name: "musoBand",
      title: "muso.ai section",
      type: "object",
      group: "sections",
      description: "The numbers themselves are in My Work & Credits > Music & credits.",
      fields: [
        defineField({ name: "heading", title: "Heading", type: "string", validation: (r) => r.required().max(100) }),
        defineField({ name: "body", title: "Text", type: "text", rows: 2, validation: (r) => r.required().max(300) }),
      ],
    }),
    defineField({
      name: "serviceBlock",
      title: "Services section",
      type: "object",
      group: "sections",
      fields: [
        defineField({ name: "headline", title: "Heading", type: "string", validation: (r) => r.required().max(100) }),
        defineField({ name: "body", title: "Text", type: "text", rows: 3, validation: (r) => r.required().max(400) }),
        defineField({ name: "cta", title: "Button", type: "cta" }),
      ],
    }),
    defineField({
      name: "serviceLines",
      title: "Service cards",
      type: "object",
      group: "sections",
      description: "The three cards in the services section. They also lead the Services page.",
      fields: [
        serviceCard("mixing", "Mixing & mastering card", true),
        serviceCard("editing", "Monthly editing card", true),
        serviceCard("sessions", "Sessions card", false),
      ],
    }),
    text("reviewsHeading", "Reviews section: heading", 80, "This section only appears once buyers have left reviews."),
    text("allReviewsLabel", 'Reviews section: "All reviews" link', 40),
    text("stepsHeading", "How-it-works heading", 80),
    defineField({
      name: "steps",
      title: "The three steps",
      type: "array",
      group: "sections",
      of: [
        defineArrayMember({
          name: "step",
          type: "object",
          fields: [
            defineField({ name: "title", title: "Step title", type: "string", validation: (r) => r.required().max(60) }),
            defineField({ name: "body", title: "Step text", type: "text", rows: 2, validation: (r) => r.required().max(300) }),
          ],
          preview: { select: { title: "title", subtitle: "body" } },
        }),
      ],
      validation: (r) => r.max(3),
    }),
    text("finalHeading", "Bottom of page: heading", 120),
    defineField({ name: "finalCta", title: "Bottom of page: button", type: "cta", group: "sections" }),
  ],
  preview: { prepare: () => ({ title: "Home Page" }) },
});
