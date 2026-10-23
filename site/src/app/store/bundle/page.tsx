import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { getSiteContent } from "@/lib/content";
import { getProductFiles } from "@/lib/product-files";
import { productSale } from "@/lib/delivery";
import { BUNDLE_MIN_ITEMS, bundlePricing, isBundleEligible } from "@/lib/bundle";
import { DawBadge } from "@/components/daw-badge";
import { BundleCheckoutForm } from "./bundle-checkout-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your bundle", robots: { index: false } };

export default async function BundlePage({
  searchParams,
}: {
  searchParams: Promise<{ items?: string }>;
}) {
  const { items: itemsParam } = await searchParams;
  const slugs = Array.from(
    new Set((itemsParam ?? "").split(",").map((s) => s.trim()).filter(Boolean))
  );

  const [{ products, deliveryUrls }, files] = await Promise.all([getSiteContent(), getProductFiles()]);
  const items = slugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter(
      (p): p is NonNullable<typeof p> =>
        !!p && isBundleEligible(p) && productSale(p, files, deliveryUrls).kind === "site"
    );

  const pricing = bundlePricing(items.map((p) => p.price));

  if (items.length < BUNDLE_MIN_ITEMS) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:py-24">
        <h1 className="h-title text-5xl sm:text-7xl">Not quite a bundle yet.</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          Pick at least {BUNDLE_MIN_ITEMS} presets or templates on the store page to unlock 20% off.
        </p>
        <Link href="/store" className="btn btn-primary mt-8">
          Back to the store
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:py-24">
      <h1 className="h-title text-5xl sm:text-7xl">Your bundle</h1>
      <p className="mt-4 text-lg leading-relaxed text-muted">
        {items.length} items, 20% off each. Instant download the moment payment clears.
      </p>

      <div className="mt-8 grid gap-3">
        {items.map((p) => (
          <div
            key={p.slug}
            className="flex items-center justify-between gap-4 rounded-[8px] border border-line bg-surface p-4"
          >
            <div className="min-w-0">
              <p className="truncate font-semibold text-ink">{p.title}</p>
              <p className="mt-0.5 truncate text-sm text-muted">{p.subtitle}</p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              {p.daw && <DawBadge name={p.daw} />}
              <span className="text-sm text-muted">${p.price}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="card card-pad mt-6 grid gap-1.5">
        <div className="flex items-center justify-between text-sm text-muted">
          <span>Subtotal</span>
          <span>${pricing.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-accent-bright">
          <span>Bundle discount (20%)</span>
          <span>-${pricing.savings.toFixed(2)}</span>
        </div>
        <div className="mt-2 flex items-center justify-between border-t border-line pt-2 text-lg font-semibold text-ink">
          <span>Total</span>
          <span>${pricing.total.toFixed(2)}</span>
        </div>
      </div>

      <BundleCheckoutForm items={items.map((p) => p.slug).join(",")} price={pricing.total} />
    </div>
  );
}
