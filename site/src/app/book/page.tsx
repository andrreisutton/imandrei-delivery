import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content";
import { TrustedByStrip } from "@/components/credentials";
import { stripeEnabled } from "@/lib/stripe";
import { Waveform } from "@/components/waveform";
import { ApertureDisc } from "@/components/aperture-disc";
import { HeroWall } from "@/components/hero-wall";
import { ProofCtaNote } from "@/components/proof";
import { BookingForm } from "./booking-form";

export async function generateMetadata(): Promise<Metadata> {
  const { brand, pages } = await getSiteContent();
  const shareTitle = `Book studio time with ${brand.name}`;
  return {
    title: "Book a Session",
    description: pages.book.intro,
    openGraph: {
      title: shareTitle,
      description: pages.book.intro,
      type: "website",
      url: "/book",
      images: [
        {
          url: "/og-book.png",
          width: 1200,
          height: 630,
          alt: `${brand.name}. Book time with Andrei: attended mix sessions and color or edit sessions, paid by card.`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description: pages.book.intro,
      images: ["/og-book.png"],
    },
  };
}

const SESSION_HUES = [25, 14, 30, 18];

export const dynamic = "force-dynamic";

function nextDays() {
  const tz = "America/New_York";
  const iso = new Intl.DateTimeFormat("en-CA", { timeZone: tz });
  const now = Date.now();
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date(now + i * 86400000);
    return {
      value: iso.format(d),
      weekday:
        i === 0 ? "Today" : d.toLocaleDateString("en-US", { weekday: "short", timeZone: tz }),
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: tz }),
    };
  });
}

export default async function BookPage() {
  const { sessions, pages, credentials, home } = await getSiteContent();
  const days = nextDays();
  return (
    <>
      <TrustedByStrip heading={home.trustedHeading} credentials={credentials} className="border-t-0" />
      <section className="grain-panel relative overflow-hidden border-b border-line bg-surface/30">
        <HeroWall scrims={false} />
        <div className="wall-read" aria-hidden="true" />
        <div className="relative z-[2] mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="max-w-2xl">
            <h1 className="h-title text-6xl sm:text-8xl">{pages.book.heading}</h1>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-muted">{pages.book.intro}</p>
            <ProofCtaNote className="mt-5" />
          </div>
        </div>
      </section>
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>

          <div className="mt-10 grid gap-4">
            {sessions.map((s, i) => {
              const hue = SESSION_HUES[i % SESSION_HUES.length];
              return (
                <div
                  key={s.id}
                  className="card card-pad card-interactive group relative overflow-hidden hover:shadow-[0_20px_44px_-18px_oklch(0_0_0_/_60%)]"
                >
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      backgroundImage: `repeating-radial-gradient(circle at 110% 50%, transparent 0 11px, oklch(0.85 0.06 ${hue} / 3.5%) 11px 12.5px)`,
                    }}
                    aria-hidden="true"
                  />
                  <ApertureDisc
                    hue={hue}
                    className="absolute -right-12 top-1/2 w-40 -translate-y-1/2 opacity-90 drop-shadow-[0_14px_24px_oklch(0_0_0_/_45%)] sm:-right-9"
                  />
                  <div className="relative pr-28">
                    <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-faint">
                      {s.duration}
                    </p>
                    <div className="mt-1.5 flex items-baseline justify-between gap-4">
                      <h2 className="text-lg font-bold">{s.title}</h2>
                      <span className="text-lg font-semibold">${s.price}</span>
                    </div>
                    <p className="mt-3 text-[15px] leading-relaxed text-muted">{s.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            className="card card-flush card-interactive group relative mt-8 hidden aspect-[16/10] lg:flex lg:items-center lg:px-8"
            aria-hidden="true"
          >
            <div className="absolute left-8 top-6 text-[10px] font-medium uppercase tracking-[0.22em] text-faint">
              In session · 48kHz
            </div>
            <Waveform seed="session-room" bars={64} mode="ambient" className="h-24 w-full text-accent-bright/60" />
          </div>
        </div>

        <BookingForm
          sessions={sessions.map((s) => ({
            id: s.id,
            title: s.title,
            price: s.price,
            duration: s.duration,
          }))}
          days={days}
          stripeOn={stripeEnabled()}
        />
      </div>
    </div>
    </>
  );
}
