import type { ComponentType } from "react";
import { defineConfig } from "sanity";
import { defineLocations, presentationTool } from "sanity/presentation";
import { structureTool, type StructureBuilder } from "sanity/structure";
import { TagIcon } from "@sanity/icons/Tag";
import { HomeIcon } from "@sanity/icons/Home";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { CogIcon } from "@sanity/icons/Cog";
import { StarIcon } from "@sanity/icons/Star";
import { UsersIcon } from "@sanity/icons/Users";
import { HelpCircleIcon } from "@sanity/icons/HelpCircle";
import { schemaTypes } from "./schemaTypes";
import { projectId, dataset } from "./project";
import { StartHere } from "./components/StartHere";

const singleton = (S: StructureBuilder, type: string, title: string, icon: ComponentType) =>
  S.listItem()
    .title(title)
    .icon(icon)
    .child(S.document().schemaType(type).documentId(type).title(title));

const SITE = "https://imandrei.com";

const where = (...pages: [string, string][]) =>
  defineLocations({ locations: pages.map(([title, href]) => ({ title, href })) });

export default defineConfig({
  name: "andreisutton",
  title: "Andrei Sutton",
  projectId,
  dataset,
  plugins: [
    presentationTool({
      title: "Edit the site",
      previewUrl: {
        origin: SITE,
        previewMode: { enable: "/api/draft-mode/enable" },
      },
      resolve: {
        mainDocuments: [
          { route: "/", filter: `_id == "homePage"` },
          { route: "/store", filter: `_id == "catalog"` },
          { route: "/store/:slug", filter: `_id == "catalog"` },
          { route: "/services", filter: `_id == "catalog"` },
          { route: "/mixing-mastering", filter: `_id == "catalog"` },
          { route: "/editing", filter: `_id == "catalog"` },
          { route: "/book", filter: `_id == "catalog"` },
          { route: "/work", filter: `_id == "credits"` },
          { route: "/credits", filter: `_id == "credits"` },
          { route: "/partners", filter: `_id == "partners"` },
          { route: "/about", filter: `_id == "pagesCopy"` },
        ],
        locations: {
          catalog: where(
            ["Store", "/store"],
            ["Mixing & Mastering", "/mixing-mastering"],
            ["Monthly Editing", "/editing"],
            ["Book a Session", "/book"],
            ["Home", "/"]
          ),
          credits: where(["Work", "/work"], ["Credits", "/credits"], ["Home", "/"]),
          partners: where(["Partners", "/partners"]),
          homePage: where(["Home", "/"]),
          pagesCopy: where(
            ["Services", "/services"],
            ["Mixing & Mastering", "/mixing-mastering"],
            ["Monthly Editing", "/editing"],
            ["Work", "/work"],
            ["Credits", "/credits"],
            ["Partners", "/partners"],
            ["About", "/about"]
          ),
          siteSettings: defineLocations({
            message: "The menu, the footer and the DM button show on every page.",
            tone: "positive",
            locations: [{ title: "Home", href: "/" }],
          }),
        },
      },
    }),
    structureTool({
      title: "All content",
      structure: (S) =>
        S.list()
          .title("All content")
          .items([
            S.listItem()
              .title("Start here")
              .icon(HelpCircleIcon)
              .child(S.component(StartHere).title("Start here")),
            S.divider(),
            singleton(S, "catalog", "Store", TagIcon),
            singleton(S, "credits", "My Work & Credits", StarIcon),
            singleton(S, "partners", "Partners & Codes", UsersIcon),
            singleton(S, "homePage", "Home Page", HomeIcon),
            singleton(S, "pagesCopy", "Other Pages", DocumentTextIcon),
            singleton(S, "siteSettings", "Logo, Links & Socials", CogIcon),
          ]),
    }),
  ],
  schema: { types: schemaTypes },
  document: {
    newDocumentOptions: () => [],
  },
});
