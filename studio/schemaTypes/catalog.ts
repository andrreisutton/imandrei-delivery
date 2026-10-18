import { defineArrayMember, defineField, defineType } from "sanity";

const TOOLS = ["DaVinci Resolve", "Premiere Pro", "Lightroom", "FL Studio"];

export const catalogType = defineType({
  name: "catalog",
  title: "Store",
  type: "document",
  fields: [
    defineField({
      name: "products",
      title: "Products & services",
      description:
        "PowerGrades, presets, templates, and mixing services. Drag to reorder, the site shows them in this order.",
      type: "array",
      of: [
        defineArrayMember({
          name: "product",
          title: "Product",
          type: "object",
          groups: [
            { name: "main", title: "The basics", default: true },
            { name: "pricing", title: "Pricing & badge" },
            { name: "delivery", title: "Delivery" },
            { name: "art", title: "Artwork" },
          ],
          fields: [
            defineField({
              name: "title",
              title: "Name",
              type: "string",
              group: "main",
              validation: (r) => r.required().max(80),
            }),
            defineField({
              name: "subtitle",
              title: "Edition / subtitle",
              type: "string",
              group: "main",
              description: 'For example "Color grading system for DaVinci Resolve" or "Per song".',
              validation: (r) => r.required().max(80),
            }),
            defineField({
              name: "type",
              title: "What is it?",
              type: "string",
              group: "main",
              options: {
                list: [
                  { title: "Preset or PowerGrade (delivered instantly)", value: "preset" },
                  { title: "Template or kit (delivered instantly)", value: "template" },
                  { title: "Service (mixing / mastering)", value: "service" },
                ],
                layout: "radio",
              },
              validation: (r) => r.required(),
            }),
            defineField({
              name: "daw",
              title: "Built for",
              type: "string",
              group: "main",
              description: "Which program it's built for. Leave empty for services.",
              options: { list: TOOLS },
              hidden: ({ parent }) => parent?.type === "service",
            }),
            defineField({
              name: "slug",
              title: "Web address",
              type: "slug",
              group: "main",
              description:
                "The product's link on the site. Click Generate once when creating a product, then leave it alone (changing it breaks old links and past orders).",
              options: {
                source: (_, ctx) => {
                  const p = ctx.parent as { title?: string; subtitle?: string };
                  return [p?.title, p?.subtitle].filter(Boolean).join(" ");
                },
              },
              validation: (r) => r.required(),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 4,
              group: "main",
              validation: (r) => r.required().max(1500),
            }),
            defineField({
              name: "includes",
              title: "What's inside (bullet points)",
              type: "array",
              group: "main",
              of: [defineArrayMember({ type: "string" })],
              validation: (r) => r.max(12),
            }),
            defineField({
              name: "price",
              title: "Price (USD)",
              type: "number",
              group: "pricing",
              validation: (r) => r.required().min(0),
            }),
            defineField({
              name: "compareAtPrice",
              title: "Original price (shown crossed out)",
              type: "number",
              group: "pricing",
              description: "Leave empty for no sale badge. Must be higher than the price.",
              validation: (r) =>
                r.min(0).custom((v, ctx) => {
                  const price = (ctx.parent as { price?: number })?.price;
                  if (v != null && price != null && v <= price) {
                    return "Original price must be higher than the current price";
                  }
                  return true;
                }),
            }),
            defineField({
              name: "badge",
              title: "Badge",
              type: "string",
              group: "pricing",
              description: 'A short label on the card, like "Best seller" or "New".',
              validation: (r) => r.max(24),
            }),
            defineField({
              name: "soldOut",
              title: "Sold out",
              type: "boolean",
              group: "pricing",
              initialValue: false,
            }),
            defineField({
              name: "deliveryFile",
              title: "Upload the file buyers get",
              type: "file",
              group: "delivery",
              description:
                "Drag the file in (zip a folder first). Once card payments are live on the site, buyers get it by email the second the payment clears, and on their order page; it is never shown on the public site. Until payments are live, buyers get the link below instead, so a file can never go out without a real payment.",
              hidden: ({ parent }) => parent?.type === "service",
            }),
            defineField({
              name: "deliveryUrl",
              title: "Or paste a link instead",
              type: "url",
              group: "delivery",
              description:
                "For a file that lives somewhere else (Google Drive, Dropbox, Gumroad). Used when nothing is uploaded above. A product with neither cannot be bought yet: its page says it is not for sale until one is added.",
              validation: (r) => r.uri({ scheme: ["https"] }),
              hidden: ({ parent }) => parent?.type === "service",
            }),
            defineField({
              name: "image",
              title: "Cover artwork",
              type: "image",
              group: "art",
              options: { hotspot: true },
              description:
                "Optional. A square image works best: it prints inside the lens on the product card. Without one, the card draws artwork that shows what the product does.",
            }),
            defineField({
              name: "gradeBefore",
              title: "Before / ungraded frame",
              type: "image",
              group: "art",
              options: { hotspot: true },
              description:
                "Optional, for products that grade footage. A flat, ungraded still. Both this and the graded frame must be filled in, or the site keeps drawing its own comparison instead.",
            }),
            defineField({
              name: "gradeAfter",
              title: "After / graded frame",
              type: "image",
              group: "art",
              options: { hotspot: true },
              description: "The same still with the grade applied. Same framing, same crop.",
            }),
            defineField({
              name: "coverHue",
              title: "Generated art color (0–360)",
              type: "number",
              group: "art",
              description:
                "Only used when there's no cover image. Keep it between 8 and 34 so the store grid stays on brand: 8 is crimson, 25 is the brand red, 34 is red-orange. Anything past that turns the card orange or magenta.",
              initialValue: 25,
              validation: (r) =>
                r
                  .min(0)
                  .max(360)
                  .custom((v) =>
                    v == null || (v >= 8 && v <= 34)
                      ? true
                      : "Outside 8 to 34 this card stops matching the rest of the store."
                  )
                  .warning(),
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "subtitle", price: "price", media: "image" },
            prepare({ title, subtitle, price, media }) {
              return {
                title: title || "Untitled product",
                subtitle: [subtitle, price != null ? `$${price}` : null].filter(Boolean).join(" · "),
                media,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "sessions",
      title: "Bookable sessions",
      description: "The session types on the Book a Session page.",
      type: "array",
      of: [
        defineArrayMember({
          name: "session",
          title: "Session",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Session name",
              type: "string",
              validation: (r) => r.required().max(80),
            }),
            defineField({
              name: "id",
              title: "Internal ID",
              type: "slug",
              description:
                "Click Generate once when creating a session, then leave it alone (bookings reference it).",
              options: { source: (_, ctx) => (ctx.parent as { title?: string })?.title ?? "" },
              validation: (r) => r.required(),
            }),
            defineField({
              name: "duration",
              title: "Duration",
              type: "string",
              description: 'For example "2 hours".',
              validation: (r) => r.required().max(40),
            }),
            defineField({
              name: "price",
              title: "Price (USD)",
              type: "number",
              validation: (r) => r.required().min(0),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 3,
              validation: (r) => r.required().max(600),
            }),
          ],
          preview: {
            select: { title: "title", duration: "duration", price: "price" },
            prepare({ title, duration, price }) {
              return {
                title: title || "Untitled session",
                subtitle: [duration, price != null ? `$${price}` : null].filter(Boolean).join(" · "),
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "retainers",
      title: "Monthly editing tiers",
      description:
        "The tiers on the Monthly Editing page. These run as an enquiry, not a subscription, until Stripe is connected.",
      type: "array",
      of: [
        defineArrayMember({
          name: "retainer",
          title: "Tier",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Tier name",
              type: "string",
              validation: (r) => r.required().max(60),
            }),
            defineField({
              name: "id",
              title: "Internal ID",
              type: "slug",
              description:
                "Click Generate once when creating a tier, then leave it alone (enquiries reference it).",
              options: { source: (_, ctx) => (ctx.parent as { title?: string })?.title ?? "" },
              validation: (r) => r.required(),
            }),
            defineField({
              name: "volume",
              title: "What the month covers",
              type: "string",
              description: 'One short line, for example "4 long form edits a month".',
              validation: (r) => r.required().max(80),
            }),
            defineField({
              name: "price",
              title: "Price per month (USD)",
              type: "number",
              validation: (r) => r.required().min(0),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 3,
              validation: (r) => r.required().max(600),
            }),
            defineField({
              name: "includes",
              title: "What's included (bullet points)",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
              validation: (r) => r.max(12),
            }),
            defineField({
              name: "badge",
              title: "Badge",
              type: "string",
              description: 'A short label on the card, like "Most booked".',
              validation: (r) => r.max(24),
            }),
          ],
          preview: {
            select: { title: "title", volume: "volume", price: "price" },
            prepare({ title, volume, price }) {
              return {
                title: title || "Untitled tier",
                subtitle: [volume, price != null ? `$${price}/mo` : null].filter(Boolean).join(" · "),
              };
            },
          },
        }),
      ],
      validation: (r) => r.max(8),
    }),
  ],
  preview: { prepare: () => ({ title: "Store" }) },
});
