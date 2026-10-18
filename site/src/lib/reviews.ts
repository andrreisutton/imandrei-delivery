import { newId } from "./id";
import { listJSON, readJSON, saveJSON } from "./store";
import type { OrderRecord, ReviewRecord } from "./types";
import { getOrderIdByToken } from "./orders";

export async function submitReview(input: {
  reviewToken: string;
  rating: number;
  text: string;
  authorName: string;
}): Promise<ReviewRecord> {
  const orderId = await getOrderIdByToken("review", input.reviewToken);
  if (!orderId) throw new Error("Invalid review link");
  const order = await readJSON<OrderRecord>(`orders/${orderId}/order`);
  if (!order) throw new Error("Order not found");
  const existing = await readJSON<{ reviewId: string }>(`orders/${orderId}/reviewed`);
  if (existing) throw new Error("A review was already submitted for this order");

  const rating = Math.min(5, Math.max(1, Math.round(input.rating)));
  const review: ReviewRecord = {
    id: newId(16),
    productSlug: order.productSlug,
    orderId,
    rating,
    text: input.text.trim().slice(0, 1200),
    authorName: input.authorName.trim().slice(0, 80) || "Verified buyer",
    createdAt: new Date().toISOString(),
  };
  await saveJSON(`reviews/${order.productSlug}/${review.id}`, review);
  await saveJSON(`orders/${orderId}/reviewed`, {
    orderId,
    at: review.createdAt,
    reviewId: review.id,
  });
  return review;
}

export async function getReviewsForProduct(productSlug: string): Promise<ReviewRecord[]> {
  const recs = await listJSON<ReviewRecord>(`reviews/${productSlug}/`);
  return recs.map((r) => r.data).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getAllReviews(): Promise<ReviewRecord[]> {
  const recs = await listJSON<ReviewRecord>("reviews/");
  return recs.map((r) => r.data).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function averageRating(reviews: ReviewRecord[]): number | null {
  if (!reviews.length) return null;
  return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
}
