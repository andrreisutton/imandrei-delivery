import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/email";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/order/", "/review/", "/checkout/", "/api/"],
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
