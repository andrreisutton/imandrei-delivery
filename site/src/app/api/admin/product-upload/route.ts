import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { blobEnabled } from "@/lib/blob";
import { isAdmin } from "@/lib/admin-auth";
import { getSiteContent } from "@/lib/content";

const MAX_BYTES = 5 * 1024 * 1024 * 1024; // 5GB per product file

export async function POST(request: Request): Promise<NextResponse> {
  if (!blobEnabled()) {
    return NextResponse.json({ error: "File storage isn't connected." }, { status: 501 });
  }
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!(await isAdmin())) throw new Error("Sign in to /admin first.");
        const m = pathname.match(/^downloads\/([a-z0-9-]+)\/[^/]+$/);
        const { products } = await getSiteContent();
        if (!m || !products.some((p) => p.slug === m[1] && p.type !== "service")) {
          throw new Error("Unknown product.");
        }
        return {
          maximumSizeInBytes: MAX_BYTES,
          addRandomSuffix: false,
          allowOverwrite: true,
        };
      },
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 400 }
    );
  }
}
