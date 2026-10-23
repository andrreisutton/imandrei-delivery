import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { notFound } from "next/navigation";
import { Check } from "@phosphor-icons/react/dist/ssr";
import { getSiteContent } from "@/lib/content";
import { stripeEnabled } from "@/lib/stripe";
import { ProductCover } from "@/components/product-cover";
import { Price, SaveBadge } from "@/components/price";
import { StripeMark, StripeSecured } from "@/components/stripe-mark";
import { ProofCtaNote } from "@/components/proof";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { products } = await getSiteContent();
  const product = products.find((p) => p.slug === slug && p.category === "photoVideo");
  if (!product) return {};
  return {
    title: `${product.title} · ${product.subtitle}`,
    description: product.description,
  };
}

export default async function PhotoVideoDetailPage({ params }: Props) {
  const { slug } = await params;
  const { products, pages } = await getSiteContent();
  const product = products.find((p) => p.slug === slug && p.category === "photoVideo");
  if (!product) notFound();
  const payWithStripe = stripeEnabled();
  const isQuote = product.priceLabel === "quote";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-16">
      <nav aria-label="Breadcrumb" className="text-sm text-faint">
        <ol className="flex gap-2">
          <li>
            <Link href="/" className="hover:text-muted transition-colors">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/photo-video" className="hover:text-muted transition-colors">
              Photo & Video
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-muted">
            {product.title}
          </li>
        </ol>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="relative">
          <div className="absolute right-3 top-3 z-10 flex flex-col items-end gap-1.5">
            {!isQuote && <SaveBadge price={product.price} compareAtPrice={product.compareAtPrice} />}
            {product.badge && (
              <span className="rounded-[6px] bg-raised/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink backdrop-blur-sm">
                {product.badge}
              </span>
            )}
          </div>
          <div className="lg:sticky lg:top-24">
            <div className="card card-flush">
              <ProductCover product={product} />
            </div>
          </div>
        </div>

        <div>
          <h1 className="h-title text-6xl sm:text-8xl">{product.title}</h1>
          <p className="mt-2 text-lg text-muted">{product.subtitle}</p>

          <div className="mt-6">
            {isQuote ? (
              <p className="text-2xl font-semibold text-ink">Request a quote</p>
            ) : (
              <div className="flex items-center gap-3">
                {product.priceLabel === "from" && <span className="text-sm text-faint">Starting at</span>}
                <Price price={product.price} compareAtPrice={product.compareAtPrice} size="lg" />
              </div>
            )}
          </div>

          <p className="mt-6 max-w-prose text-[16px] leading-relaxed text-muted">{product.description}</p>

          {isQuote ? (
            <Link href="/photo-video#form" className="btn btn-primary mt-8 w-full sm:w-auto sm:min-w-64">
              Send the details
            </Link>
          ) : (
            <>
              <Link
                href={`/checkout/${product.slug}`}
                className={`btn ${payWithStripe ? "btn-stripe" : "btn-primary"} mt-8 w-full sm:w-auto sm:min-w-64`}
              >
                {payWithStripe && <StripeMark size={15} />}
                {pages.photoVideo.bookLabel} · ${product.price}
              </Link>
              {payWithStripe && <StripeSecured className="mt-3 sm:justify-start" />}
              <ProofCtaNote className="mt-3" />
            </>
          )}

          <div className="mt-10 border-t border-line pt-8">
            <h2 className="text-lg font-bold">What&apos;s included</h2>
            <ul className="mt-4 grid gap-3">
              {product.includes.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px] text-muted">
                  <Check size={18} className="mt-0.5 shrink-0 text-accent-bright" weight="bold" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-8 text-sm text-faint">
            Outside the local area?{" "}
            <Link href="/photo-video#form" className="underline underline-offset-4 hover:text-ink">
              Tell me where
            </Link>{" "}
            and I&apos;ll fold travel into your quote.
          </p>
        </div>
      </div>
    </div>
  );
}
