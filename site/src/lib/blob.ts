import { issueSignedToken, presignUrl } from "@vercel/blob";

export function blobEnabled(): boolean {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

// The store is private, so nothing in it opens from a plain URL. These links
// last 15 minutes, long enough to start a download, too short to be passed around.
export async function signedDownloadUrl(pathname: string): Promise<string> {
  const validUntil = Date.now() + 15 * 60 * 1000;
  const token = await issueSignedToken({ pathname, operations: ["get"], validUntil });
  const { presignedUrl } = await presignUrl(token, {
    operation: "get",
    pathname,
    access: "private",
    validUntil,
  });
  return presignedUrl;
}

export function blobPathname(url: string): string | null {
  try {
    const u = new URL(url);
    if (!u.hostname.endsWith(".blob.vercel-storage.com")) return null;
    return decodeURIComponent(u.pathname.replace(/^\//, ""));
  } catch {
    return null;
  }
}
