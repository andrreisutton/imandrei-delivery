import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { Check, Airplane } from "@phosphor-icons/react/dist/ssr";
import { getSiteContent } from "@/lib/content";
import { stripeEnabled } from "@/lib/stripe";
import { StripeMark } from "@/components/stripe-mark";
import { TrustedByStrip } from "@/components/credentials";
import { Price, SaveBadge } from "@/components/price";
import { ProductCover } from "@/components/product-cover";
import { HeroWall } from "@/components/hero-wall";
import { ProofCtaNote, ProofStrip } from "@/components/proof";
import type { Product } from "@/content/site";
import { PhotoVideoRequestForm } from "./request-form";

export async function generateMetadata(): Promise<Metadata> {
  const { pages } = await getSiteContent();
  return {
    title: "Photo & Video Coverage",
    description: pages.photoVideo.intro,
  };
}

const ADD_ONS = [
  { label: "Extra edited photos", price: "+$75 per 10" },
  { label: "Additional reel", price: "+$75 each" },
  { label: "Extra hour on site", price: "+$100/hr" },
  { label: "Rush delivery (cuts the wait by several days)", price: "+25%" },
  { label: "Additional location (same day)", price: "+$125" },
  { label: "Extended video edit (add 1 to 2 min)", price: "+$150" },
  { label: "Additional subject / artist", price: "+$75" },
];

const BOOKING_TERMS = [
  "A 50% non-refundable deposit holds the date; the balance is due on delivery.",
  "Two rounds of revisions are included; further changes bill at the hourly add-on rate.",
  "Files are delivered by download link and kept for 30 days — keep your own copy.",
  "Delivered work is for personal and social use. Commercial or paid-ad use is licensed separately.",
  "Reschedule 7+ days out at no charge; inside 7 days, a one-time rescheduling fee applies.",
];

function TierCard({
  s,
  payWithStripe,
  bookLabel,
}: {
  s: Product;
  payWithStripe: boolean;
  bookLabel: string;
}) {
  const isQuote = s.priceLabel === "quote";
  return (
    <div className={`card card-flush relative flex flex-col ${s.badge ? "card-featured" : ""}`}>
      {s.badge && (
        <span className="badge-on-card absolute right-3 top-3 z-10 rounded-[6px] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] backdrop-blur-sm">
          {s.badge}
        </span>
      )}
      <Link href={`/photo-video/${s.slug}`} aria-label={`See the full breakdown for ${s.title}`}>
        <ProductCover product={s} />
      </Link>
      <div className="flex flex-1 flex-col px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
        {isQuote ? (
          <p className="text-lg font-semibold text-ink">Request a quote</p>
        ) : (
          <div className="flex items-center gap-3">
            {s.priceLabel === "from" && <span className="text-xs text-faint">Starting at</span>}
            <Price price={s.price} compareAtPrice={s.compareAtPrice} size="lg" />
            <SaveBadge price={s.price} compareAtPrice={s.compareAtPrice} />
          </div>
        )}
        <ul className="mt-6 grid gap-2.5">
          {s.includes.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-muted">
              <Check size={16} className="mt-0.5 shrink-0 text-accent-bright" weight="bold" />
              {item}
            </li>
          ))}
        </ul>
        <Link
          href={`/photo-video/${s.slug}`}
          className="mt-4 inline-flex w-fit items-center text-[11px] font-bold uppercase tracking-[0.14em] text-faint transition-colors hover:text-ink"
        >
          Full details
        </Link>
        <div className="mt-auto pt-7">
          {isQuote ? (
            <a href="#form" className="btn btn-ghost w-full">
              Send the details
            </a>
          ) : (
            <Link
              href={`/checkout/${s.slug}`}
              className={`btn w-full ${
                payWithStripe ? "btn-stripe" : s.badge ? "btn-primary" : "btn-ghost"
              }`}
            >
              {payWithStripe && <StripeMark size={15} />}
              {bookLabel} · ${s.price}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default async function PhotoVideoPage() {
  const { products, pages, credentials, home } = await getSiteContent();
  const payWithStripe = stripeEnabled();
  const all = products.filter((p) => p.type === "service" && p.category === "photoVideo");
  const photography = all.filter((p) => p.subcategory === "photography");
  const videography = all.filter((p) => p.subcategory === "videography");
  const bundles = all.filter((p) => p.subcategory === "bundle");

  return (
    <>
      <section className="grain-panel relative overflow-hidden border-b border-line bg-surface/30">
        <HeroWall scrims={false} />
        <div className="wall-read" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-bg via-bg/85 to-transparent" />
        <div className="relative z-[2] mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-24">
          <div className="max-w-2xl">
            <h1 className="h-title text-6xl sm:text-8xl">{pages.photoVideo.heading}</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">{pages.photoVideo.intro}</p>
            <ProofStrip />
            <div>
              <a href="#pricing" className="btn btn-primary mt-8">
                {pages.photoVideo.ctaLabel}
              </a>
            </div>
          </div>
        </div>
      </section>

      <TrustedByStrip heading={home.trustedHeading} credentials={credentials} />

      <section data-reveal id="pricing" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6 lg:py-24">
        <h2 className="h-editorial text-4xl sm:text-5xl">{pages.photoVideo.tiersHeading}</h2>

        {photography.length > 0 && (
          <div className="mt-10">
            <h3 className="h-rule text-[11px] sm:text-xs">Photography</h3>
            <div className="mt-5 grid gap-5 md:grid-cols-3">
              {photography.map((s) => (
                <TierCard key={s.slug} s={s} payWithStripe={payWithStripe} bookLabel={pages.photoVideo.bookLabel} />
              ))}
            </div>
          </div>
        )}

        {videography.length > 0 && (
          <div className="mt-12">
            <h3 className="h-rule text-[11px] sm:text-xs">Videography</h3>
            <div className="mt-5 grid gap-5 md:grid-cols-3">
              {videography.map((s) => (
                <TierCard key={s.slug} s={s} payWithStripe={payWithStripe} bookLabel={pages.photoVideo.bookLabel} />
              ))}
            </div>
          </div>
        )}

        {bundles.length > 0 && (
          <div className="mt-12">
            <h3 className="h-rule text-[11px] sm:text-xs">Photo + video bundles</h3>
            <div className="mt-5 grid gap-5 md:grid-cols-3">
              {bundles.map((s) => (
                <TierCard key={s.slug} s={s} payWithStripe={payWithStripe} bookLabel={pages.photoVideo.bookLabel} />
              ))}
            </div>
          </div>
        )}

        <p className="mt-8 text-sm text-muted">{pages.photoVideo.payNote}</p>
        <ProofCtaNote className="mt-2" />
      </section>

      <section data-reveal className="border-t border-line">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-20">
          <div className="card card-pad">
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-accent-bright">
              <Airplane size={16} weight="fill" aria-hidden="true" />
              Travel & on-location
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              Package prices cover local coverage. Travel outside that — mileage or flights, ground
              transport, and lodging for anything requiring an overnight stay — is quoted separately
              and confirmed before you book, never padded into the package. For a date outside my
              usual area, flag it on the request form below and I&apos;ll fold travel into your quote.
            </p>
          </div>
          <div className="card card-pad">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-accent-bright">Add-ons</p>
            <ul className="mt-3 grid gap-2.5">
              {ADD_ONS.map((a) => (
                <li key={a.label} className="flex items-baseline justify-between gap-4 text-[15px] text-muted">
                  <span>{a.label}</span>
                  <span className="shrink-0 text-ink">{a.price}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section data-reveal id="form" className="scroll-mt-20 border-t border-line">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <h2 className="h-editorial text-4xl sm:text-5xl">{pages.photoVideo.formHeading}</h2>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-muted">{pages.photoVideo.formIntro}</p>
            <ul className="mt-8 grid gap-2 border-t border-line pt-6 text-sm text-muted">
              {BOOKING_TERMS.map((t) => (
                <li key={t} className="flex items-start gap-2.5">
                  <Check size={14} className="mt-1 shrink-0 text-accent-bright" weight="bold" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <PhotoVideoRequestForm services={all.map((s) => ({ slug: s.slug, title: s.title }))} />
        </div>
      </section>
    </>
  );
}
