import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getStripe, stripeEnabled } from "@/lib/stripe";
import { createOrder, markPaid } from "@/lib/orders";
import { claimJSON, readJSON } from "@/lib/store";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your order", robots: { index: false } };

export default async function OrderBySessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  if (!/^cs_[A-Za-z0-9_]+$/.test(sessionId)) notFound();

  const seen = await readJSON<{ orderId: string }>(`index/stripe-session/${sessionId}`);
  if (seen) {
    const order = await readJSON<{ deliveryToken: string }>(`orders/${seen.orderId}/order`);
    if (order) redirect(`/order/${order.deliveryToken}`);
  }

  if (stripeEnabled()) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(sessionId);
      const productSlug = session.metadata?.productSlug;
      const email = session.customer_details?.email || session.customer_email;
      if (session.payment_status === "paid" && productSlug && email) {
        const order = await createOrder({
          productSlug,
          email,
          name: session.customer_details?.name || "there",
          mode: "stripe",
          amount: session.amount_total != null ? session.amount_total / 100 : undefined,
        });
        const claimed = await claimJSON(`index/stripe-session/${sessionId}`, {
          orderId: order.id,
        });
        if (!claimed) {
          const winner = await readJSON<{ orderId: string }>(`index/stripe-session/${sessionId}`);
          const existing = winner
            ? await readJSON<{ deliveryToken: string }>(`orders/${winner.orderId}/order`)
            : null;
          if (existing) redirect(`/order/${existing.deliveryToken}`);
        }
        await markPaid(order.id);
        redirect(`/order/${order.deliveryToken}`);
      }
    } catch (e) {
      if (e && typeof e === "object" && "digest" in e && String(e.digest).startsWith("NEXT_REDIRECT")) {
        throw e;
      }
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:py-24">
      <h1 className="h-title text-6xl sm:text-8xl">
        Finishing your payment…
      </h1>
      <p className="mt-4 text-lg text-muted">
        This page turns into your order the second the payment settles, usually within a few
        seconds. Refresh to check again. Your receipt is on its way either way.
      </p>
      <a href="" className="btn btn-ghost mt-8">
        Refresh
      </a>
    </div>
  );
}
