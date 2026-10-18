import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { getSiteContent } from "@/lib/content";
import { withNewReleases } from "@/lib/catalogue";
import { HeroWall } from "@/components/hero-wall";
import { CredentialRoster } from "@/components/credentials";
import { VideoWall } from "@/components/video-wall";
import { ReleaseWall } from "@/components/release-wall";
import { SpotifyPlaylist, InstagramProfile } from "@/components/embeds";
import { MusoPanel } from "@/components/muso-panel";

export async function generateMetadata(): Promise<Metadata> {
  const { pages } = await getSiteContent();
  return { title: "Credits", description: pages.credits.intro };
}

export default async function CreditsPage() {
  const content = await getSiteContent();
  const { pages, credentials, videoWork, industry, collaborators, home } = content;
  const musicCredits = await withNewReleases(content.musicCredits);
  const releaseCount = musicCredits.length;
  const featureCount = musicCredits.filter((m) => m.role.startsWith("Featured artist")).length;

  return (
    <>
      <section className="grain-panel relative overflow-hidden border-b border-line bg-surface/30">
        <HeroWall scrims={false} />
        <div className="wall-read" aria-hidden="true" />
        <div className="relative z-[2] mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-24">
          <div className="max-w-2xl">
            <h1 className="h-title text-6xl sm:text-8xl">{pages.credits.heading}</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">{pages.credits.intro}</p>
          </div>
        </div>
      </section>

      <section data-reveal className="border-b border-line">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
          <h2 className="h-rule text-[11px] sm:text-xs">{home.trustedHeading}</h2>
          <CredentialRoster credentials={credentials} className="mt-7" />
        </div>
      </section>

      <section data-reveal className="border-b border-line">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <h2 className="h-editorial text-4xl sm:text-5xl">{pages.credits.workHeading}</h2>
          <VideoWall videos={videoWork} className="mt-8" />
        </div>
      </section>

      <section data-reveal className="border-b border-line">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="max-w-2xl">
            <h2 className="h-editorial text-4xl sm:text-5xl">{pages.credits.musicHeading}</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">{pages.credits.musicIntro}</p>
          </div>

          <MusoPanel industry={industry} className="mt-8" />

          {musicCredits.length > 0 && (
            <>
              <div className="mt-12 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                <h3 className="h-rule text-[11px] sm:text-xs">{pages.credits.recordsHeading}</h3>
                <p className="text-sm text-faint">
                  {releaseCount} releases · {featureCount} as a featured artist ·{" "}
                  {collaborators.length} collaborators
                </p>
              </div>
              <ReleaseWall records={musicCredits} className="mt-7" />
            </>
          )}

          {collaborators.length > 0 && (
            <>
              <h3 className="h-rule mt-12 text-[11px] sm:text-xs">{pages.credits.collabHeading}</h3>
              <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-3 lg:grid-cols-4">
                {collaborators.map((c) => (
                  <li key={c.name} className="border-t border-line-strong pt-4">
                    {c.videoUrl ? (
                      <a
                        href={c.videoUrl}
                        target="_blank"
                        rel="noopener"
                        className="credential text-lg transition-colors duration-200 hover:text-accent-bright sm:text-xl"
                        title={c.role}
                      >
                        {c.name}
                      </a>
                    ) : (
                      <span className="credential text-lg sm:text-xl">{c.name}</span>
                    )}
                    <p className="mt-1.5 text-[13px] leading-snug text-muted">{c.role}</p>
                  </li>
                ))}
              </ul>
            </>
          )}

          <div className="mt-12 grid items-start gap-5 lg:grid-cols-[1.25fr_0.75fr]">
            <SpotifyPlaylist height={420} />
            <InstagramProfile />
          </div>
        </div>
      </section>

      <section data-reveal>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
            <div>
              <h2 className="h-rule text-[11px] sm:text-xs">{pages.credits.editingHeading}</h2>
              <p className="mt-5 text-lg leading-relaxed text-muted">
                The recurring side of the work: channels that hand me their footage every
                month. That is the same schedule and the same color pass behind the monthly
                editing tiers, which is why they are priced the way they are.
              </p>
              <Link href="/editing" className="btn btn-primary mt-7">
                See monthly editing
              </Link>
            </div>
            <div className="grid content-start gap-5">
              {industry.editingClients.map((ec, i) => (
                <div
                  key={ec.name || i}
                  className="card card-pad"
                >
                  <p className="h-editorial text-2xl sm:text-3xl">{ec.name || ec.note}</p>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-muted">
                    {ec.name ? `${ec.note}. ${ec.role}.` : `${ec.role}.`}
                  </p>
                  {ec.href && (
                    <a
                      href={ec.href}
                      target="_blank"
                      rel="noopener"
                      className="mt-4 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:text-accent-bright"
                    >
                      Open the channel
                      <ArrowUpRight size={12} weight="bold" aria-hidden="true" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
