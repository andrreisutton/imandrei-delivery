import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { notFound } from "next/navigation";
import { LockSimple } from "@phosphor-icons/react/dist/ssr";
import { getSiteContent } from "@/lib/content";
import { Price } from "@/components/price";
import { StripeMark } from "@/components/stripe-mark";
import { ProductCover } from "@/components/product-cover";
import { stripeEnabled } from "@/lib/stripe";
import { isBuyable } from "@/lib/delivery";
import { CheckoutForm } from "./checkout-form";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default async function CheckoutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { products, deliveryUrls, checkoutCopy } = await getSiteContent();
  const product = products.find((p) => p.slug === slug);
  if (!product || !isBuyable(product, deliveryUrls)) notFound();
  const deliveredAsLink = !!deliveryUrls[product.slug];

  const isDemo = !stripeEnabled();
  const isPhotoVideo = product.category === "photoVideo";
  const backHref =
    product.type === "service"
      ? isPhotoVideo
        ? "/photo-video"
        : "/mixing-mastering"
      : `/store/${product.slug}`;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:py-16">
      <Link href={backHref} className="text-sm text-muted transition-colors hover:text-ink">
        ← Back
      </Link>
      <div className="mt-6 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <aside className="card card-pad self-start">
          <div className="mx-auto max-w-60 overflow-hidden rounded-[8px]">
            <ProductCover product={product} />
          </div>
          <div className="mt-5 flex items-center justify-end">
            <Price price={product.price} compareAtPrice={product.compareAtPrice} />
          </div>
          <div className="mt-5 border-t border-line pt-4 text-sm text-muted">
            {product.type === "service"
              ? isPhotoVideo
                ? "After payment you'll get an email confirming the date, location, and next steps."
                : "After payment you'll get an email with exactly how to send your stems."
              : deliveredAsLink
                ? "Your download link arrives by email the moment payment clears, and it's on the next screen."
                : "Your download link arrives by email the moment payment clears."}
          </div>
        </aside>

        <div>
          <h1 className="h-title text-6xl sm:text-8xl">Checkout</h1>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
            <LockSimple size={14} weight="fill" className="text-accent-bright" />
            {isDemo ? (
              checkoutCopy.demoNote
            ) : (
              <>
                Secure payment powered by
                <StripeMark size={13} labelled className="ml-0.5 text-[#635BFF]" />
              </>
            )}
          </p>
          <CheckoutForm productSlug={product.slug} isDemo={isDemo} price={product.price} />
        </div>
      </div>
    </div>
  );
}
