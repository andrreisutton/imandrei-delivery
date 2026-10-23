import type { Metadata } from "next";
import { DownloadSimple, FolderOpen, ShoppingCartSimple, Target } from "@phosphor-icons/react/dist/ssr";
import { getSiteContent } from "@/lib/content";
import { PresetGrid } from "./preset-grid";
import { HeroWall } from "@/components/hero-wall";
import { ProofStrip } from "@/components/proof";
import { TrustedByStrip } from "@/components/credentials";
import { DawBadge } from "@/components/daw-badge";
import { ReviewCard } from "@/components/rating";
import { getAllReviews } from "@/lib/reviews";
import { getProductFiles } from "@/lib/product-files";
import { productSale } from "@/lib/delivery";
import { isBundleEligible } from "@/lib/bundle";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { pages } = await getSiteContent();
  return {
    title: "PowerGrades, Presets & Templates",
    description: pages.presets.intro,
  };
}

const STEP_ICONS = [ShoppingCartSimple, DownloadSimple, FolderOpen, Target];

export default async function PresetsPage() {
  const [{ products, deliveryUrls, pages, home, credentials }, files] = await Promise.all([
    getSiteContent(),
    getProductFiles(),
  ]);
  const items = products.filter((p) => p.type === "preset" || p.type === "template");
  const itemSlugs = new Set(items.map((p) => p.slug));
  const bundleSlugs = items
    .filter((p) => isBundleEligible(p) && productSale(p, files, deliveryUrls).kind === "site")
    .map((p) => p.slug);
  const productTitle = (slug: string) => {
    const p = products.find((x) => x.slug === slug);
    return p ? `${p.title} · ${p.subtitle}` : slug;
  };
  const reviews = (await getAllReviews().catch(() => []))
    .filter((r) => itemSlugs.has(r.productSlug))
    .slice(0, 4);
  return (
    <>
      <TrustedByStrip heading={home.trustedHeading} credentials={credentials} className="border-t-0" />
      <section className="grain-panel relative overflow-hidden border-b border-line">
        <HeroWall scrims={false} />
        <div className="wall-read" aria-hidden="true" />
        <div className="relative z-[2] mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-16">
      <div className="relative max-w-2xl">
        <h1 className="h-title text-6xl sm:text-8xl">
          {pages.presets.heading}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">{pages.presets.intro}</p>
        <ul className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2.5">
          <li className="w-full text-[11px] font-semibold uppercase tracking-[0.2em] text-faint sm:w-auto">
            {home.builtForLabel}
          </li>
          {home.daws.map((d) => (
            <DawBadge key={d} name={d} />
          ))}
        </ul>
        <ProofStrip />
      </div>
        </div>
      </section>

      <section data-reveal className="border-b border-line bg-surface/40">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
          <h2 className="h-editorial text-3xl sm:text-4xl">{pages.presets.howItWorksHeading}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pages.presets.howItWorks.map((step, i) => {
              const Icon = STEP_ICONS[i] ?? Target;
              return (
                <div key={step.title} className="flex items-start gap-3.5">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-line-strong bg-bg text-accent-bright">
                    <Icon size={18} weight="bold" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-semibold text-ink">{step.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{step.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
      <PresetGrid items={items} bundleSlugs={bundleSlugs} />
      </div>

      {reviews.length > 0 && (
        <section data-reveal className="border-t border-line">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
            <h2 className="h-editorial text-4xl sm:text-5xl">{pages.presets.reviewsHeading}</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {reviews.map((r) => (
                <ReviewCard key={r.id} review={r} productTitle={productTitle(r.productSlug)} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
