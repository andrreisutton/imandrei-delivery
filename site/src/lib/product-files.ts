import { cache } from "react";
import { del, list } from "@vercel/blob";
import { blobEnabled } from "./blob";

export type ProductFile = { pathname: string; name: string; size: number; uploadedAt: string };

const PREFIX = "downloads/";

export function productFilePrefix(slug: string): string {
  return `${PREFIX}${slug}/`;
}

// Every file Andrei has uploaded in /admin, newest per product.
export const getProductFiles = cache(async (): Promise<Record<string, ProductFile>> => {
  if (!blobEnabled()) return {};
  const out: Record<string, ProductFile> = {};
  try {
    let cursor: string | undefined;
    do {
      const page = await list({ prefix: PREFIX, cursor, limit: 1000 });
      for (const b of page.blobs) {
        const [, slug, ...rest] = b.pathname.split("/");
        if (!slug || rest.length === 0) continue;
        const uploadedAt = new Date(b.uploadedAt).toISOString();
        if (out[slug] && out[slug].uploadedAt >= uploadedAt) continue;
        out[slug] = { pathname: b.pathname, name: rest.join("/"), size: b.size, uploadedAt };
      }
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);
  } catch (e) {
    console.error("could not list product files", e);
  }
  return out;
});

export type CoverImage = { pathname: string; v: string };

// Thumbnails uploaded in /admin, newest per product.
export const getCoverImages = cache(async (): Promise<Record<string, CoverImage>> => {
  if (!blobEnabled()) return {};
  const out: Record<string, CoverImage & { at: number }> = {};
  try {
    const { blobs } = await list({ prefix: "covers/", limit: 1000 });
    for (const b of blobs) {
      const [, slug, ...rest] = b.pathname.split("/");
      if (!slug || rest.length === 0) continue;
      const at = new Date(b.uploadedAt).getTime();
      if (out[slug] && out[slug].at >= at) continue;
      out[slug] = { pathname: b.pathname, v: String(at), at };
    }
  } catch (e) {
    console.error("could not list cover images", e);
  }
  return out;
});

export async function removeOthers(prefix: string, keepPathname: string): Promise<void> {
  const { blobs } = await list({ prefix, limit: 1000 });
  const stale = blobs.filter((b) => b.pathname !== keepPathname).map((b) => b.url);
  if (stale.length) await del(stale);
}

export async function removeAll(prefix: string): Promise<void> {
  const { blobs } = await list({ prefix, limit: 1000 });
  if (blobs.length) await del(blobs.map((b) => b.url));
}

export async function removeOtherProductFiles(slug: string, keepPathname: string): Promise<void> {
  await removeOthers(productFilePrefix(slug), keepPathname);
}

export async function removeProductFiles(slug: string): Promise<void> {
  await removeAll(productFilePrefix(slug));
}
