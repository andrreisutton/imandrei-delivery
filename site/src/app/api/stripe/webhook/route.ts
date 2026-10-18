import { getStripe, stripeEnabled } from "@/lib/stripe";
import { createOrder, markPaid } from "@/lib/orders";
import { markBookingPaid } from "@/lib/bookings";
import { claimJSON, readJSON, saveJSON } from "@/lib/store";
import { esc, renderOwnerNotification, sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  if (!stripeEnabled()) return new Response("Stripe not configured", { status: 501 });
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!whSecret) return new Response("Webhook secret not configured", { status: 501 });

  const signature = req.headers.get("stripe-signature");
  if (!signature) return new Response("Missing signature", { status: 400 });

  const body = await req.text();
  let event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, whSecret);
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;
    const bookingId = session.metadata?.bookingId;
    const productSlug = session.metadata?.productSlug;
    if (orderId) {
      await markPaid(orderId);
    } else if (bookingId) {
      await markBookingPaid(bookingId);
    } else if (productSlug) {
      const seen = await readJSON<{ orderId: string }>(`index/stripe-session/${session.id}`);
      if (seen) {
        await markPaid(seen.orderId);
      } else {
        const email = session.customer_details?.email || session.customer_email;
        if (!email) {
          await recordUnfulfilled(session.id, productSlug, "Stripe sent no buyer email");
          return new Response("No buyer email on session", { status: 500 });
        }
        try {
          const order = await createOrder({
            productSlug,
            email,
            name: session.customer_details?.name || "there",
            mode: "stripe",
            amount: session.amount_total != null ? session.amount_total / 100 : undefined,
          });
          const claimed = await claimJSON(`index/stripe-session/${session.id}`, {
            orderId: order.id,
          });
          if (!claimed) {
            const winner = await readJSON<{ orderId: string }>(
              `index/stripe-session/${session.id}`
            );
            if (winner) await markPaid(winner.orderId);
            return Response.json({ received: true });
          }
          await markPaid(order.id);
          await notifyOwnerOfSale(order.productTitle, order.amount, order.name, order.email);
        } catch (e) {
          await recordUnfulfilled(
            session.id,
            productSlug,
            e instanceof Error ? e.message : String(e),
            email
          );
          return new Response("Could not fulfil order", { status: 500 });
        }
      }
    }
  }

  return Response.json({ received: true });
}

async function notifyOwnerOfSale(title: string, amount: number, name: string, email: string) {
  const to = process.env.NOTIFY_EMAIL;
  if (!to) return;
  try {
    const mail = await renderOwnerNotification(
      "order",
      `${title} ($${amount})`,
      `<p style="color:#b7b4ae;font-size:15px;">${esc(name)} (${esc(email)}) bought <strong style="color:#f5f4f2">${esc(title)}</strong> for $${amount} through a payment link.</p>`
    );
    await sendEmail({ to, ...mail, type: "owner-notification" });
  } catch {
  }
}

async function recordUnfulfilled(
  sessionId: string,
  productSlug: string,
  reason: string,
  email?: string
) {
  try {
    await saveJSON(`unfulfilled/${sessionId}`, {
      sessionId,
      productSlug,
      email,
      reason,
      at: new Date().toISOString(),
    });
    const to = process.env.NOTIFY_EMAIL;
    if (to) {
      const mail = await renderOwnerNotification(
        "payment needing attention",
        `${productSlug} (${sessionId})`,
        `<p style="color:#b7b4ae;font-size:15px;">A payment came through that could not be turned into an order.<br>Product: <strong style="color:#f5f4f2">${esc(productSlug)}</strong><br>Buyer: ${esc(email ?? "unknown")}<br>Reason: ${esc(reason)}<br>Stripe session: ${esc(sessionId)}</p>`
      );
      await sendEmail({ to, ...mail, type: "owner-notification", refId: sessionId });
    }
  } catch {
  }
}
