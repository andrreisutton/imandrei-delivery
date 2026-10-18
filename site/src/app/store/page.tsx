import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content";
import { PresetGrid } from "./preset-grid";
import { HeroWall } from "@/components/hero-wall";
import { ProofStrip } from "@/components/proof";
import { TrustedByStrip } from "@/components/credentials";
import { DawBadge } from "@/components/daw-badge";

export async function generateMetadata(): Promise<Metadata> {
  const { pages } = await getSiteContent();
  return {
    title: "PowerGrades, Presets & Templates",
    description: pages.presets.intro,
  };
}

export default async function PresetsPage() {
  const { products, pages, home, credentials } = await getSiteContent();
  const items = products.filter((p) => p.type === "preset" || p.type === "template");
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
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
      <PresetGrid items={items} />
      </div>
    </>
  );
}
