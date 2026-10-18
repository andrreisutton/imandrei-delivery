import { list } from "@vercel/blob";
import { getOrderIdByToken, getOrderState } from "@/lib/orders";
import { placeholderZips } from "@/lib/downloads-data";
import { getSiteContent } from "@/lib/content";

export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const orderId = await getOrderIdByToken("delivery", token);
  if (!orderId) return new Response("Not found", { status: 404 });
  const state = await getOrderState(orderId);
  if (!state || !state.paid) return new Response("Not found", { status: 404 });

  const orderLink = state.order.deliveryUrl;
  if (orderLink) return Response.redirect(orderLink, 302);

  const { products, deliveryUrls } = await getSiteContent();
  const product = products.find((p) => p.slug === state.order.productSlug);
  if (!product || product.type === "service") return new Response("Not found", { status: 404 });

  const catalogLink = deliveryUrls[product.slug];
  if (catalogLink) return Response.redirect(catalogLink, 302);

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { blobs } = await list({ prefix: `downloads/${product.slug}.zip`, limit: 1 });
      const real = blobs.find((b) => b.pathname === `downloads/${product.slug}.zip`);
      if (real) return Response.redirect(real.url, 302);
    } catch {
    }
  }

  const b64 = placeholderZips[product.slug];
  if (!b64) return new Response("File not available", { status: 404 });
  const bytes = Buffer.from(b64, "base64");
  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${product.slug}.zip"`,
      "Content-Length": String(bytes.length),
      "Cache-Control": "no-store",
    },
  });
}
