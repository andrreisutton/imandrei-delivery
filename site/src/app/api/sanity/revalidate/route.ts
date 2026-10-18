import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(request: Request): Promise<Response> {
  const secret = new URL(request.url).searchParams.get("secret");
  if (!process.env.SANITY_REVALIDATE_SECRET || secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return Response.json({ ok: false }, { status: 401 });
  }
  revalidateTag("site-content", "max");
  revalidatePath("/", "layout");
  return Response.json({ ok: true, revalidated: true });
}
