import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { Check } from "@phosphor-icons/react/dist/ssr";
import { getSiteContent } from "@/lib/content";
import { stripeEnabled } from "@/lib/stripe";
import { StripeMark } from "@/components/stripe-mark";
import { HeroWall } from "@/components/hero-wall";
import { TrustedByStrip } from "@/components/credentials";
import { VideoWall } from "@/components/video-wall";
import { ProofCtaNote } from "@/components/proof";
import { EditingRequestForm } from "./request-form";

export async function generateMetadata(): Promise<Metadata> {
  const { pages } = await getSiteContent();
  return {
    title: "Monthly Editing",
    description: pages.editing.intro,
  };
}

/**
 * What each tier actually produces, in Andrei's own frames. Creator and Channel
 * carry a single show; Label carries the busiest frame of the three, because
 * that tier is the whole release calendar rather than one upload a week.
 */
const TIER_ART: Record<string, { src: string; alt: string }> = {
  creator: {
    src: "/photos/ian-0.jpg",
    alt: "ian on the mic in warm stage light, shot and cut by Andrei",
  },
  channel: {
    src: "/photos/skies-2.jpg",
    alt: "Lil Skies under blue and magenta wash, shot and cut by Andrei",
  },
  label: {
    src: "/photos/tron-6.jpg",
    alt: "BabyTron on stage in a lit haze, shot and cut by Andrei",
  },
};

export default async function EditingPage() {
  const { pages, retainers, credentials, videoWork, industry, home } = await getSiteContent();
  const payWithStripe = stripeEnabled();

  return (
    <>
      <section className="grain-panel relative overflow-hidden border-b border-line bg-surface/30">
        <HeroWall scrims={false} />
        <div className="wall-read" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-bg via-bg/85 to-transparent" />
        <div className="relative z-[2] mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-24">
          <div className="max-w-2xl">
            <h1 className="h-title text-6xl sm:text-8xl">{pages.editing.heading}</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">{pages.editing.intro}</p>
            <a href="#tiers" className="btn btn-primary mt-8">
              See the tiers
            </a>
          </div>
        </div>
      </section>

      <TrustedByStrip heading={home.trustedHeading} credentials={credentials} />

      <section data-reveal className="border-b border-line">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
            <div>
              <h2 className="h-rule text-[11px] sm:text-xs">Already doing this</h2>
              {industry.editingClients.map((ec, i) => (
                <div key={ec.name || i} className={i === 0 ? "mt-5" : "mt-7 border-t border-line pt-7"}>
                  <p className="h-editorial text-3xl sm:text-4xl">{ec.name || ec.note}</p>
                  <p className="mt-3 text-lg leading-relaxed text-muted">
                    {ec.name ? `${ec.note}. ${ec.role}.` : `${ec.role}.`}
                  </p>
                  {ec.href && (
                    <a
                      href={ec.href}
                      target="_blank"
                      rel="noopener"
                      className="mt-3 inline-block text-[11px] font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:text-accent-bright"
                    >
                      Open the channel
                    </a>
                  )}
                </div>
              ))}
              <p className="mt-6 text-[15px] leading-relaxed text-faint">
                The same schedule, the same turnaround, and the same color pass that ships on my own work.
              </p>
            </div>
            <VideoWall videos={videoWork.slice(0, 2)} className="lg:grid-cols-2" />
          </div>
        </div>
      </section>

      <section data-reveal id="tiers" className="scroll-mt-20 border-b border-line">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <h2 className="h-editorial text-4xl sm:text-5xl">{pages.editing.tiersHeading}</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {retainers.map((r) => (
              <div
                key={r.id}
                className={`card card-flush relative flex flex-col ${r.badge ? "card-featured" : ""}`}
              >
                {r.badge && (
                  <span className="absolute -top-3 left-6 z-10 rounded-[6px] bg-accent px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-accent-ink">
                    {r.badge}
                  </span>
                )}
                <div className={`tier-art ${r.badge ? "tier-art-lead" : ""}`}>
                  <Image
                    src={TIER_ART[r.id]?.src ?? TIER_ART.creator.src}
                    alt={TIER_ART[r.id]?.alt ?? TIER_ART.creator.alt}
                    fill
                    sizes="(min-width: 768px) 32vw, 100vw"
                    className="object-cover"
                  />
                  <span className="tier-foot" aria-hidden="true" />
                </div>
                <div className="flex flex-1 flex-col p-6 pt-5 sm:p-7 sm:pt-6">
                <h3 className="text-xl font-bold">{r.title}</h3>
                <p className="mt-1 text-sm text-muted">{r.volume}</p>
                <p className="mt-5 flex items-baseline gap-1.5">
                  <span className="h-editorial text-4xl">${r.price.toLocaleString("en-US")}</span>
                  <span className="text-sm font-semibold text-faint">a month</span>
                </p>
                <p className="mt-4 text-[15px] leading-relaxed text-muted">{r.description}</p>
                <ul className="mt-6 grid gap-2.5">
                  {r.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-muted">
                      <Check size={16} className="mt-0.5 shrink-0 text-accent-bright" weight="bold" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-7">
                  <Link
                    href={`/checkout/retainer/${r.id}`}
                    className={`btn w-full ${payWithStripe ? "btn-stripe" : "btn-primary"}`}
                  >
                    {payWithStripe && <StripeMark size={15} />}
                    Start · ${r.price.toLocaleString("en-US")} a month
                  </Link>
                  <a
                    href="#start"
                    className="mt-3.5 block text-center text-[11px] font-bold uppercase tracking-[0.14em] text-muted transition-colors hover:text-ink"
                  >
                    {pages.editing.bookLabel}
                  </a>
                </div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted">{pages.editing.payNote}</p>
          <ProofCtaNote className="mt-2" />
        </div>
      </section>

      <section data-reveal id="start" className="scroll-mt-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <h2 className="h-editorial text-4xl sm:text-5xl">{pages.editing.formHeading}</h2>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-muted">
              {pages.editing.formIntro}
            </p>
          </div>
          <EditingRequestForm tiers={retainers.map((r) => ({ id: r.id, title: r.title }))} />
        </div>
      </section>
    </>
  );
}
