import { defineArrayMember, defineField, defineType } from "sanity";

const label = (name: string, title: string, description?: string) =>
  defineField({ name, title, type: "string", description, validation: (r) => r.max(40) });

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Logo, Links & Socials",
  type: "document",
  groups: [
    { name: "socials", title: "Social links", default: true },
    { name: "brand", title: "Logo & name" },
    { name: "menu", title: "Menu & messages" },
  ],
  fields: [
    defineField({
      name: "socials",
      title: "Social links",
      description:
        "The icons in the footer, in this order (drag to reorder). Your Instagram link also drives the \"DM me\" button on phones and the Instagram box on the site, and your Spotify link picks the artist the music player plays.",
      type: "array",
      group: "socials",
      of: [defineArrayMember({ type: "socialLink" })],
      validation: (r) => r.max(8),
    }),
    defineField({
      name: "brand",
      title: "Logo & name",
      type: "object",
      group: "brand",
      options: { collapsible: false },
      fields: [
        defineField({ name: "name", title: "Your name", type: "string", description: "Used in the browser tab, on Google and in the footer.", validation: (r) => r.required().max(60) }),
        defineField({
          name: "logo",
          title: "Logo",
          type: "image",
          description:
            "The light version of your logo, for the dark site. It shows in the header and the footer. It is never stretched: only the height is set.",
        }),
        defineField({
          name: "shortName",
          title: "Name shown if there is no logo",
          type: "string",
          description: "Only used when no logo is uploaded above.",
          validation: (r) => r.required().max(30),
        }),
        defineField({ name: "tagline", title: "Tagline", type: "string", description: "Under the logo in the footer, and in link previews.", validation: (r) => r.required().max(200) }),
        defineField({
          name: "description",
          title: "Google description",
          type: "text",
          rows: 3,
          description: "What Google and link previews show about the site.",
          validation: (r) => r.required().max(400),
        }),
        defineField({
          name: "titleSuffix",
          title: "Browser tab title (home page)",
          type: "string",
          description: 'Comes after your name, for example "Andrei Sutton · PowerGrade, Presets, Templates & Mixing".',
          validation: (r) => r.max(80),
        }),
        defineField({
          name: "instagramBlurb",
          title: "Line on the Instagram box",
          type: "string",
          description: "Shown under your @handle while the Instagram box loads.",
          validation: (r) => r.max(120),
        }),
        defineField({ name: "email", title: "Contact email", type: "string", hidden: true }),
        defineField({ name: "logoDark", title: "Logo (for light backgrounds)", type: "image", hidden: true }),
      ],
    }),
    defineField({
      name: "menu",
      title: "Menu labels",
      description: "The words in the top menu and the footer. The pages they open stay the same.",
      type: "object",
      group: "menu",
      fields: [
        label("store", "Store"),
        label("services", "Services"),
        label("mixing", "Mixing & Mastering (footer)"),
        label("editing", "Monthly Editing (footer)"),
        label("book", "Book a Session (footer)"),
        label("credits", "Credits"),
        label("partners", "Affiliates"),
        label("work", "Work"),
        label("about", "About"),
        label("browseStore", "Red menu button"),
        label("dm", "DM button on phones"),
      ],
    }),
    defineField({
      name: "formCopy",
      title: "After someone sends a form",
      description: "If your reply time changes, update it here and in the form intros on Other Pages.",
      type: "object",
      group: "menu",
      fields: [
        defineField({ name: "requestSent", title: "Mixing and editing forms", type: "text", rows: 2, validation: (r) => r.max(200) }),
        defineField({ name: "bookingSent", title: "Booking form", type: "text", rows: 2, validation: (r) => r.max(200) }),
        defineField({ name: "bookingConfirmedNote", title: "Booking confirmed page", type: "text", rows: 2, validation: (r) => r.max(300) }),
      ],
    }),
    defineField({
      name: "checkoutDemoNote",
      title: "Checkout demo notice",
      type: "string",
      group: "menu",
      description: "Only shown while checkout is in demo mode (before payments go live).",
      validation: (r) => r.max(300),
    }),
  ],
  preview: { prepare: () => ({ title: "Logo, Links & Socials" }) },
});
