import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { Check } from "@phosphor-icons/react/dist/ssr";
import { getSiteContent } from "@/lib/content";
import { HeroWall } from "@/components/hero-wall";
import { TrustedByStrip } from "@/components/credentials";
import { ProductCover } from "@/components/product-cover";
import { ServiceLines, buildServiceLines } from "@/components/service-lines";
import { ProofCtaNote } from "@/components/proof";

export async function generateMetadata(): Promise<Metadata> {
  const { pages } = await getSiteContent();
  return { title: "Services", description: pages.services.intro };
}

export default async function ServicesPage() {
  const { pages, products, retainers, sessions, credentials, home } = await getSiteContent();
  const mixing = products.filter((p) => p.type === "service");
  const lines = buildServiceLines({ products, retainers, sessions });

  return (
    <>
      <section className="grain-panel relative overflow-hidden border-b border-line bg-surface/30">
        <HeroWall scrims={false} />
        <div className="wall-read" aria-hidden="true" />
        <div
          className="absolute inset-y-0 right-0 hidden w-1/2 items-center pr-6 opacity-80 lg:flex"
          aria-hidden="true"
        >
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-bg via-bg/85 to-transparent" />
        <div className="relative z-[2] mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-24">
          <div className="max-w-2xl">
            <h1 className="h-title text-6xl sm:text-8xl">{pages.services.heading}</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">{pages.services.intro}</p>
          </div>
        </div>
      </section>

      <TrustedByStrip heading={home.trustedHeading} credentials={credentials} />

      <section data-reveal className="border-b border-line">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
          <ServiceLines lines={lines} />
        </div>
      </section>

      <section data-reveal className="border-b border-line">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="h-editorial text-4xl sm:text-5xl">Per song</h2>
            <Link
              href="/mixing-mastering"
              className="shrink-0 text-sm font-semibold text-muted transition-colors hover:text-ink"
            >
              Full mixing page →
            </Link>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {mixing.map((s) => (
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
                  <p className="h-editorial text-4xl">${s.price.toLocaleString("en-US")}</p>
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
                      className={`btn w-full ${s.badge ? "btn-primary" : "btn-ghost"}`}
                    >
                      {pages.mixing.bookLabel} · ${s.price}
                    </Link>
                  </div>
                </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section data-reveal>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <h2 className="h-rule text-[11px] sm:text-xs">An hour in the room</h2>
          <ul className="card card-flush mt-8 grid gap-px bg-line md:grid-cols-2">
            {sessions.map((s) => (
              <li key={s.id} className="flex flex-col justify-between gap-6 bg-bg p-7 sm:p-8">
                <div>
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h3 className="text-xl font-bold">{s.title}</h3>
                    <p className="h-editorial text-2xl">${s.price.toLocaleString("en-US")}</p>
                  </div>
                  <p className="mt-1 text-sm text-faint">{s.duration}</p>
                  <p className="mt-4 text-[15px] leading-relaxed text-muted">{s.description}</p>
                </div>
                <Link href="/book" className="btn btn-ghost w-full">
                  Book this session
                </Link>
              </li>
            ))}
          </ul>

          <ProofCtaNote className="mt-5" />
        </div>
      </section>
      <section data-reveal className="grain-panel relative overflow-hidden border-t border-line">
        <HeroWall scrims={false} />
        <div className="wall-read" aria-hidden="true" />
        <div className="relative z-[2] mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:py-24">
          <p className="mx-auto max-w-xl text-lg leading-relaxed text-muted">{pages.services.outro}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/mixing-mastering#form" className="btn btn-primary">
              Send the details
            </Link>
            <Link href="/store" className="btn btn-ghost">
              Or browse the store
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
