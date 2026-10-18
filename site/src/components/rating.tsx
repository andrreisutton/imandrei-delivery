import { Star } from "@phosphor-icons/react/dist/ssr";
import type { ReviewRecord } from "@/lib/types";

export function Stars({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <span
      className="inline-flex items-center gap-0.5"
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          weight={i <= Math.round(rating) ? "fill" : "regular"}
          className={i <= Math.round(rating) ? "text-accent-bright" : "text-faint"}
        />
      ))}
    </span>
  );
}

export function ReviewCard({ review, productTitle }: { review: ReviewRecord; productTitle?: string }) {
  const date = new Date(review.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return (
    <article className="card card-pad-tight">
      <div className="flex items-center justify-between gap-3">
        <Stars rating={review.rating} />
        <time dateTime={review.createdAt} className="text-xs text-faint">
          {date}
        </time>
      </div>
      {review.text && <p className="mt-3 text-[15px] leading-relaxed text-ink">{review.text}</p>}
      <p className="mt-3 text-sm text-muted">
        {review.authorName}
        <span className="text-faint"> · Verified purchase</span>
      </p>
      {productTitle && <p className="mt-1 text-xs text-faint">on {productTitle}</p>}
    </article>
  );
}
