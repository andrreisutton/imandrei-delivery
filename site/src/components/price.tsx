export function Price({
  price,
  compareAtPrice,
  size = "md",
}: {
  price: number;
  compareAtPrice?: number;
  size?: "md" | "lg";
}) {
  const main = size === "lg" ? "text-3xl" : "text-lg";
  const strike = size === "lg" ? "text-lg" : "text-sm";
  return (
    <span className="inline-flex items-baseline gap-2">
      {compareAtPrice && compareAtPrice > price && (
        <s className={`${strike} text-faint`} aria-label={`Original price $${compareAtPrice}`}>
          ${compareAtPrice}
        </s>
      )}
      <span className={`${main} font-semibold text-ink`}>${price}</span>
    </span>
  );
}

export function SaveBadge({ price, compareAtPrice }: { price: number; compareAtPrice?: number }) {
  if (!compareAtPrice || compareAtPrice <= price) return null;
  const pct = Math.round((1 - price / compareAtPrice) * 100);
  return (
    <span className="rounded-[6px] bg-accent px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-accent-ink">
      Save {pct}%
    </span>
  );
}
