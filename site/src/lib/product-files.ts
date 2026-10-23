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

export async function removeOtherProductFiles(slug: string, keepPathname: string): Promise<void> {
  const { blobs } = await list({ prefix: productFilePrefix(slug), limit: 1000 });
  const stale = blobs.filter((b) => b.pathname !== keepPathname).map((b) => b.url);
  if (stale.length) await del(stale);
}

export async function removeProductFiles(slug: string): Promise<void> {
  const { blobs } = await list({ prefix: productFilePrefix(slug), limit: 1000 });
  if (blobs.length) await del(blobs.map((b) => b.url));
}
