import { get } from "@vercel/blob";
import { getCoverImages } from "@/lib/product-files";

// Product thumbnails live in the private store; they are public artwork, so
// the response may be cached. The ?v= on the URL changes with every upload.
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cover = (await getCoverImages())[slug];
  if (!cover) return new Response("Not found", { status: 404 });
  const result = await get(cover.pathname, { access: "private" });
  if (result?.statusCode !== 200) return new Response("Not found", { status: 404 });
  return new Response(result.stream, {
    headers: {
      "Content-Type": result.blob.contentType,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "public, max-age=300, s-maxage=31536000, immutable",
    },
  });
}
