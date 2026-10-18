import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSiteContent } from "@/lib/content";
import { ProductCover } from "@/components/product-cover";
import { getOrderIdByToken, getOrderState } from "@/lib/orders";
import { ReviewForm } from "./review-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Leave a review", robots: { index: false } };

export default async function ReviewPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const orderId = await getOrderIdByToken("review", token);
  if (!orderId) notFound();
  const state = await getOrderState(orderId);
  if (!state || !state.paid) notFound();

  const { products } = await getSiteContent();
  const product = products.find((p) => p.slug === state.order.productSlug);
  if (!product) notFound();

  if (state.reviewedAt) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
        <h1 className="h-title text-6xl sm:text-8xl">
          Already reviewed.
        </h1>
        <p className="mt-4 text-lg text-muted">
          You left a review for {state.order.productTitle} on{" "}
          {new Date(state.reviewedAt).toLocaleDateString("en-US", { month: "long", day: "numeric" })}
          . Thanks again, it genuinely helps.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="grid items-start gap-10 sm:grid-cols-[0.6fr_1.4fr]">
        <div className="mx-auto w-40 overflow-hidden rounded-[8px] sm:w-full">
          <ProductCover product={product} />
        </div>
        <div>
          <h1 className="h-title text-6xl sm:text-8xl">
            How&apos;s it sounding?
          </h1>
          <p className="mt-3 text-lg leading-relaxed text-muted">
            You grabbed <strong className="text-ink">{state.order.productTitle}</strong> a few hours
            ago. Your review goes live on its product page and helps other artists pick right.
          </p>
          <ReviewForm reviewToken={token} defaultName={state.order.name} />
        </div>
      </div>
    </div>
  );
}
