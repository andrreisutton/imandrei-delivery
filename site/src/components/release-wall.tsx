import Image from "next/image";
import type { MusicCredit } from "@/content/site";
import { SocialIcon } from "./social-icon";

export function ReleaseWall({ records, className = "" }: { records: MusicCredit[]; className?: string }) {
  if (!records.length) return null;
  return (
    <ul className={`grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-6 ${className}`}>
      {records.map((r, i) => (
        <li key={r.href}>
          <a
            href={r.href}
            target="_blank"
            rel="noopener"
            className="release-tile group block"
            title={`${r.title}: ${r.artists}. ${r.role}.`}
          >
            <span className="relative block aspect-square overflow-hidden rounded-[8px] border border-line bg-surface">
              {r.cover ? (
                <Image
                  src={r.cover}
                  alt={`${r.title}, cover art`}
                  fill
                  sizes="(min-width: 1280px) 16vw, (min-width: 1024px) 24vw, (min-width: 640px) 31vw, 46vw"
                  className="release-art object-cover"
                  priority={i < 6}
                />
              ) : (
                <span className="h-poster flex h-full w-full items-center justify-center text-4xl text-faint">
                  {r.title.slice(0, 1)}
                </span>
              )}
              <span className="release-mark absolute inset-0 flex items-center justify-center">
                <SocialIcon label={r.platform === "apple" ? "Apple Music" : "Spotify"} size={34} />
              </span>
            </span>
            <span className="mt-2.5 block">
              <span className="credential block truncate text-[15px] transition-colors duration-200 group-hover:text-accent-bright sm:text-base">
                {r.title}
              </span>
              <span className="mt-1 block truncate text-[12px] leading-snug text-faint">
                {r.kind} · {r.year}
              </span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
