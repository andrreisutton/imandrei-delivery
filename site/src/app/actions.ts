"use server";

import { redirect } from "next/navigation";
import { newId } from "@/lib/id";
import { saveJSON } from "@/lib/store";
import { createOrder, markPaid } from "@/lib/orders";
import { submitReview } from "@/lib/reviews";
import {
  createBookingStripeCheckout,
  createBundleStripeCheckout,
  createRetainerStripeCheckout,
  createStripeCheckout,
  demoCheckoutAllowed,
  stripeEnabled,
} from "@/lib/stripe";
import { BUNDLE_MIN_ITEMS, bundleItemAmount, isBundleEligible } from "@/lib/bundle";
import type { Product } from "@/content/site";
import {
  esc,
  filesHtml,
  renderBookingConfirmation,
  renderOwnerNotification,
  renderServiceRequestConfirmation,
  sendEmail,
} from "@/lib/email";
import { getSiteContent } from "@/lib/content";
import { productSale } from "@/lib/delivery";
import { getProductFiles } from "@/lib/product-files";
import type { BookingRecord, ServiceRequestRecord } from "@/lib/types";

export type ActionState = { error?: string; ok?: boolean };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const MAX_EXTRA_HOURS = 6;

function str(fd: FormData, key: string, max = 300): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

const MAX_FILES = 20;

function fileUrls(fd: FormData, key: string): string[] {
  const raw = fd.get(key);
  if (typeof raw !== "string" || !raw) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];
  return parsed
    .filter((u): u is string => typeof u === "string" && /^https:\/\//.test(u))
    .slice(0, MAX_FILES);
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

  const [{ products, deliveryUrls }, files] = await Promise.all([getSiteContent(), getProductFiles()]);
  const product = products.find((p) => p.slug === productSlug);
  if (!product) return { error: "That product no longer exists." };
  if (product.soldOut) return { error: "That one is off sale right now. Try another." };
  if (!(product.price > 0)) return { error: "That one has no price set yet. Try another." };
  if (productSale(product, files, deliveryUrls).kind !== "site") {
    await notifyOwner(
      "product that cannot be delivered",
      product.title,
      `<p style="color:#b7b4ae;font-size:15px;">Someone tried to buy <strong style="color:#f5f4f2">${esc(product.title)}</strong> on the site, but it has no file uploaded (or Stripe is not on a live key), so the sale was refused. Upload the file in /admin under Product files.</p>`
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
    // Without Stripe there is no payment, so the live site never hands files out this way.
    if (!demoCheckoutAllowed()) {
      return { error: "Payments are down for a minute. Try again shortly." };
    }
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

export async function startBundleCheckout(prev: ActionState, formData: FormData): Promise<ActionState> {
  const slugs = Array.from(
    new Set(
      str(formData, "items", 600)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    )
  ).slice(0, 12);
  const email = str(formData, "email", 200);
  const name = str(formData, "name", 120);

  const [{ products, deliveryUrls }, files] = await Promise.all([getSiteContent(), getProductFiles()]);
  const eligible = slugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter(
      (p): p is Product =>
        !!p && isBundleEligible(p) && productSale(p, files, deliveryUrls).kind === "site"
    );

  if (eligible.length < BUNDLE_MIN_ITEMS) {
    return { error: `Pick at least ${BUNDLE_MIN_ITEMS} items to unlock the bundle discount.` };
  }
  if (!name) return { error: "Enter your name so the receipts have someone to talk to." };
  if (!EMAIL_RE.test(email)) return { error: "Enter a valid email. Your links go there." };

  const amounts = eligible.map((p) => bundleItemAmount(p.price));

  let redirectTo: string;
  if (stripeEnabled()) {
    const orders = [];
    for (let i = 0; i < eligible.length; i++) {
      orders.push(
        await createOrder({ productSlug: eligible[i].slug, email, name, mode: "stripe", amount: amounts[i] })
      );
    }
    try {
      redirectTo = await createBundleStripeCheckout(orders);
    } catch (e) {
      console.error("stripe bundle checkout failed", e);
      return { error: "Payment provider is unavailable right now. Try again in a minute." };
    }
  } else {
    if (!demoCheckoutAllowed()) {
      return { error: "Payments are down for a minute. Try again shortly." };
    }
    const orders = [];
    for (let i = 0; i < eligible.length; i++) {
      const order = await createOrder({
        productSlug: eligible[i].slug,
        email,
        name,
        mode: "demo",
        amount: amounts[i],
      });
      await markPaid(order.id);
      orders.push(order);
    }
    const total = orders.reduce((s, o) => s + o.amount, 0);
    await notifyOwner(
      "bundle order",
      `${orders.length} items ($${total.toFixed(2)})`,
      `<p style="color:#b7b4ae;font-size:15px;">${esc(name)} (${esc(email)}) bought a ${orders.length}-item bundle for $${total.toFixed(2)}: ${esc(orders.map((o) => o.productTitle).join(", "))}.</p>`
    );
    redirectTo = `/order/bundle?tokens=${orders.map((o) => o.deliveryToken).join(",")}`;
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
    fileUrls: fileUrls(formData, "fileUrls"),
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
    `<p style="color:#b7b4ae;font-size:15px;">${esc(name)} (${esc(email)}) requested a <strong style="color:#f5f4f2">${esc(session.title)}</strong> on ${esc(preferredDate)} at ${esc(preferredTime)}. ${booking.duration}, <strong style="color:#f5f4f2">$${quotedTotal}</strong> total (paid at the session).${booking.notes ? `<br/><br/>Notes: ${esc(booking.notes)}` : ""}${filesHtml(booking.fileUrls)}</p>`
  );

  return { ok: true };
}

export async function startRetainerCheckout(
  prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const retainerId = str(formData, "retainerId", 60);
  const email = str(formData, "email", 200);
  const name = str(formData, "name", 120);
  const channelUrl = str(formData, "channelUrl", 300);

  const { retainers } = await getSiteContent();
  const retainer = retainers.find((r) => r.id === retainerId);
  if (!retainer) return { error: "That plan no longer exists." };
  if (!(retainer.price > 0)) return { error: "That plan has no price set yet." };
  if (!name) return { error: "Enter your name so the receipt has someone to talk to." };
  if (!EMAIL_RE.test(email)) return { error: "Enter a valid email. Your receipt goes there." };
  if (!stripeEnabled()) {
    return { error: "Card payments are not switched on yet. Use the form below and I'll reply with next steps." };
  }

  let redirectTo: string;
  try {
    redirectTo = await createRetainerStripeCheckout({
      retainerId: retainer.id,
      title: `${retainer.title} retainer`,
      description: retainer.volume,
      amount: retainer.price,
      email,
      channelUrl: channelUrl || undefined,
    });
  } catch (e) {
    console.error("stripe subscription checkout failed for", retainer.id, e);
    return { error: "Payment provider is unavailable right now. Try again in a minute." };
  }
  await notifyOwner(
    "retainer checkout started",
    `${retainer.title} ($${retainer.price}/mo)`,
    `<p style="color:#b7b4ae;font-size:15px;">${esc(name)} (${esc(email)}) started checkout for the <strong style="color:#f5f4f2">${esc(retainer.title)}</strong> retainer at $${retainer.price} a month.${channelUrl ? `<br/>Channel: ${esc(channelUrl)}` : ""}</p>`
  );
  redirect(redirectTo);
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
      : serviceSlug === "custom"
        ? { slug: "custom", title: "Custom request" }
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
    location: str(formData, "location", 200) || undefined,
    travelCoverage: str(formData, "travelCoverage", 60) || undefined,
    fileUrls: fileUrls(formData, "fileUrls"),
    createdAt: new Date().toISOString(),
  };
  await saveJSON(`requests/${request.id}`, request);

  const confirmation = await renderServiceRequestConfirmation(request);
  await sendEmail({ to: email, ...confirmation, type: "service-next-steps", refId: request.id });
  await notifyOwner(
    "service request",
    `${service.title} from ${name}`,
    `<p style="color:#b7b4ae;font-size:15px;">${esc(name)} (${esc(email)}) requested <strong style="color:#f5f4f2">${esc(service.title)}</strong>.${request.songTitle ? `<br/>Song: ${esc(request.songTitle)}` : ""}${request.referenceTrack ? `<br/>Reference: ${esc(request.referenceTrack)}` : ""}${request.channelUrl ? `<br/>Channel: ${esc(request.channelUrl)}` : ""}${request.cadence ? `<br/>Cadence: ${esc(request.cadence)}` : ""}${request.location ? `<br/>Location: ${esc(request.location)}` : ""}${request.travelCoverage ? `<br/>Travel: ${esc(request.travelCoverage)}` : ""}${request.notes ? `<br/><br/>Notes: ${esc(request.notes)}` : ""}${filesHtml(request.fileUrls)}</p>`
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
