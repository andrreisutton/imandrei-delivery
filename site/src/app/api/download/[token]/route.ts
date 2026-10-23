import { getOrderIdByToken, getOrderState } from "@/lib/orders";
import { getSiteContent } from "@/lib/content";
import { getProductFiles } from "@/lib/product-files";
import { signedDownloadUrl } from "@/lib/blob";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const orderId = await getOrderIdByToken("delivery", token);
  if (!orderId) return new Response("Not found", { status: 404 });
  const state = await getOrderState(orderId);
  if (!state || !state.paid) return new Response("Not found", { status: 404 });

  const { products } = await getSiteContent();
  const product = products.find((p) => p.slug === state.order.productSlug);
  if (!product || product.type === "service") return new Response("Not found", { status: 404 });

  const file = (await getProductFiles())[product.slug];
  if (file) {
    try {
      return Response.redirect(await signedDownloadUrl(file.pathname), 302);
    } catch (e) {
      console.error("could not sign download", orderId, e);
      return new Response("Download is unavailable for a minute. Try again shortly.", { status: 503 });
    }
  }

  if (state.order.deliveryUrl) return Response.redirect(state.order.deliveryUrl, 302);

  return new Response("Your file is on its way by email.", { status: 404 });
}
