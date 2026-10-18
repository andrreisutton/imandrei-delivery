import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import type { Photo, PhotoSet } from "@/content/site";
import { SocialIcon } from "./social-icon";

function PhotoTile({
  photo,
  href,
  sizes,
  label,
}: {
  photo: Photo;
  href: string;
  sizes: string;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      aria-label={label}
      className="group relative block aspect-[4/5] overflow-hidden rounded-[12px] border border-line bg-surface"
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={sizes}
        className="object-cover transition-[filter] duration-300 [transition-timing-function:var(--ease-out-quint)] group-hover:brightness-[0.45]"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-300 [transition-timing-function:var(--ease-out-quint)] group-hover:opacity-100"
      >
        <SocialIcon label="Instagram" size={30} />
      </span>
    </a>
  );
}

export function PhotoWall({ sets, className = "" }: { sets: PhotoSet[]; className?: string }) {
  if (!sets.length) return null;
  return (
    <div className={`grid gap-12 ${className}`}>
      {sets.map((s) => {
        const wide = s.photos.length % 3 === 0;
        return (
          <section key={s.id} aria-label={`${s.artist}, ${s.note}`}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
              <p className="flex items-baseline gap-3">
                <span className="credential text-2xl sm:text-3xl">{s.artist}</span>
                <span className="text-sm text-muted">{s.note}</span>
              </p>
              <a
                href={s.href}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-faint transition-colors duration-200 hover:text-ink"
              >
                <SocialIcon label="Instagram" size={13} />
                The full set
                <ArrowUpRight size={11} weight="bold" aria-hidden="true" />
              </a>
            </div>
            <div
              className={`mt-4 grid grid-cols-2 gap-2.5 sm:gap-3 ${wide ? "md:grid-cols-3" : "md:grid-cols-4"}`}
            >
              {s.photos.map((ph) => (
                <PhotoTile
                  key={ph.src}
                  photo={ph}
                  href={s.href}
                  label={`${ph.alt}. Open the set on Instagram`}
                  sizes={wide ? "(min-width: 768px) 33vw, 50vw" : "(min-width: 768px) 25vw, 50vw"}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export function PhotoStrip({ sets, count = 8, className = "" }: { sets: PhotoSet[]; count?: number; className?: string }) {
  const picks: { photo: Photo; set: PhotoSet }[] = [];
  const longest = Math.max(0, ...sets.map((s) => s.photos.length));
  for (let i = 0; i < longest && picks.length < count; i++) {
    for (const s of sets) {
      if (s.photos[i] && picks.length < count) picks.push({ photo: s.photos[i], set: s });
    }
  }
  if (!picks.length) return null;

  return (
    <ul
      className={`no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-4 sm:gap-3 sm:overflow-visible sm:px-0 ${className}`}
    >
      {picks.map(({ photo, set }) => (
        <li key={photo.src} className="w-[62vw] shrink-0 snap-start sm:w-auto">
          <PhotoTile
            photo={photo}
            href={set.href}
            label={`${photo.alt}. Open the ${set.artist} set on Instagram`}
            sizes="(min-width: 640px) 25vw, 62vw"
          />
          <p className="mt-2 px-0.5 text-[13px] text-muted">
            <span className="font-bold text-ink">{set.artist}</span> · {set.note}
          </p>
        </li>
      ))}
    </ul>
  );
}
