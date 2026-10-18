import { Link } from "next-view-transitions";
import { getSiteContent } from "@/lib/content";
import { ProductCard } from "@/components/product-card";
import { ReviewCard } from "@/components/rating";
import { Waveform } from "@/components/waveform";
import { HeroWall } from "@/components/hero-wall";
import { VideoWall } from "@/components/video-wall";
import { DawBadge } from "@/components/daw-badge";
import { GradeCompare } from "@/components/grade-compare";
import { HeroCredits, CredentialRoster } from "@/components/credentials";
import { ServiceLines, buildServiceLines } from "@/components/service-lines";
import { ProofCtaNote, ProofSection } from "@/components/proof";
import { MusoPanel } from "@/components/muso-panel";
import { PhotoStrip } from "@/components/photo-wall";
import { compares, photoSets } from "@/content/site";
import { getAllReviews } from "@/lib/reviews";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { home, products, credentials, industry, retainers, sessions, videoWork } =
    await getSiteContent();
  const featured = products.filter((p) => p.type !== "service").slice(0, 4);
  const productTitle = (slug: string) => {
    const p = products.find((x) => x.slug === slug);
    return p ? `${p.title} · ${p.subtitle}` : slug;
  };
  const reviews = (await getAllReviews().catch(() => [])).slice(0, 3);
  const serviceLines = buildServiceLines({ products, retainers, sessions });
  const flagship = products.find((p) => p.showGradeCompare) ?? products[0];
  const MARQUEE = ["laroi-chicago-2026", "MnZgt0shLco", "s3wYxy3mg48", "ykBo8ExufGU"];
  const marquee = MARQUEE.map((id) => videoWork.find((v) => v.videoId === id)).filter(
    (v): v is NonNullable<typeof v> => Boolean(v),
  );

  return (
    <>
      <section className="grain-panel relative flex min-h-[calc(100svh-4rem)] items-center overflow-hidden">
        <HeroWall />
        <div className="relative z-[2] mx-auto w-full max-w-7xl px-4 pb-40 pt-16 sm:pb-28 sm:px-6">
          <div className="rise max-w-3xl">
            <HeroCredits
              heading={home.trustedHeading}
              credentials={credentials}
              reach={industry.reach}
              className="mb-7"
            />
            <h1 className="hero-title h-title text-[clamp(3rem,11.5vw,7.5rem)] leading-[0.85]">
              {home.hero.headline}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{home.hero.sub}</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href={home.hero.primaryCta.href} className="btn btn-primary w-full sm:w-auto">
                {home.hero.primaryCta.label}
              </Link>
              <Link href={home.hero.secondaryCta.href} className="btn btn-ghost w-full sm:w-auto">
                {home.hero.secondaryCta.label}
              </Link>
            </div>
          </div>
        </div>

        <ul className="absolute inset-x-0 bottom-5 z-10 mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-2.5 px-4 sm:bottom-7 sm:gap-x-4">
          <li className="w-full text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-faint sm:w-auto">
            {home.builtForLabel}
          </li>
          {home.daws.map((d) => (
            <DawBadge key={d} name={d} />
          ))}
        </ul>
      </section>

      <section data-reveal className="border-b border-line">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="h-editorial text-4xl sm:text-5xl">{home.marqueeHeading}</h2>
            <p className="text-sm text-muted">{home.marqueeNote}</p>
          </div>
          <VideoWall videos={marquee} columns={4} className="mt-7" />
          <Link href="/work" className="btn btn-ghost mt-8">
            {home.marqueeCta}
          </Link>
        </div>
      </section>

      <section data-reveal className="border-b border-line">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
            <div className="max-w-2xl">
              <h2 className="h-editorial text-4xl sm:text-5xl">{home.colorBand.heading}</h2>
              <p className="mt-5 text-lg leading-relaxed text-muted">{home.colorBand.body}</p>
            </div>
            <div className="flex flex-col items-start gap-3 lg:items-end">
              <Link href={home.colorBand.cta.href} className="btn btn-primary">
                {home.colorBand.cta.label}
              </Link>
              <ProofCtaNote />
            </div>
          </div>
          <div className="mt-10 grid items-start gap-6 lg:grid-cols-[16fr_6fr] lg:gap-5">
            <GradeCompare hue={flagship?.coverHue ?? 27} idKey="home-footage" set={compares.footage} />
            <GradeCompare
              hue={flagship?.coverHue ?? 27}
              idKey="home-photo"
              set={compares.photo}
              className="mx-auto w-[78%] max-w-sm lg:w-full lg:max-w-none"
            />
          </div>
        </div>
      </section>

      <section data-reveal className="border-b border-line">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <h2 className="h-editorial text-4xl sm:text-5xl">{home.photoBand.heading}</h2>
              <p className="mt-4 text-lg leading-relaxed text-muted">{home.photoBand.body}</p>
            </div>
            <Link
              href="/work#photo"
              className="shrink-0 text-sm font-semibold text-muted transition-colors hover:text-ink"
            >
              All the photos →
            </Link>
          </div>
          <PhotoStrip sets={photoSets} className="mt-8" />
        </div>
      </section>

      <section data-reveal className="border-b border-line">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="flex items-end justify-between gap-6">
            <h2 className="h-editorial text-4xl sm:text-5xl">{home.featuredHeading}</h2>
            <Link
              href="/store"
              className="hidden shrink-0 text-sm font-semibold text-muted transition-colors hover:text-ink sm:block"
            >
              {home.viewAllLabel} →
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p, i) => (
              <ProductCard key={p.slug} product={p} priority={i < 2} />
            ))}
          </div>
          <Link href="/store" className="btn btn-ghost mt-8 w-full sm:hidden">
            {home.viewAllLabel}
          </Link>
        </div>
      </section>

      <ProofSection />

      <section data-reveal className="border-b border-line">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="h-rule text-[11px] sm:text-xs">{home.trustedHeading}</h2>
            <Link
              href="/credits"
              className="shrink-0 text-sm font-semibold text-muted transition-colors hover:text-ink"
            >
              All the credits →
            </Link>
          </div>
          <CredentialRoster credentials={credentials} className="mt-7" />
        </div>
      </section>

      <section data-reveal className="border-b border-line">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="max-w-2xl">
            <h2 className="h-editorial text-4xl sm:text-5xl">{home.musoBand.heading}</h2>
            <p className="mt-5 text-lg leading-relaxed text-muted">{home.musoBand.body}</p>
          </div>
          <MusoPanel industry={industry} className="mt-9" />
        </div>
      </section>

      <section className="grain-panel relative overflow-hidden border-b border-line bg-surface/30">
        <div
          className="absolute inset-y-0 right-0 hidden w-1/2 items-center pr-6 opacity-70 lg:flex"
          aria-hidden="true"
        >
          <Waveform seed="mix-band" bars={72} mode="ambient" className="h-40 w-full text-accent-bright/20" />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-bg via-bg/85 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="max-w-xl">
            <h2 className="h-editorial text-4xl sm:text-5xl">{home.serviceBlock.headline}</h2>
            <p className="mt-5 text-lg leading-relaxed text-muted">{home.serviceBlock.body}</p>
          </div>
          <ServiceLines lines={serviceLines} className="mt-10" />
        </div>
      </section>

      {reviews.length > 0 && (
        <section data-reveal className="border-b border-line">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
            <div className="flex items-end justify-between gap-6">
              <h2 className="h-editorial text-4xl sm:text-5xl">{home.reviewsHeading}</h2>
              <Link
                href="/work"
                className="shrink-0 text-sm font-semibold text-muted transition-colors hover:text-ink"
              >
                {home.allReviewsLabel} →
              </Link>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {reviews.map((r) => (
                <ReviewCard key={r.id} review={r} productTitle={productTitle(r.productSlug)} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section data-reveal className="border-b border-line">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <h2 className="h-rule text-[11px] sm:text-xs">{home.stepsHeading}</h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-3 md:gap-6">
            {home.steps.map((s, i) => (
              <li key={s.title} className="relative border-t border-line-strong pt-6">
                <span className="h-stroke text-5xl" aria-hidden="true">{i + 1}</span>
                <h3 className="mt-2 text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section data-reveal className="grain-panel relative overflow-hidden border-t border-line">
        <HeroWall scrims={false} />
        <div
          className="wall-read"
          aria-hidden="true"
        />
        <div className="relative z-[2] mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:py-28">
          <Waveform
            seed="finale"
            bars={64}
            mode="live"
            className="mx-auto h-10 w-full max-w-md text-accent-bright"
          />
          <h2 className="h-editorial text-4xl sm:text-5xl mx-auto mt-8 max-w-3xl">
            {home.finalHeading}
          </h2>
          <Link href={home.finalCta.href} className="btn btn-primary mt-9">
            {home.finalCta.label}
          </Link>
          <ProofCtaNote className="mt-5 justify-center" />
        </div>
      </section>
    </>
  );
}
