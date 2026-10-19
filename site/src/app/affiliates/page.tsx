import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { getSiteContent } from "@/lib/content";
import { HeroWall } from "@/components/hero-wall";
import { PartnerCard } from "@/components/partner-card";
import { TrustedByStrip } from "@/components/credentials";

export async function generateMetadata(): Promise<Metadata> {
  const { pages } = await getSiteContent();
  return { title: "Affiliates", description: pages.partners.intro };
}

export default async function AffiliatesPage() {
  const { pages, partners, credentials, home } = await getSiteContent();
  const labels = {
    codeLabel: pages.partners.codeLabel,
    copyLabel: pages.partners.copyLabel,
    copiedLabel: pages.partners.copiedLabel,
    visitLabel: pages.partners.visitLabel,
    referralLabel: pages.partners.referralLabel,
  };

  return (
    <>
      <section className="grain-panel relative overflow-hidden border-b border-line bg-surface/30">
        <HeroWall scrims={false} />
        <div className="wall-read" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-bg via-bg/85 to-transparent" />
        <div className="relative z-[2] mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-24">
          <div className="max-w-2xl">
            <h1 className="h-title text-6xl sm:text-8xl">{pages.partners.heading}</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
              {pages.partners.intro}
            </p>
          </div>
        </div>
      </section>

      <TrustedByStrip heading={home.trustedHeading} credentials={credentials} />

      <section data-reveal>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-6">
            {partners.map((p, i) => {
              const n = partners.length;
              const lastRow = i >= n - (n % 3);
              const lg = n % 3 === 2 && lastRow ? "lg:col-span-3" : n % 3 === 1 && lastRow ? "lg:col-span-6" : "lg:col-span-2";
              const md = n % 2 === 1 && i === n - 1 ? "md:col-span-2" : "";
              return <PartnerCard key={p.name} partner={p} labels={labels} className={`${md} ${lg}`} />;
            })}
          </div>

        </div>
      </section>

      <section data-reveal className="grain-panel relative overflow-hidden border-t border-line">
        <HeroWall scrims={false} />
        <div className="wall-read" aria-hidden="true" />
        <div className="relative z-[2] mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:py-24">
          <p className="mx-auto max-w-xl text-lg leading-relaxed text-muted">{pages.partners.outro}</p>
          <Link href="/services" className="btn btn-primary mt-8">
            Get in touch
          </Link>
        </div>
      </section>
    </>
  );
}
