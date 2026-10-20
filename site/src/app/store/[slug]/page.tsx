import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { notFound } from "next/navigation";
import { ArrowSquareOut, Check, DownloadSimple, Lightning } from "@phosphor-icons/react/dist/ssr";
import { getSiteContent } from "@/lib/content";
import { compares } from "@/content/site";
import { ProductCover } from "@/components/product-cover";
import { GradeCompare } from "@/components/grade-compare";
import { AudioCompare } from "@/components/audio-compare";
import { Price, SaveBadge } from "@/components/price";
import { ReviewCard, Stars } from "@/components/rating";
import { StripeMark, StripeSecured } from "@/components/stripe-mark";
import { ProofCtaNote } from "@/components/proof";
import { stripeEnabled } from "@/lib/stripe";
import { averageRating, getReviewsForProduct } from "@/lib/reviews";
import { isBuyable } from "@/lib/delivery";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { products } = await getSiteContent();
  const product = products.find((p) => p.slug === slug);
  if (!product) return {};
  return {
    title: `${product.title} · ${product.subtitle}`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const { products, deliveryUrls, pages } = await getSiteContent();
  const payWithStripe = stripeEnabled();
  const product = products.find((p) => p.slug === slug && p.type !== "service");
  if (!product) notFound();
  const deliveredAsLink = !!deliveryUrls[product.slug];
  const buyable = isBuyable(product, deliveryUrls);

  const reviews = await getReviewsForProduct(product.slug).catch(() => []);
  const avg = averageRating(reviews);

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
            <Link href="/store" className="hover:text-muted transition-colors">
              Store
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-muted">
            {product.title} · {product.subtitle}
          </li>
        </ol>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="relative">
          <div className="absolute right-3 top-3 z-10 flex flex-col items-end gap-1.5">
            <SaveBadge price={product.price} compareAtPrice={product.compareAtPrice} />
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
            {product.showGradeCompare && (
              <div className="mt-5">
                <h2 className="h-rule text-[10px] sm:text-[11px]">{pages.product.compareHeading}</h2>
                <GradeCompare
                  className={`mt-3.5 ${product.compare === "photo" ? "mx-auto max-w-[20rem]" : ""}`}
                  hue={product.coverHue}
                  idKey={`pdp-${product.slug}`}
                  set={product.compare ? compares[product.compare] : undefined}
                  beforeLabel={pages.product.compareBefore}
                  afterLabel={pages.product.compareAfter}
                  beforeImage={product.gradeBefore}
                  afterImage={product.gradeAfter}
                  caption={product.gradeCaption}
                  captionHref={product.gradeCaptionHref}
                />
              </div>
            )}
            {product.audioBefore && product.audioAfter && (
              <div className="mt-5">
                <h2 className="h-rule text-[10px] sm:text-[11px]">Hear it</h2>
                <AudioCompare
                  className="mt-3.5"
                  title={product.title}
                  credit={product.audioCaption}
                  beforeSrc={product.audioBefore}
                  afterSrc={product.audioAfter}
                  beforeLabel="Dry"
                  afterLabel="Preset"
                />
              </div>
            )}
          </div>
        </div>

        <div>
          <h1 className="h-title text-6xl sm:text-8xl">
            {product.title}
          </h1>
          <p className="mt-2 text-lg text-muted">{product.subtitle}</p>

          {avg !== null && (
            <div className="mt-4 flex items-center gap-2">
              <Stars rating={avg} size={18} />
              <span className="text-sm text-muted">
                {avg.toFixed(1)} · {reviews.length} review{reviews.length === 1 ? "" : "s"}
              </span>
            </div>
          )}

          <div className="mt-6">
            <Price price={product.price} compareAtPrice={product.compareAtPrice} size="lg" />
          </div>

          <p className="mt-6 max-w-prose text-[16px] leading-relaxed text-muted">
            {product.description}
          </p>

          {!buyable ? (
            <div className="card card-pad-tight mt-8">
              <p className="font-semibold">Not for sale right now.</p>
              <p className="mt-1.5 text-[15px] text-muted">
                This one is being finished. Everything else on the site is ready to go tonight.
              </p>
              <Link href="/store" className="btn btn-ghost mt-4">
                See what&apos;s ready
              </Link>
            </div>
          ) : (
            <>
              <Link
                href={`/checkout/${product.slug}`}
                className={`btn ${payWithStripe ? "btn-stripe" : "btn-primary"} mt-8 w-full sm:w-auto sm:min-w-64`}
              >
                {payWithStripe && <StripeMark size={15} />}
                {pages.product.buyLabel} · ${product.price}
              </Link>
              {payWithStripe && <StripeSecured className="mt-3 sm:justify-start" />}
              <ProofCtaNote className="mt-3" />
            </>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Lightning size={16} className="text-accent-bright" weight="fill" />
              {pages.product.instantLine}
            </span>
            <span className="inline-flex items-center gap-1.5">
              {deliveredAsLink ? (
                <ArrowSquareOut size={16} className="text-accent-bright" />
              ) : (
                <DownloadSimple size={16} className="text-accent-bright" />
              )}
              {pages.product.emailLine}
            </span>
          </div>

          <div className="mt-10 border-t border-line pt-8">
            <h2 className="text-lg font-bold">{pages.product.insideHeading}</h2>
            <ul className="mt-4 grid gap-3">
              {product.includes.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px] text-muted">
                  <Check size={18} className="mt-0.5 shrink-0 text-accent-bright" weight="bold" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {reviews.length > 0 && (
        <section data-reveal className="mt-20 border-t border-line pt-12" aria-labelledby="reviews-heading">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="reviews-heading" className="h-editorial text-4xl sm:text-5xl">
              Reviews
            </h2>
            {avg !== null && (
              <div className="flex items-center gap-2 text-sm text-muted">
                <Stars rating={avg} />
                {avg.toFixed(1)} average from {reviews.length} buyer{reviews.length === 1 ? "" : "s"}
              </div>
            )}
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
