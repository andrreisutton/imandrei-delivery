import { defineField, defineType } from "sanity";

export const ctaType = defineType({
  name: "cta",
  title: "Button",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Button text",
      type: "string",
      validation: (r) => r.required().max(60),
    }),
    defineField({
      name: "href",
      title: "Goes to",
      type: "string",
      description: "A page on the site (like /store) or a full link (https://…).",
      validation: (r) => r.required(),
    }),
  ],
});

const PLATFORMS = ["Instagram", "TikTok", "YouTube", "Spotify", "Twitch", "Snapchat"];

export const socialLinkType = defineType({
  name: "socialLink",
  title: "Social link",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Platform",
      type: "string",
      description: "Each one shows with its official logo. Need another platform? Ask Studio Raine to add its logo.",
      options: { list: PLATFORMS },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "href",
      title: "Profile link",
      type: "url",
      description: "Paste the link to your profile, the same one you would send someone.",
      validation: (r) => r.required().uri({ scheme: ["https", "http"] }),
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "href" },
  },
});
