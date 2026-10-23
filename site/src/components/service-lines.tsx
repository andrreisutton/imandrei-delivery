import Image from "next/image";
import { Link } from "next-view-transitions";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import type { Product, Retainer, Session } from "@/content/site";

function money(n: number) {
  return `$${n.toLocaleString("en-US")}`;
}

/**
 * Each lane carries the work it actually produces, not a decorative photo:
 * records for the mixing lane, a frame off a show for the editing lane, and
 * the graded still for the hour in the room, which is literally what that
 * hour is spent doing. All of it is Andrei's own, so the art is the proof.
 */
type LaneArt =
  | { kind: "covers"; covers: string[] }
  | { kind: "photo"; src: string; alt: string }
  | { kind: "grade"; before: string; after: string; alt: string };

export type ServiceLine = {
  title: string;
  body: string;
  from: string;
  href: string;
  cta: string;
  art: LaneArt;
};

/**
 * Three columns, two rows. The bright, striking covers go in the top row where
 * the picture runs clean; the dark ones go in the bottom row, under the copy.
 * Bottom-weighting the ARTWORK as well as the gradient is what lets the records
 * stay vivid instead of being crushed by a scrim heavy enough to carry type.
 */
const MIX_COVERS = [
  "/covers/cold-october.jpg",
  "/covers/21.jpg",
  "/covers/ain-t-over.jpg",
  "/covers/euphoria.jpg",
  "/covers/bad.jpg",
  "/covers/12345.jpg",
];

export function buildServiceLines({
  products,
  retainers,
  sessions,
}: {
  products: Product[];
  retainers: Retainer[];
  sessions: Session[];
}): ServiceLine[] {
  const servicePrices = products
    .filter((p) => p.type === "service" && p.category !== "photoVideo")
    .map((p) => p.price);
  const photoVideoPrices = products
    .filter((p) => p.type === "service" && p.category === "photoVideo" && p.price > 0)
    .map((p) => p.price);
  const lines: ServiceLine[] = [];

  if (servicePrices.length) {
    lines.push({
      title: "Mixing & Mastering",
      body: "Send the stems, get back a record referenced against the songs you want to sit next to. Mix, master, or both.",
      from: `From ${money(Math.min(...servicePrices))} a song`,
      href: "/mixing-mastering",
      cta: "See the tiers",
      art: { kind: "covers", covers: MIX_COVERS },
    });
  }
  if (photoVideoPrices.length) {
    lines.push({
      title: "Photo & Video",
      body: "On-site coverage, shot and edited by me. Pick a package or send the details for a custom quote — traveling me in is no problem.",
      from: `From ${money(Math.min(...photoVideoPrices))}`,
      href: "/photo-video",
      cta: "See the packages",
      art: {
        kind: "photo",
        src: "/photos/skies-1.jpg",
        alt: "Lil Skies performing, shot by Andrei",
      },
    });
  }
  if (retainers.length) {
    lines.push({
      title: "Monthly Editing",
      body: "I cut your channel every month: long form, the shorts out of it, thumbnails, and the color on all of it.",
      from: `From ${money(Math.min(...retainers.map((r) => r.price)))} a month`,
      href: "/editing",
      cta: "See the tiers",
      art: {
        kind: "photo",
        src: "/photos/ian-1.jpg",
        alt: "ian mid set under red wash, shot and cut by Andrei",
      },
    });
  }
  if (sessions.length) {
    lines.push({
      title: "One on One",
      body: "An hour in the room. Bring your footage or your session, watch it come together, and leave with a workflow you can repeat.",
      from: `From ${money(Math.min(...sessions.map((s) => s.price)))}`,
      href: "/book",
      cta: "Book a session",
      art: {
        kind: "grade",
        before: "/grade/ian-before.jpg",
        after: "/grade/ian-after.jpg",
        alt: "The same frame before and after the grade",
      },
    });
  }
  return lines;
}

function LaneArtwork({ art, feature }: { art: LaneArt; feature: boolean }) {
  const sizes = feature
    ? "(min-width: 1024px) 60vw, 100vw"
    : "(min-width: 1024px) 34vw, 100vw";

  if (art.kind === "covers") {
    return (
      <span className="lane-art lane-art-dense absolute inset-0 grid grid-cols-3 gap-px bg-line">
        {art.covers.map((c, i) => (
          <span key={c} className="relative block overflow-hidden bg-surface">
            <Image
              src={c}
              alt=""
              fill
              sizes="(min-width: 1024px) 20vw, 34vw"
              className="object-cover"
              priority={i < 3}
            />
          </span>
        ))}
      </span>
    );
  }

  if (art.kind === "grade") {
    // Split frame: the raw half meets the graded half on a hard seam, which is
    // the whole point of the session in one image.
    return (
      <span className="lane-art lane-art-dense absolute inset-0">
        <span className="absolute inset-0">
          <Image src={art.after} alt={art.alt} fill sizes={sizes} className="object-cover" />
        </span>
        <span className="absolute inset-y-0 left-0 w-1/2 overflow-hidden">
          <span className="absolute inset-y-0 left-0 w-[200%]">
            <Image src={art.before} alt="" fill sizes={sizes} className="object-cover" />
          </span>
        </span>
        <span className="absolute inset-y-0 left-1/2 w-px bg-ink/45" aria-hidden="true" />
      </span>
    );
  }

  return (
    <span className="lane-art lane-art-dense absolute inset-0">
      <Image src={art.src} alt={art.alt} fill sizes={sizes} className="object-cover" />
    </span>
  );
}

export function ServiceLines({ lines, className = "" }: { lines: ServiceLine[]; className?: string }) {
  if (!lines.length) return null;
  return (
    <div
      className={`grid gap-4 lg:grid-cols-3 lg:grid-rows-2 lg:gap-5 ${className}`}
    >
      {lines.map((l, i) => {
        const feature = i === 0;
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`lane group relative flex min-h-[22rem] flex-col justify-end overflow-hidden rounded-[12px] border border-line ${
              feature
                ? "lg:col-span-2 lg:row-span-2 lg:min-h-[32rem]"
                : "lg:col-span-1 lg:row-span-1 lg:min-h-[22rem]"
            }`}
          >
            <LaneArtwork art={l.art} feature={feature} />
            {/* Bottom-weighted, so the picture runs clean across the top and the
                copy sits on a dark foot rather than a wash over the whole frame. */}
            <span className="lane-foot absolute inset-x-0 bottom-0 h-[72%]" aria-hidden="true" />
            <span className="relative z-[2] p-6 sm:p-7">
              <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-accent-bright">
                {l.from}
              </span>
              <span
                className={`h-editorial mt-2.5 block transition-colors duration-200 group-hover:text-accent-bright ${
                  feature ? "text-3xl sm:text-4xl" : "text-2xl sm:text-[1.75rem]"
                }`}
              >
                {l.title}
              </span>
              <span
                className={`mt-3 block leading-relaxed text-ink/85 ${
                  feature ? "max-w-md text-[15px]" : "line-clamp-2 text-sm"
                }`}
              >
                {l.body}
              </span>
              <span className="mt-5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-ink">
                {l.cta}
                <ArrowRight
                  size={13}
                  weight="bold"
                  aria-hidden="true"
                  className="transition-transform duration-200 [transition-timing-function:var(--ease-out-quint)] group-hover:translate-x-1"
                />
              </span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
