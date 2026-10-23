import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { blobEnabled } from "@/lib/blob";

const ALLOWED_CONTENT_TYPES = [
  "audio/wav",
  "audio/x-wav",
  "audio/wave",
  "audio/aiff",
  "audio/x-aiff",
  "audio/mpeg",
  "audio/mp3",
  "audio/flac",
  "audio/x-flac",
  "audio/aac",
  "audio/mp4",
  "application/zip",
  "application/x-zip-compressed",
  "application/octet-stream",
];

const MAX_BYTES = 1024 * 1024 * 1024; // 1GB per file

export async function POST(request: Request): Promise<NextResponse> {
  if (!blobEnabled()) {
    return NextResponse.json(
      { error: "File uploads aren't turned on yet. The rest of the form still works." },
      { status: 501 }
    );
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith("stems/")) throw new Error("Uploads go to stems/ only.");
        return {
        allowedContentTypes: ALLOWED_CONTENT_TYPES,
        maximumSizeInBytes: MAX_BYTES,
        addRandomSuffix: true,
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
