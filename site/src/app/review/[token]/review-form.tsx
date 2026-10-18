"use client";

import { useActionState, useState } from "react";
import { Star } from "@phosphor-icons/react";
import { submitReviewAction, type ActionState } from "@/app/actions";

const LABELS = ["", "Not for me", "It's okay", "Good", "Really good", "Exactly what I needed"];

export function ReviewForm({ reviewToken, defaultName }: { reviewToken: string; defaultName: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(submitReviewAction, {});
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const shown = hover || rating;

  return (
    <form action={action} className="mt-8 grid gap-5">
      <input type="hidden" name="reviewToken" value={reviewToken} />
      <input type="hidden" name="rating" value={rating} />

      <div className="field">
        <label id="rating-label">Your rating</label>
        <div className="flex items-center gap-1" role="radiogroup" aria-labelledby="rating-label">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              type="button"
              role="radio"
              aria-checked={rating === i}
              aria-label={`${i} star${i === 1 ? "" : "s"}`}
              onClick={() => setRating(i)}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(0)}
              className="p-1 transition-transform duration-150 [transition-timing-function:var(--ease-out-quint)] active:scale-90"
            >
              <Star
                size={32}
                weight={i <= shown ? "fill" : "regular"}
                className={i <= shown ? "text-accent-bright" : "text-faint"}
              />
            </button>
          ))}
          <span className="ml-2 min-h-5 text-sm text-muted" aria-live="polite">
            {shown ? LABELS[shown] : ""}
          </span>
        </div>
      </div>

      <div className="field">
        <label htmlFor="rv-text">Your review</label>
        <textarea
          id="rv-text"
          name="text"
          className="input min-h-32 resize-y"
          placeholder="What did you run through it? How did it sit in the mix?"
          maxLength={1200}
        />
      </div>

      <div className="field sm:max-w-xs">
        <label htmlFor="rv-name">Display name</label>
        <input
          id="rv-name"
          name="authorName"
          className="input"
          defaultValue={defaultName}
          maxLength={80}
          required
        />
        <p className="text-xs text-faint">Shown publicly with your review. Artist names welcome.</p>
      </div>

      {state.error && (
        <p role="alert" className="text-sm font-medium text-accent-bright">
          {state.error}
        </p>
      )}

      <button type="submit" className="btn btn-primary sm:justify-self-start" disabled={pending}>
        {pending ? "Publishing…" : "Publish review"}
      </button>
    </form>
  );
}
