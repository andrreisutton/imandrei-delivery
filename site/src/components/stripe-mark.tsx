// Stripe's official mark and brand colour (#635BFF), taken from Simple Icons,
// which sources it from stripe.com/newsroom/information. Never redraw it.
// The glyph is monochrome by spec, so on the blurple button it ships as the
// brand's own white reverse rather than a recolour.

export const STRIPE_BLURPLE = "#635BFF";

const PATH =
  "M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z";

/**
 * The Stripe mark. Decorative inside a button whose label already names the
 * action; `labelled` renders it as the word "Stripe" for the word-to-wordmark
 * replacement, so crawlers and screen readers still read the word.
 */
export function StripeMark({
  size = 14,
  className = "",
  labelled = false,
}: {
  size?: number;
  className?: string;
  labelled?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={`shrink-0 ${className}`}
      {...(labelled
        ? { role: "img", "aria-label": "Stripe" }
        : { "aria-hidden": true, focusable: false })}
    >
      <path d={PATH} />
    </svg>
  );
}

/**
 * The reassurance line that sits under a payment button. The word "Stripe" is
 * rendered as the mark, with the exact word kept as the accessible name.
 */
export function StripeSecured({ className = "" }: { className?: string }) {
  return (
    <p
      className={`flex items-center justify-center gap-1.5 text-xs text-faint ${className}`}
    >
      <span>Secure payment powered by</span>
      <StripeMark size={13} labelled className="text-[#635BFF]" />
    </p>
  );
}
