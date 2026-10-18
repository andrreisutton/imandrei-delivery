import { defineArrayMember, defineField, defineType } from "sanity";

export const partnersType = defineType({
  name: "partners",
  title: "Partners & Codes",
  type: "document",
  fields: [
    defineField({
      name: "partners",
      title: "Partners",
      description:
        "Drag to reorder. A partner with no code still gets a finished card with a link, so add brands before you have the code sorted.",
      type: "array",
      of: [
        defineArrayMember({
          name: "partner",
          title: "Partner",
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Brand name",
              type: "string",
              validation: (r) => r.required().max(60),
            }),
            defineField({
              name: "what",
              title: "What it is",
              type: "string",
              description: "One short line, for example \"The DAW behind the vocal chains in this store\".",
              validation: (r) => r.required().max(160),
            }),
            defineField({
              name: "href",
              title: "Link",
              type: "url",
              validation: (r) => r.required().uri({ scheme: ["https"] }),
            }),
            defineField({
              name: "code",
              title: "Discount code (optional)",
              type: "string",
              description: "Leave empty until you have the real code. The card works fine without it.",
              validation: (r) => r.max(40),
            }),
            defineField({
              name: "perk",
              title: "What the code gets you",
              type: "string",
              description: "Only shown when there is a code.",
              validation: (r) => r.max(120),
            }),
            defineField({
              name: "logo",
              title: "Brand logo (optional)",
              type: "image",
              description:
                "The brand's official logo, white or full colour on a transparent background so it shows on black. It replaces the name on the card. FL Studio, DistroKid, LANDR, Comfrt and the Amazon storefront already have theirs built in.",
            }),
            defineField({
              name: "referral",
              title: "This link is mine (referral or affiliate)",
              type: "boolean",
              description: 'Switch on when the link credits you, so the button says "Use my link" instead of "Visit".',
              initialValue: false,
            }),
          ],
          preview: {
            select: { title: "name", subtitle: "what", code: "code", media: "logo" },
            prepare({ title, subtitle, code, media }) {
              return {
                title: title || "Untitled partner",
                subtitle: [code ? `Code: ${code}` : "No code yet", subtitle].filter(Boolean).join(" · "),
                media,
              };
            },
          },
        }),
      ],
      validation: (r) => r.max(16),
    }),
  ],
  preview: { prepare: () => ({ title: "Partners & Codes" }) },
});
