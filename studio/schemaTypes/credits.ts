import { createElement } from "react";
import { defineArrayMember, defineField, defineType } from "sanity";
import { isInstagramPost, youtubeId } from "../lib/links";

const SITE_CLIPS = ["laroi-chicago-2026"];

const LANE_OPTIONS = {
  list: [
    { title: "Color", value: "color" },
    { title: "Video", value: "video" },
    { title: "Photo", value: "photo" },
    { title: "Music", value: "music" },
  ],
  layout: "radio" as const,
  direction: "horizontal" as const,
};

const ytThumb = (link?: string) => {
  const id = youtubeId(link);
  return id
    ? createElement("img", {
        src: `https://i.ytimg.com/vi/${id}/mqdefault.jpg`,
        alt: "",
        style: { objectFit: "cover", width: "100%", height: "100%" },
      })
    : undefined;
};

const sliderWords = [
  defineField({ name: "beforeLabel", title: "Left label", type: "string", validation: (r) => r.max(30) }),
  defineField({ name: "afterLabel", title: "Right label", type: "string", validation: (r) => r.max(30) }),
  defineField({ name: "caption", title: "Caption under it", type: "string", validation: (r) => r.max(200) }),
  defineField({
    name: "captionHref",
    title: "Caption link (optional)",
    type: "url",
    description: "Where the caption links to: the full video or the original post.",
    validation: (r) => r.uri({ scheme: ["https"] }),
  }),
];

export const creditsType = defineType({
  name: "credits",
  title: "My Work & Credits",
  type: "document",
  groups: [
    { name: "videos", title: "Videos", default: true },
    { name: "reels", title: "Reels" },
    { name: "photos", title: "Photos" },
    { name: "proof", title: "Featured video" },
    { name: "compares", title: "Before & after" },
    { name: "roster", title: "Trusted by" },
    { name: "music", title: "Music & credits" },
  ],
  fields: [
    defineField({
      name: "credentials",
      title: "Trusted by the teams of",
      description:
        "The roster shown across the site. Drag to reorder. Only add a video link when the video really shows your work: a name with a link reads as proof, a name without one just reads as a name.",
      type: "array",
      group: "roster",
      of: [
        defineArrayMember({
          name: "credential",
          title: "Name",
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Artist or team",
              type: "string",
              validation: (r) => r.required().max(60),
            }),
            defineField({
              name: "role",
              title: "What the work was",
              type: "string",
              description: 'Short. This prints under the name, for example "Tour and live content".',
              validation: (r) => r.required().max(120),
            }),
            defineField({
              name: "videoUrl",
              title: "Public video (optional)",
              type: "url",
              description:
                "Leave empty until there is a public video of your own footage. The name still shows, it just is not a link.",
              validation: (r) => r.uri({ scheme: ["https"] }),
            }),
          ],
          preview: {
            select: { title: "name", subtitle: "role", link: "videoUrl" },
            prepare({ title, subtitle, link }) {
              return {
                title: title || "Untitled",
                subtitle: [subtitle, link ? "linked" : "no link yet"].filter(Boolean).join(" · "),
              };
            },
          },
        }),
      ],
      validation: (r) => r.max(24),
    }),
    defineField({
      name: "videoWork",
      title: "Videos",
      description:
        "Every video on the site: the Work page (by lane), the Credits page, and the first two on Monthly Editing. Drag to reorder. Claim exactly what the video shows.",
      type: "array",
      group: "videos",
      of: [
        defineArrayMember({
          name: "video",
          title: "Video",
          type: "object",
          fields: [
            defineField({
              name: "videoId",
              title: "YouTube link",
              type: "string",
              description:
                "Paste the video's link straight from YouTube (watch, youtu.be or Shorts links all work).",
              readOnly: ({ value }) => SITE_CLIPS.includes(value as string),
              validation: (r) =>
                r.required().custom((v) =>
                  !v || SITE_CLIPS.includes(v as string) || youtubeId(v as string)
                    ? true
                    : "That does not look like a YouTube video link."
                ),
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (r) => r.required().max(120),
            }),
            defineField({
              name: "credit",
              title: "What you did on it",
              type: "string",
              description: 'For example "Shot, cut, and colored by Andrei".',
              validation: (r) => r.required().max(160),
            }),
            defineField({
              name: "year",
              title: "Year",
              type: "string",
              validation: (r) => r.max(12),
            }),
            defineField({
              name: "lane",
              title: "Which lane on the Work page",
              type: "string",
              options: {
                list: [
                  { title: "Color", value: "color" },
                  { title: "Video", value: "video" },
                  { title: "Photo", value: "photo" },
                  { title: "Music", value: "music" },
                ],
                layout: "radio",
                direction: "horizontal",
              },
              initialValue: "video",
            }),
            defineField({
              name: "featured",
              title: "Show on the home page",
              type: "boolean",
              description: "The first four switched on lead the home page, in this list's order.",
              initialValue: false,
            }),
          ],
          preview: {
            select: { title: "title", credit: "credit", link: "videoId", featured: "featured" },
            prepare({ title, credit, link, featured }) {
              return {
                title: title || "Untitled video",
                subtitle: [featured ? "On the home page" : null, credit].filter(Boolean).join(" · "),
                media: ytThumb(link),
              };
            },
          },
        }),
      ],
      validation: (r) => r.max(48),
    }),
    defineField({
      name: "reels",
      title: "Instagram reels",
      description:
        'Reels on the Work page, in the lane you pick. Instagram only lets a post play on another site when "Allow people to embed your posts" is switched on for that account. @andreisutton has it on; @flicsbyandrei has it off, so switch it on there before adding reels from that account.',
      type: "array",
      group: "reels",
      of: [
        defineArrayMember({
          name: "reel",
          title: "Reel",
          type: "object",
          fields: [
            defineField({
              name: "url",
              title: "Instagram link",
              type: "url",
              description: "Paste the reel or post link from Instagram (Share > Copy link).",
              validation: (r) =>
                r.required().custom((v) => (!v || isInstagramPost(v as string) ? true : "That does not look like an Instagram reel or post link.")),
            }),
            defineField({ name: "lane", title: "Which lane on the Work page", type: "string", options: LANE_OPTIONS, initialValue: "video" }),
            defineField({ name: "caption", title: "Caption (optional)", type: "string", validation: (r) => r.max(200) }),
          ],
          preview: {
            select: { title: "caption", url: "url", lane: "lane" },
            prepare: ({ title, url, lane }) => ({ title: title || url || "New reel", subtitle: lane ? `${lane} lane` : undefined }),
          },
        }),
      ],
      validation: (r) => r.max(48),
    }),
    defineField({
      name: "photoSets",
      title: "Photo sets",
      description:
        "Your concert photos, one set per show. They fill the Photo lane on the Work page and the photo strip on the home page. Drag photos straight in from your computer or phone.",
      type: "array",
      group: "photos",
      of: [
        defineArrayMember({
          name: "photoSet",
          title: "Photo set",
          type: "object",
          fields: [
            defineField({ name: "artist", title: "Artist", type: "string", validation: (r) => r.required().max(80) }),
            defineField({
              name: "note",
              title: "Where and when",
              type: "string",
              description: 'Short, for example "Oct 2025".',
              validation: (r) => r.max(120),
            }),
            defineField({
              name: "href",
              title: "Link to the full set (optional)",
              type: "url",
              description: "The Instagram post with the whole set.",
              validation: (r) => r.uri({ scheme: ["https"] }),
            }),
            defineField({
              name: "photos",
              title: "Photos",
              type: "array",
              options: { layout: "grid" },
              of: [
                defineArrayMember({
                  type: "image",
                  options: { hotspot: true },
                  fields: [
                    defineField({
                      name: "alt",
                      title: "What's in the photo",
                      type: "string",
                      description: 'A few words for people using screen readers, for example "Lil Skies under red light".',
                      validation: (r) => r.max(200).warning(),
                    }),
                  ],
                }),
              ],
              validation: (r) => r.required().min(1).max(24),
            }),
          ],
          preview: {
            select: { title: "artist", subtitle: "note", media: "photos.0" },
          },
        }),
      ],
      validation: (r) => r.max(12),
    }),
    defineField({
      name: "proof",
      title: "Featured video",
      description:
        'The one video the whole site points at as proof: the big section on the home page, and the "<video> shot with these tools" line under the buy and booking buttons on almost every page. Swap the link and the name and every one of those moves with it.',
      type: "object",
      group: "proof",
      options: { collapsible: false },
      fields: [
        defineField({
          name: "videoUrl",
          title: "YouTube link",
          type: "url",
          validation: (r) => r.required().custom((v) => (!v || youtubeId(v as string) ? true : "That does not look like a YouTube video link.")),
        }),
        defineField({
          name: "videoName",
          title: "Video name",
          type: "string",
          description: 'Short. It is the link text in every proof line, for example "Lil Skies Tour recap".',
          validation: (r) => r.required().max(80),
        }),
        defineField({ name: "eyebrow", title: "Small line over the heading", type: "string", validation: (r) => r.max(80) }),
        defineField({ name: "heading", title: "Heading", type: "string", validation: (r) => r.max(120) }),
        defineField({ name: "body1", title: "First paragraph", type: "text", rows: 3, validation: (r) => r.max(500) }),
        defineField({ name: "body2", title: "Second paragraph", type: "text", rows: 4, validation: (r) => r.max(500) }),
        defineField({ name: "plaqueLabel", title: "Box heading", type: "string", validation: (r) => r.max(60) }),
        defineField({
          name: "plaque",
          title: "Box lines",
          type: "array",
          description: "The big lines in the box, one per item.",
          of: [defineArrayMember({ type: "string", validation: (r) => r.max(60) })],
          validation: (r) => r.max(4),
        }),
        defineField({ name: "browseCta", title: "Red button", type: "string", validation: (r) => r.max(40) }),
        defineField({ name: "watchCta", title: "Watch button", type: "string", validation: (r) => r.max(40) }),
        defineField({ name: "videoCaption", title: "Caption under the video", type: "string", validation: (r) => r.max(200) }),
        defineField({
          name: "noteTail",
          title: "Words after the name under buttons",
          type: "string",
          description: 'As in "Lil Skies Tour recap shot with these tools".',
          validation: (r) => r.max(60),
        }),
        defineField({
          name: "storeLead",
          title: "Store page: word before the name",
          type: "string",
          description: 'As in "The Lil Skies Tour recap was shot...". Can be left empty.',
          validation: (r) => r.max(20),
        }),
        defineField({ name: "storeTail", title: "Store page: words after the name", type: "string", validation: (r) => r.max(120) }),
        defineField({ name: "mixingStrip", title: "Mixing page: line under the intro", type: "string", validation: (r) => r.max(160) }),
      ],
    }),
    defineField({
      name: "compares",
      title: "Before & after sliders",
      description: "The two sliders on the home page and the Work page.",
      type: "object",
      group: "compares",
      options: { collapsible: false },
      fields: [
        defineField({
          name: "footage",
          title: "Video slider",
          type: "object",
          description:
            "The video files are built into the site (the two cuts are locked together frame for frame), so the words are what you edit here. To swap the clip, send Studio Raine the before and after files.",
          fields: sliderWords,
        }),
        defineField({
          name: "photo",
          title: "Photo slider",
          type: "object",
          description: "Upload a new pair to swap the photo. Same shot, same crop, both or neither.",
          fields: [
            defineField({ name: "before", title: "Before (raw)", type: "image", options: { hotspot: true } }),
            defineField({
              name: "after",
              title: "After (edited)",
              type: "image",
              options: { hotspot: true },
              validation: (r) =>
                r.custom((v, ctx) => {
                  const before = (ctx.parent as { before?: unknown })?.before;
                  return !!v === !!before ? true : "Upload both photos, or neither. One on its own is not a comparison.";
                }),
            }),
            ...sliderWords,
          ],
        }),
      ],
    }),
    defineField({
      name: "industry",
      title: "Music & editing credits",
      type: "object",
      group: "music",
      fields: [
        defineField({
          name: "musoUrl",
          title: "muso.ai profile link",
          type: "url",
          description:
            "Your public muso.ai profile, which carries your verified credits. Every muso.ai panel on the site links here.",
          validation: (r) => r.uri({ scheme: ["https"] }),
        }),
        defineField({
          name: "musoLabel",
          title: "muso.ai link text",
          type: "string",
          validation: (r) => r.max(80),
        }),
        defineField({
          name: "muso",
          title: "muso.ai numbers",
          type: "object",
          description:
            "Copy these from your muso.ai dashboard (streams, views) and your public profile (credit counts). They print with the note you give them, so update the note when you update the numbers.",
          fields: [
            defineField({
              name: "statsNote",
              title: "Note under the big numbers",
              type: "string",
              description: 'Say where and when they came from, for example "Lifetime, from my muso.ai analytics, August 2026".',
              validation: (r) => r.max(120),
            }),
            defineField({
              name: "stats",
              title: "Big numbers",
              type: "array",
              of: [
                defineArrayMember({
                  name: "stat",
                  type: "object",
                  fields: [
                    defineField({ name: "value", title: "Number", type: "string", description: 'As muso shows it, for example "3M".', validation: (r) => r.required().max(12) }),
                    defineField({ name: "label", title: "What it counts", type: "string", validation: (r) => r.required().max(30) }),
                  ],
                  preview: { select: { title: "value", subtitle: "label" } },
                }),
              ],
              validation: (r) => r.max(6),
            }),
            defineField({ name: "rolesNote", title: "Note over the credit counts", type: "string", validation: (r) => r.max(120) }),
            defineField({
              name: "roles",
              title: "Credit counts",
              type: "array",
              description: "Counted off your public profile, so anyone can check them.",
              of: [
                defineArrayMember({
                  name: "role",
                  type: "object",
                  fields: [
                    defineField({ name: "value", title: "Count", type: "string", validation: (r) => r.required().max(12) }),
                    defineField({ name: "label", title: "Role", type: "string", validation: (r) => r.required().max(30) }),
                  ],
                  preview: { select: { title: "value", subtitle: "label" } },
                }),
              ],
              validation: (r) => r.max(6),
            }),
            defineField({ name: "chart", title: "Chart line", type: "string", validation: (r) => r.max(160) }),
            defineField({ name: "topHeading", title: "Most-streamed heading", type: "string", validation: (r) => r.max(60) }),
            defineField({
              name: "top",
              title: "Most streamed",
              type: "array",
              of: [
                defineArrayMember({
                  name: "track",
                  type: "object",
                  fields: [
                    defineField({ name: "title", title: "Song", type: "string", validation: (r) => r.required().max(80) }),
                    defineField({ name: "artists", title: "Artists as credited", type: "string", validation: (r) => r.max(120) }),
                    defineField({ name: "streams", title: "Streams", type: "string", validation: (r) => r.max(20) }),
                    defineField({ name: "href", title: "Spotify link", type: "url", validation: (r) => r.required().uri({ scheme: ["https"] }) }),
                    defineField({ name: "coverImage", title: "Cover art", type: "image" }),
                    defineField({ name: "cover", title: "Cover path", type: "string", hidden: true }),
                  ],
                  preview: { select: { title: "title", subtitle: "streams", media: "coverImage" } },
                }),
              ],
              validation: (r) => r.max(5),
            }),
          ],
        }),
        defineField({
          name: "reach",
          title: "Reach line (shown in the hero)",
          description:
            "The number printed beside the roster in the hero, and the words that say what it counts. Keep the label honest about WHICH work the number covers: the recap re-uploads on your own channel are portfolio copies, so a bare view count next to them reads as a claim about those.",
          type: "object",
          fields: [
            defineField({
              name: "value",
              title: "The number",
              type: "string",
              description: 'Short, for example "3M+".',
              validation: (r) => r.max(12),
            }),
            defineField({
              name: "label",
              title: "What it counts",
              type: "string",
              description: 'For example "views on work he has shot and edited".',
              validation: (r) => r.max(80),
            }),
          ],
        }),
        defineField({
          name: "editingClients",
          title: "Editing credits",
          description:
            "The channels you cut for. Only fill a name in if the channel is happy to be named publicly; leaving it empty prints the general line instead, and the entry still counts.",
          type: "array",
          of: [
            defineArrayMember({
              name: "editingClient",
              title: "Channel",
              type: "object",
              fields: [
                defineField({
                  name: "name",
                  title: "Channel name (optional)",
                  type: "string",
                  description:
                    "Only fill this in if the channel is happy to be named publicly. Naming it makes the credential much stronger.",
                  validation: (r) => r.max(80),
                }),
                defineField({
                  name: "role",
                  title: "Your role",
                  type: "string",
                  validation: (r) => r.max(120),
                }),
                defineField({
                  name: "note",
                  title: "General line (used when there is no name)",
                  type: "string",
                  validation: (r) => r.max(200),
                }),
                defineField({
                  name: "href",
                  title: "Channel link (optional)",
                  type: "url",
                  description: "Only when the channel is named: the public channel page.",
                  validation: (r) => r.uri({ scheme: ["https"] }),
                }),
                defineField({
                  name: "links",
                  title: "Multiple links (optional)",
                  description:
                    "Use this instead of the single channel link above when more than one person or channel should be credited here, for example two co-hosts who each have their own channel.",
                  type: "array",
                  of: [
                    defineArrayMember({
                      name: "link",
                      title: "Link",
                      type: "object",
                      fields: [
                        defineField({
                          name: "label",
                          title: "Link text",
                          type: "string",
                          validation: (r) => r.required().max(60),
                        }),
                        defineField({
                          name: "href",
                          title: "URL",
                          type: "url",
                          validation: (r) => r.required().uri({ scheme: ["https"] }),
                        }),
                        defineField({
                          name: "banner",
                          title: "Banner image path (optional)",
                          type: "string",
                          description:
                            "A site asset path, not an upload, for example /credits/trewcrew-banner.jpg. Leave empty for a plain text link.",
                        }),
                        defineField({
                          name: "avatar",
                          title: "Avatar image path (optional)",
                          type: "string",
                          description: "A site asset path, for example /credits/trewcrew-avatar.jpg.",
                        }),
                        defineField({
                          name: "handle",
                          title: "Channel handle (optional)",
                          type: "string",
                          description: 'As shown on the channel, for example "@trewcrew".',
                          validation: (r) => r.max(40),
                        }),
                        defineField({
                          name: "subscribers",
                          title: "Subscriber count (optional)",
                          type: "string",
                          description: 'As shown on the channel, for example "269K subscribers".',
                          validation: (r) => r.max(40),
                        }),
                        defineField({
                          name: "videos",
                          title: "Video count (optional)",
                          type: "string",
                          description: 'As shown on the channel, for example "466 videos".',
                          validation: (r) => r.max(40),
                        }),
                        defineField({
                          name: "description",
                          title: "Channel description (optional)",
                          type: "string",
                          description: "The channel's own one-line bio.",
                          validation: (r) => r.max(160),
                        }),
                      ],
                      preview: {
                        select: { title: "label", subtitle: "href" },
                      },
                    }),
                  ],
                  validation: (r) => r.max(4),
                }),
              ],
              preview: {
                select: { title: "name", subtitle: "note" },
                prepare({ title, subtitle }) {
                  return { title: title || subtitle || "Untitled", subtitle: title ? subtitle : "unnamed" };
                },
              },
            }),
          ],
          validation: (r) => r.max(8),
        }),
      ],
    }),
    defineField({
      name: "musicCredits",
      title: "The records",
      description:
        "The releases shown on the Credits page. Every row must keep its Spotify (or other streaming) link: a credit that cannot be opened and played is not printed.",
      type: "array",
      group: "music",
      of: [
        defineArrayMember({
          name: "record",
          title: "Record",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Record title",
              type: "string",
              validation: (r) => r.required().max(80),
            }),
            defineField({
              name: "kind",
              title: "What it is",
              type: "string",
              description: 'For example "Album", "Single", "Feature".',
              validation: (r) => r.max(24),
            }),
            defineField({
              name: "artists",
              title: "Credited artists",
              type: "string",
              description: "Exactly as credited on streaming.",
              validation: (r) => r.max(160),
            }),
            defineField({
              name: "role",
              title: "Your credit on it",
              type: "string",
              validation: (r) => r.max(160),
            }),
            defineField({
              name: "year",
              title: "Year",
              type: "string",
              validation: (r) => r.max(12),
            }),
            defineField({
              name: "href",
              title: "Streaming link",
              type: "url",
              validation: (r) => r.required().uri({ scheme: ["https"] }),
            }),
            defineField({
              name: "cover",
              title: "Cover art",
              type: "image",
              description:
                "The release's own sleeve. Every record on the Credits page shows its own artwork; a record with no cover falls back to a plain lettered tile rather than a broken image.",
              options: { hotspot: true },
            }),
          ],
          preview: { select: { title: "title", subtitle: "artists", media: "cover" } },
        }),
      ],
      validation: (r) => r.max(64),
    }),
    defineField({
      name: "collaborators",
      title: "The collaborators",
      description:
        "Producers, artists, and content people you have worked with. Same rule as the roster: only add a link when it really shows the work together.",
      type: "array",
      group: "music",
      of: [
        defineArrayMember({
          name: "collaborator",
          title: "Name",
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              type: "string",
              validation: (r) => r.required().max(60),
            }),
            defineField({
              name: "role",
              title: "What you did together",
              type: "string",
              description: 'Short. For example "Producer and artist, seven records together".',
              validation: (r) => r.required().max(120),
            }),
            defineField({
              name: "videoUrl",
              title: "Public link (optional)",
              type: "url",
              description: "A public video or page that shows the work together.",
              validation: (r) => r.uri({ scheme: ["https"] }),
            }),
          ],
          preview: {
            select: { title: "name", subtitle: "role", link: "videoUrl" },
            prepare({ title, subtitle, link }) {
              return {
                title: title || "Untitled",
                subtitle: [subtitle, link ? "linked" : "no link yet"].filter(Boolean).join(" · "),
              };
            },
          },
        }),
      ],
      validation: (r) => r.max(32),
    }),
  ],
  preview: { prepare: () => ({ title: "My Work & Credits" }) },
});
