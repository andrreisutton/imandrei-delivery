import type { MetadataRoute } from "next";
import { getSiteContent } from "@/lib/content";
import { siteUrl } from "@/lib/email";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const { products } = await getSiteContent();

  const pages = [
    "",
    "/store",
    "/services",
    "/mixing-mastering",
    "/editing",
    "/book",
    "/credits",
    "/partners",
    "/work",
    "/about",
  ].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const productPages = products
    .filter((p) => p.type !== "service" && !p.soldOut)
    .map((p) => ({
      url: `${base}/store/${p.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }));

  return [...pages, ...productPages];
}
