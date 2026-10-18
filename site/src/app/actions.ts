"use server";

import { redirect } from "next/navigation";
import { newId } from "@/lib/id";
import { saveJSON } from "@/lib/store";
import { createOrder, markPaid } from "@/lib/orders";
import { submitReview } from "@/lib/reviews";
import { createBookingStripeCheckout, createStripeCheckout, stripeEnabled } from "@/lib/stripe";
import {
  esc,
  renderBookingConfirmation,
  renderOwnerNotification,
  renderServiceRequestConfirmation,
  sendEmail,
} from "@/lib/email";
import { getSiteContent } from "@/lib/content";
import { isDeliverable } from "@/lib/delivery";
import type { BookingRecord, ServiceRequestRecord } from "@/lib/types";

export type ActionState = { error?: string; ok?: boolean };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const MAX_EXTRA_HOURS = 6;

function str(fd: FormData, key: string, max = 300): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

async function notifyOwner(kind: string, summary: string, detailsHtml: string) {
  const to = process.env.NOTIFY_EMAIL;
  if (!to) return;
  const email = await renderOwnerNotification(kind, summary, detailsHtml);
  await sendEmail({ to, ...email, type: "owner-notification" });
}

export async function startCheckout(prev: ActionState, formData: FormData): Promise<ActionState> {
  const productSlug = str(formData, "productSlug", 100);
  const email = str(formData, "email", 200);
  const name = str(formData, "name", 120);

  const { products, deliveryUrls } = await getSiteContent();
  const product = products.find((p) => p.slug === productSlug);
  if (!product) return { error: "That product no longer exists." };
  if (product.soldOut) return { error: "That one is off sale right now. Try another." };
  if (!(product.price > 0)) return { error: "That one has no price set yet. Try another." };
  if (!isDeliverable(product, deliveryUrls)) {
    await notifyOwner(
      "product that cannot be delivered",
      product.title,
      `<p style="color:#b7b4ae;font-size:15px;">Someone tried to buy <strong style="color:#f5f4f2">${esc(product.title)}</strong> but it has no preset link set, so the sale was refused. Add the link in the Studio under Products &amp; Services, Delivery.</p>`
    );
    return { error: "That one isn't ready to buy yet. Try another, or check back shortly." };
  }
  if (!name) return { error: "Enter your name so the receipt has someone to talk to." };
  if (!EMAIL_RE.test(email)) return { error: "Enter a valid email. Your link goes there." };

  let redirectTo: string;
  if (stripeEnabled()) {
    const order = await createOrder({ productSlug, email, name, mode: "stripe" });
    try {
      redirectTo = await createStripeCheckout(order);
    } catch (e) {
      console.error("stripe checkout failed for order", order.id, e);
      return { error: "Payment provider is unavailable right now. Try again in a minute." };
    }
  } else {
    const order = await createOrder({ productSlug, email, name, mode: "demo" });
    await markPaid(order.id);
    await notifyOwner(
      "order",
      `${order.productTitle} ($${order.amount})`,
      `<p style="color:#b7b4ae;font-size:15px;">${esc(name)} (${esc(email)}) bought <strong style="color:#f5f4f2">${esc(order.productTitle)}</strong> for $${order.amount}.</p>`
    );
    redirectTo = `/order/${order.deliveryToken}`;
  }
  redirect(redirectTo);
}

export async function submitBooking(prev: ActionState, formData: FormData): Promise<ActionState> {
  const sessionId = str(formData, "sessionId", 60);
  const { sessions } = await getSiteContent();
  const session = sessions.find((s) => s.id === sessionId);
  const name = str(formData, "name", 120);
  const email = str(formData, "email", 200);
  const preferredDate = str(formData, "preferredDate", 40);
  const preferredTime = str(formData, "preferredTime", 60);

  if (!session) return { error: "Pick a session type." };
  if (!name) return { error: "Enter your name." };
  if (!EMAIL_RE.test(email)) return { error: "Enter a valid email so the confirmation reaches you." };
  if (!preferredDate) return { error: "Pick a day." };
  if (!preferredTime) return { error: "Pick a start time." };

  const baseMatch = session.duration.match(/\d+/);
  const baseHours = Math.min(12, baseMatch ? Math.max(1, parseInt(baseMatch[0], 10)) : 2);
  const hoursRaw = Number(str(formData, "hours", 4));
  const hours =
    Number.isInteger(hoursRaw) && hoursRaw >= baseHours && hoursRaw <= baseHours + MAX_EXTRA_HOURS
      ? hoursRaw
      : baseHours;
  const quotedTotal =
    session.price + (hours - baseHours) * Math.round(session.price / baseHours);

  const payOnline = stripeEnabled() && quotedTotal >= 1;

  const booking: BookingRecord = {
    id: newId(16),
    sessionId: session.id,
    sessionTitle: session.title,
    name,
    email,
    artistName: str(formData, "artistName", 120) || undefined,
    preferredDate,
    preferredTime,
    duration: `${hours} ${hours === 1 ? "hour" : "hours"}`,
    quotedTotal,
    paymentMode: payOnline ? "stripe" : "at-session",
    notes: str(formData, "notes", 1000) || undefined,
    createdAt: new Date().toISOString(),
  };
  await saveJSON(`bookings/${booking.id}`, booking);

  if (payOnline) {
    let checkoutUrl: string;
    try {
      checkoutUrl = await createBookingStripeCheckout(booking);
    } catch (e) {
      console.error("stripe checkout failed for booking", booking.id, e);
      return { error: "Payment provider is unavailable right now. Try again in a minute." };
    }
    redirect(checkoutUrl);
  }

  const confirmation = await renderBookingConfirmation(booking);
  await sendEmail({ to: email, ...confirmation, type: "booking-confirmation", refId: booking.id });
  await notifyOwner(
    "session request",
    `${session.title} · ${preferredDate}`,
    `<p style="color:#b7b4ae;font-size:15px;">${esc(name)} (${esc(email)}) requested a <strong style="color:#f5f4f2">${esc(session.title)}</strong> on ${esc(preferredDate)} at ${esc(preferredTime)}. ${booking.duration}, <strong style="color:#f5f4f2">$${quotedTotal}</strong> total (paid at the session).${booking.notes ? `<br/><br/>Notes: ${esc(booking.notes)}` : ""}</p>`
  );

  return { ok: true };
}

export async function submitServiceRequest(prev: ActionState, formData: FormData): Promise<ActionState> {
  const serviceSlug = str(formData, "serviceSlug", 100);
  const { products, retainers } = await getSiteContent();
  const product = products.find((p) => p.slug === serviceSlug && p.type === "service");
  const retainer = retainers.find((r) => r.id === serviceSlug);
  const service = product
    ? { slug: product.slug, title: product.title }
    : retainer
      ? { slug: retainer.id, title: `${retainer.title} retainer` }
      : undefined;
  const name = str(formData, "name", 120);
  const email = str(formData, "email", 200);

  if (!service) return { error: "Pick a service." };
  if (!name) return { error: "Enter your name." };
  if (!EMAIL_RE.test(email)) return { error: "Enter a valid email so I can reply with next steps." };

  const request: ServiceRequestRecord = {
    id: newId(16),
    serviceSlug: service.slug,
    serviceTitle: service.title,
    name,
    email,
    artistName: str(formData, "artistName", 120) || undefined,
    songTitle: str(formData, "songTitle", 200) || undefined,
    referenceTrack: str(formData, "referenceTrack", 300) || undefined,
    channelUrl: str(formData, "channelUrl", 300) || undefined,
    cadence: str(formData, "cadence", 120) || undefined,
    notes: str(formData, "notes", 1000) || undefined,
    createdAt: new Date().toISOString(),
  };
  await saveJSON(`requests/${request.id}`, request);

  const confirmation = await renderServiceRequestConfirmation(request);
  await sendEmail({ to: email, ...confirmation, type: "service-next-steps", refId: request.id });
  await notifyOwner(
    "service request",
    `${service.title} from ${name}`,
    `<p style="color:#b7b4ae;font-size:15px;">${esc(name)} (${esc(email)}) requested <strong style="color:#f5f4f2">${esc(service.title)}</strong>.${request.songTitle ? `<br/>Song: ${esc(request.songTitle)}` : ""}${request.referenceTrack ? `<br/>Reference: ${esc(request.referenceTrack)}` : ""}${request.channelUrl ? `<br/>Channel: ${esc(request.channelUrl)}` : ""}${request.cadence ? `<br/>Cadence: ${esc(request.cadence)}` : ""}${request.notes ? `<br/><br/>Notes: ${esc(request.notes)}` : ""}</p>`
  );

  return { ok: true };
}

export async function submitReviewAction(prev: ActionState, formData: FormData): Promise<ActionState> {
  const reviewToken = str(formData, "reviewToken", 60);
  const rating = Number(str(formData, "rating", 2));
  const text = str(formData, "text", 1200);
  const authorName = str(formData, "authorName", 80);

  if (!rating || rating < 1 || rating > 5) return { error: "Tap a star rating first." };
  if (!authorName) return { error: "Add a name (or artist name) to sign the review." };

  let productSlug: string;
  try {
    const review = await submitReview({ reviewToken, rating, text, authorName });
    productSlug = review.productSlug;
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not submit the review." };
  }
  redirect(`/store/${productSlug}?reviewed=1`);
}
