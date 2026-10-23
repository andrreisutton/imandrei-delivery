import { newId } from "./id";
import { listJSON, readJSON, saveJSON } from "./store";
import type { OrderEvent, OrderRecord, OrderState } from "./types";
import { getSiteContent } from "./content";
import { renderFollowUp, renderReceipt, renderReviewRequest, sendEmail } from "./email";

const REVIEW_EMAIL_DELAY_MS = 2 * 60 * 60 * 1000;
const FOLLOW_UP_DELAY_MS = 5 * 24 * 60 * 60 * 1000;

export async function createOrder(input: {
  productSlug: string;
  email: string;
  name: string;
  mode: OrderRecord["mode"];
  amount?: number;
}): Promise<OrderRecord> {
  const { products } = await getSiteContent();
  const product = products.find((p) => p.slug === input.productSlug);
  if (!product) throw new Error("Unknown product");
  const order: OrderRecord = {
    id: newId(),
    productSlug: product.slug,
    productTitle: `${product.title} · ${product.subtitle}`,
    email: input.email,
    name: input.name,
    amount: input.amount ?? product.price,
    mode: input.mode,
    deliveryToken: newId(),
    reviewToken: newId(),
    createdAt: new Date().toISOString(),
  };
  await saveJSON(`orders/${order.id}/order`, order);
  await saveJSON(`index/delivery/${order.deliveryToken}`, { orderId: order.id });
  await saveJSON(`index/review/${order.reviewToken}`, { orderId: order.id });
  return order;
}

export async function markPaid(orderId: string): Promise<void> {
  const order = await readJSON<OrderRecord>(`orders/${orderId}/order`);
  if (!order) throw new Error("Order not found");

  const now = new Date();
  const { products } = await getSiteContent();
  const product = products.find((p) => p.slug === order.productSlug);
  const isService = product?.type === "service";

  const [receiptSent, scheduled, followUp] = await Promise.all([
    readJSON<OrderEvent>(`orders/${orderId}/receipt-sent`),
    readJSON<OrderEvent>(`orders/${orderId}/review-scheduled`),
    readJSON<OrderEvent>(`orders/${orderId}/follow-up-scheduled`),
  ]);

  if (!receiptSent) {
    const receipt = await renderReceipt(order, {
      isService: !!isService,
      deliveryUrl: order.deliveryUrl,
    });
    await sendEmail({ to: order.email, ...receipt, type: "receipt", refId: orderId });
    await saveJSON(`orders/${orderId}/receipt-sent`, { orderId, at: new Date().toISOString() });
  }

  if (!isService && !scheduled) {
    const sendAt = new Date(now.getTime() + REVIEW_EMAIL_DELAY_MS).toISOString();
    await saveJSON(`orders/${orderId}/review-scheduled`, { orderId, at: now.toISOString(), sendAt });
  }

  if (!followUp) {
    const sendAt = new Date(now.getTime() + FOLLOW_UP_DELAY_MS).toISOString();
    await saveJSON(`orders/${orderId}/follow-up-scheduled`, { orderId, at: now.toISOString(), sendAt });
  }

  await saveJSON(`orders/${orderId}/paid`, { orderId, at: now.toISOString() });
}

export async function getOrderState(orderId: string): Promise<OrderState | null> {
  const order = await readJSON<OrderRecord>(`orders/${orderId}/order`);
  if (!order) return null;
  const [paid, receipt, scheduled, reviewSent, reviewed] = await Promise.all([
    readJSON<OrderEvent>(`orders/${orderId}/paid`),
    readJSON<OrderEvent>(`orders/${orderId}/receipt-sent`),
    readJSON<OrderEvent>(`orders/${orderId}/review-scheduled`),
    readJSON<OrderEvent>(`orders/${orderId}/review-sent`),
    readJSON<OrderEvent>(`orders/${orderId}/reviewed`),
  ]);
  return {
    order,
    paid: !!paid,
    receiptSentAt: receipt?.at,
    reviewScheduledFor: scheduled?.sendAt,
    reviewEmailSentAt: reviewSent?.at,
    reviewedAt: reviewed?.at,
  };
}

export async function getOrderIdByToken(kind: "delivery" | "review", token: string): Promise<string | null> {
  const idx = await readJSON<{ orderId: string }>(`index/${kind}/${token}`);
  return idx?.orderId ?? null;
}

export async function sendReviewEmailForOrder(orderId: string): Promise<boolean> {
  const alreadySent = await readJSON<OrderEvent>(`orders/${orderId}/review-sent`);
  if (alreadySent) return false;
  const order = await readJSON<OrderRecord>(`orders/${orderId}/order`);
  if (!order) return false;
  const reviewed = await readJSON<OrderEvent>(`orders/${orderId}/reviewed`);
  if (reviewed) return false;
  const email = await renderReviewRequest(order);
  await sendEmail({ to: order.email, ...email, type: "review-request", refId: orderId });
  await saveJSON(`orders/${orderId}/review-sent`, { orderId, at: new Date().toISOString() });
  return true;
}

export async function processDueReviewEmails(ignoreSchedule = false): Promise<number> {
  const scheduled = await listJSON<OrderEvent>("orders/");
  const due = scheduled.filter(
    (r) =>
      r.path.endsWith("/review-scheduled") &&
      (ignoreSchedule || (r.data.sendAt && new Date(r.data.sendAt) <= new Date()))
  );
  let sent = 0;
  for (const rec of due) {
    if (await sendReviewEmailForOrder(rec.data.orderId)) sent++;
  }
  const followUps = scheduled.filter(
    (r) =>
      r.path.endsWith("/follow-up-scheduled") &&
      (ignoreSchedule || (r.data.sendAt && new Date(r.data.sendAt) <= new Date()))
  );
  for (const rec of followUps) {
    if (await sendFollowUpForOrder(rec.data.orderId)) sent++;
  }
  return sent;
}

// A few days after a purchase: what else is in the store, so they come back.
export async function sendFollowUpForOrder(orderId: string): Promise<boolean> {
  const alreadySent = await readJSON<OrderEvent>(`orders/${orderId}/follow-up-sent`);
  if (alreadySent) return false;
  const order = await readJSON<OrderRecord>(`orders/${orderId}/order`);
  if (!order) return false;
  const paid = await readJSON<OrderEvent>(`orders/${orderId}/paid`);
  if (!paid) return false;
  const { products } = await getSiteContent();
  const picks = products
    .filter((p) => p.slug !== order.productSlug && !p.soldOut && p.price > 0 && p.type !== "service")
    .slice(0, 3);
  const email = await renderFollowUp(order, picks);
  await sendEmail({ to: order.email, ...email, type: "follow-up", refId: orderId });
  await saveJSON(`orders/${orderId}/follow-up-sent`, { orderId, at: new Date().toISOString() });
  return true;
}
