import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { getSiteContent } from "@/lib/content";
import { TrustedByStrip } from "@/components/credentials";
import { HeroWall } from "@/components/hero-wall";
import { InstagramProfile } from "@/components/embeds";

export async function generateMetadata(): Promise<Metadata> {
  const { pages } = await getSiteContent();
  return {
    title: pages.about.heading,
    description: pages.about.paragraphs[0],
  };
}

export default async function AboutPage() {
  const { pages, credentials, home } = await getSiteContent();
  const [lede, ...rest] = pages.about.paragraphs;

  return (
    <>
      <section className="grain-panel relative overflow-hidden">
      <HeroWall scrims={false} />
      <div
        className="wall-read"
        aria-hidden="true"
      />
      <div className="relative z-[2] mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:min-h-[calc(100svh-4rem)] lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch lg:gap-14 lg:py-8">
      <div className="flex flex-col lg:justify-center">
        <div className="relative">
          <h1 className="h-title text-6xl sm:text-8xl relative">
            {pages.about.heading}
          </h1>
        </div>
        <p className="mt-7 max-w-xl text-xl leading-relaxed text-ink sm:text-2xl sm:leading-relaxed lg:text-[21px]">
          {lede}
        </p>
        {rest.map((p) => (
          <p key={p.slice(0, 32)} className="mt-5 max-w-xl text-[16px] leading-relaxed text-muted">
            {p}
          </p>
        ))}

        <div className="mt-9 flex flex-wrap gap-3">
          <Link href="/store" className="btn btn-primary">
            Browse the store
          </Link>
          <Link href="/mixing-mastering" className="btn btn-ghost">
            See mixing & mastering
          </Link>
        </div>
      </div>

      <div className="relative lg:min-h-0">
        <div className="flex flex-col gap-5 lg:absolute lg:inset-0 lg:gap-4">
          <div className="card card-pad-tight grain-panel relative shrink-0">
            <div className="overflow-hidden rounded-[8px]">
              <iframe
                title="andrei! GONE, official music video"
                src="https://www.youtube-nocookie.com/embed/9kBDzXvyl7Y"
                className="block aspect-video w-full lg:aspect-auto lg:h-[clamp(220px,34vh,420px)]"
                style={{ display: "block", border: 0 }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
          <InstagramProfile className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden" />
        </div>
      </div>
      </div>
      </section>

      <TrustedByStrip heading={home.trustedHeading} credentials={credentials} className="border-b-0" />
    </>
  );
}
