import Stripe from "stripe";
import type { BookingCheckoutEvent, BookingRecord, OrderRecord } from "./types";
import { siteUrl } from "./email";
import { saveJSON } from "./store";

// Standard (sk_) and restricted (rk_) keys both work.
export function stripeEnabled(): boolean {
  return /^(sk|rk)_/.test(process.env.STRIPE_SECRET_KEY ?? "");
}

export function stripeLive(): boolean {
  return /^(sk|rk)_live_/.test(process.env.STRIPE_SECRET_KEY ?? "");
}

// Previews may run on a test key; the live site only sells downloads on a live one.
export function onSiteCheckoutReady(): boolean {
  if (!stripeEnabled()) return process.env.VERCEL_ENV !== "production";
  return stripeLive() || process.env.VERCEL_ENV !== "production";
}

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key);
}

export async function createStripeCheckout(order: OrderRecord): Promise<string> {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: order.email,
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: Math.round(order.amount * 100),
          product_data: { name: order.productTitle },
        },
        quantity: 1,
      },
    ],
    metadata: { orderId: order.id },
    success_url: `${siteUrl()}/order/${order.deliveryToken}`,
    cancel_url: `${siteUrl()}/store/${order.productSlug}`,
  });
  if (!session.url) throw new Error("Stripe did not return a checkout URL");
  return session.url;
}

export async function createBookingStripeCheckout(booking: BookingRecord): Promise<string> {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: booking.email,
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: Math.round((booking.quotedTotal ?? 0) * 100),
          product_data: {
            name: `${booking.sessionTitle} · ${booking.duration}`,
            description: `${booking.preferredDate} at ${booking.preferredTime}`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: { bookingId: booking.id },
    success_url: `${siteUrl()}/book/confirmed/${booking.id}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl()}/book`,
  });
  if (!session.url) throw new Error("Stripe did not return a checkout URL");
  try {
    await saveJSON(`booking-events/${booking.id}/checkout`, {
      bookingId: booking.id,
      sessionId: session.id,
      at: new Date().toISOString(),
    } satisfies BookingCheckoutEvent);
  } catch (e) {
    console.error("could not record booking checkout session", booking.id, e);
  }
  return session.url;
}

export async function createRetainerStripeCheckout(input: {
  retainerId: string;
  title: string;
  description: string;
  amount: number;
  email: string;
  channelUrl?: string;
}): Promise<string> {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: input.email,
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: Math.round(input.amount * 100),
          recurring: { interval: "month" },
          product_data: { name: input.title, description: input.description },
        },
        quantity: 1,
      },
    ],
    metadata: {
      retainerId: input.retainerId,
      ...(input.channelUrl ? { channelUrl: input.channelUrl } : {}),
    },
    subscription_data: {
      metadata: {
        retainerId: input.retainerId,
        ...(input.channelUrl ? { channelUrl: input.channelUrl } : {}),
      },
    },
    success_url: `${siteUrl()}/editing?started=${input.retainerId}`,
    cancel_url: `${siteUrl()}/editing#tiers`,
  });
  if (!session.url) throw new Error("Stripe did not return a checkout URL");
  return session.url;
}
