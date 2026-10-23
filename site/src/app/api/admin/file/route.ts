import { isAdmin } from "@/lib/admin-auth";
import { signedDownloadUrl } from "@/lib/blob";

export const dynamic = "force-dynamic";

// Opens a file from the private store (product files, stems customers sent).
export async function GET(req: Request) {
  const pathname = new URL(req.url).searchParams.get("p");
  if (!(await isAdmin())) return Response.redirect(new URL("/admin", req.url), 302);
  if (!pathname || !/^(downloads|stems)\//.test(pathname) || pathname.includes("..")) {
    return new Response("Not found", { status: 404 });
  }
  return Response.redirect(await signedDownloadUrl(pathname), 302);
}
