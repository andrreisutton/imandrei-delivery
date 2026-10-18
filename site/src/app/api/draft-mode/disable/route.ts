import { draftMode } from "next/headers";

export async function GET(request: Request): Promise<Response> {
  (await draftMode()).disable();
  const url = new URL(request.url);
  return Response.redirect(new URL(url.searchParams.get("redirect") || "/", url.origin));
}
