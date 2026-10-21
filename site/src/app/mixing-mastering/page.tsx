import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { Check } from "@phosphor-icons/react/dist/ssr";
import { getSiteContent } from "@/lib/content";
import { stripeEnabled } from "@/lib/stripe";
import { StripeMark } from "@/components/stripe-mark";
import { TrustedByStrip } from "@/components/credentials";
import { Price, SaveBadge } from "@/components/price";
import { AudioCompare } from "@/components/audio-compare";
import { MusoPanel } from "@/components/muso-panel";
import { ProductCover } from "@/components/product-cover";
import { SpotifyPlaylist } from "@/components/embeds";
import { HeroWall } from "@/components/hero-wall";
import { ProofCtaNote, ProofStrip } from "@/components/proof";
import { ServiceRequestForm } from "./request-form";

export async function generateMetadata(): Promise<Metadata> {
  const { pages } = await getSiteContent();
  return {
    title: "Custom Mixing & Mastering",
    description: pages.mixing.intro,
  };
}

export default async function MixingMasteringPage() {
  const { products, pages, credentials, home, industry } = await getSiteContent();
  const payWithStripe = stripeEnabled();
  const services = products.filter((p) => p.type === "service");

  return (
    <>
      <section className="grain-panel relative overflow-hidden border-b border-line bg-surface/30">
        <HeroWall scrims={false} />
        <div className="wall-read" aria-hidden="true" />
        <div className="absolute inset-y-0 right-0 hidden w-1/2 items-center pr-6 opacity-80 lg:flex" aria-hidden="true">
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-bg via-bg/85 to-transparent" />
        <div className="relative z-[2] mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-24">
          <div className="max-w-2xl">
            <h1 className="h-title text-6xl sm:text-8xl">
              {pages.mixing.heading}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
              {pages.mixing.intro}
            </p>
            <ProofStrip variant="mixing" />
            <div>
              <a href="#pricing" className="btn btn-primary mt-8">
              {pages.mixing.ctaLabel}
            </a>
            </div>
          </div>
        </div>
      </section>

      <TrustedByStrip heading={home.trustedHeading} credentials={credentials} />

      {pages.mixing.demo.beforeSrc && pages.mixing.demo.afterSrc ? (
        <section data-reveal className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:pt-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="h-editorial text-4xl sm:text-5xl">{pages.mixing.demoHeading}</h2>
            <p className="text-sm text-muted">{pages.mixing.demoNote}</p>
          </div>
          <div className="mt-6 max-w-2xl">
            <AudioCompare
              title={pages.mixing.demo.title}
              credit={pages.mixing.demo.credit}
              beforeSrc={pages.mixing.demo.beforeSrc}
              afterSrc={pages.mixing.demo.afterSrc}
              beforeLabel={pages.mixing.demo.beforeLabel}
              afterLabel={pages.mixing.demo.afterLabel}
            />
          </div>
        </section>
      ) : null}

      <section data-reveal className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:pt-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="h-editorial text-4xl sm:text-5xl">
            Hear where the sound comes from
          </h2>
          <p className="text-sm text-muted">Records I release as andrei!. The same ear mixes yours.</p>
        </div>
        <div className="mt-6">
          <SpotifyPlaylist height={352} />
        </div>
        <MusoPanel industry={industry} className="mt-5" />
      </section>

      <section data-reveal id="pricing" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6 lg:py-24">
        <h2 className="h-editorial text-4xl sm:text-5xl">
          {pages.mixing.tiersHeading}
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {services.map((s) => (
            <div key={s.slug} className="relative">
              {s.badge && (
                <span className="badge-on-card absolute -top-3 right-5 z-10 rounded-[6px] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em]">
                  {s.badge}
                </span>
              )}
              <div
                className={`card card-flush flex flex-col ${s.badge ? "card-featured" : ""}`}
              >
                <ProductCover product={s} />
                <div className="flex flex-1 flex-col px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
                <div className="flex items-center gap-3">
                  <Price price={s.price} compareAtPrice={s.compareAtPrice} size="lg" />
                  <SaveBadge price={s.price} compareAtPrice={s.compareAtPrice} />
                </div>
                <ul className="mt-6 grid gap-2.5">
                  {s.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-muted">
                      <Check size={16} className="mt-0.5 shrink-0 text-accent-bright" weight="bold" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-7">
                  <Link
                    href={`/checkout/${s.slug}`}
                    className={`btn w-full ${
                      payWithStripe ? "btn-stripe" : s.badge ? "btn-primary" : "btn-ghost"
                    }`}
                  >
                    {payWithStripe && <StripeMark size={15} />}
                    {pages.mixing.bookLabel} · ${s.price}
                  </Link>
                </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted">{pages.mixing.payNote}</p>
        <ProofCtaNote className="mt-2" />
      </section>

      <section data-reveal id="form" className="scroll-mt-20 border-t border-line">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <h2 className="h-editorial text-4xl sm:text-5xl">
              {pages.mixing.formHeading}
            </h2>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-muted">
              {pages.mixing.formIntro}
            </p>
          </div>
          <ServiceRequestForm services={services.map((s) => ({ slug: s.slug, title: s.title }))} />
        </div>
      </section>
    </>
  );
}
