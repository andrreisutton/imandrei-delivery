import Image from "next/image";
import { ArrowUpRight, Trophy } from "@phosphor-icons/react/dist/ssr";
import type { SiteContent } from "@/content/site";
import { SocialIcon } from "./social-icon";

type Industry = SiteContent["industry"];

function MusoMark({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/logos/muso.svg"
      alt="muso.ai"
      width={255}
      height={64}
      unoptimized
      className={`w-auto ${className}`}
    />
  );
}

export function MusoPanel({
  industry,
  compact = false,
  className = "",
}: {
  industry: Industry;
  compact?: boolean;
  className?: string;
}) {
  const { muso, musoUrl, musoLabel } = industry;

  const profileLink = musoUrl ? (
    <a
      href={musoUrl}
      target="_blank"
      rel="noopener"
      className="btn btn-ghost !px-4 !py-2.5 !text-[11px]"
    >
      {musoLabel}
      <ArrowUpRight size={12} weight="bold" aria-hidden="true" />
    </a>
  ) : null;

  if (compact) {
    return (
      <div className={`card card-pad flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between ${className}`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-7">
          <MusoMark className="h-7 shrink-0 sm:h-8" />
          <dl className="grid grid-cols-4 gap-x-5 gap-y-1 sm:gap-x-7">
            {muso.roles.map((r) => (
              <div key={r.label} className="min-w-0">
                <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-faint">{r.label}</dt>
                <dd className="h-poster mt-1.5 text-3xl tabular-nums sm:text-4xl">{r.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        {profileLink}
      </div>
    );
  }

  return (
    <div className={`card card-pad ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <MusoMark className="h-7 sm:h-8" />
        {profileLink}
      </div>

      <dl className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-[12px] border border-line bg-line sm:grid-cols-4">
        {muso.stats.map((s) => (
          <div key={s.label} className="bg-bg/80 px-4 py-5 sm:px-5 sm:py-6">
            <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-faint">{s.label}</dt>
            <dd className="h-poster mt-2.5 text-5xl tabular-nums sm:text-6xl">{s.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 px-1 text-xs text-faint">{muso.statsNote}</p>

      <div className="mt-9 grid gap-9 lg:grid-cols-[1.35fr_1fr] lg:gap-12">
        {muso.top.length > 0 && (
          <div>
            <h3 className="h-rule text-[10px] sm:text-[11px]">{muso.topHeading}</h3>
            <ol className="mt-4 grid gap-2">
              {muso.top.map((t, i) => (
                <li key={`${t.title}-${i}`}>
                  <a
                    href={t.href}
                    target="_blank"
                    rel="noopener"
                    className="group flex items-center gap-4 rounded-[10px] px-2 py-2 transition-colors duration-200 hover:bg-raised/60"
                  >
                    <span className="relative size-12 shrink-0 overflow-hidden rounded-[6px] bg-raised">
                      {t.cover ? (
                        <Image src={t.cover} alt="" fill sizes="48px" className="object-cover" />
                      ) : null}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-bold text-ink">{t.title}</span>
                      <span className="block truncate text-[13px] text-muted">{t.artists}</span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="block text-[15px] font-bold tabular-nums text-ink">{t.streams}</span>
                      <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-faint">
                        Streams
                      </span>
                    </span>
                    <span className="shrink-0">
                      <SocialIcon label="Spotify" size={18} />
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        )}

        <div>
          <h3 className="h-rule text-[10px] sm:text-[11px]">{muso.rolesNote}</h3>
          <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5">
            {muso.roles.map((r) => (
              <div key={r.label}>
                <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-faint">{r.label}</dt>
                <dd className="h-poster mt-1.5 text-4xl tabular-nums">{r.value}</dd>
              </div>
            ))}
          </dl>
          {muso.chart ? (
            <p className="mt-7 flex items-start gap-2.5 border-t border-line pt-5 text-sm leading-snug text-muted">
              <Trophy size={18} weight="fill" className="mt-px shrink-0 text-accent-bright" aria-hidden="true" />
              {muso.chart}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
