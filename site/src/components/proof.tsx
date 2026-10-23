import { Link } from "next-view-transitions";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { SocialIcon } from "./social-icon";

const RECAP = {
  videoId: "MnZgt0shLco",
  videoUrl: "https://www.youtube.com/watch?v=MnZgt0shLco",
  videoTitle: "Lil Skies Tour recap, October 2025",
  channelUrl: "https://www.youtube.com/@andreisutton",
};

const copy = {
  badge: "See my own work",
  eyebrow: "Real work · From my channel",
  heading: "The Lil Skies tour stop, through this lens.",
  body1:
    "When the tour came through, I was on the floor with a camera. The recap is my shot, my cut, my color.",
  body2:
    "That finish is not a separate service I buy in. I cut in Premiere Pro and grade in DaVinci Resolve with the same PowerGrade sitting in the store, and the records I release as andrei! go through the same ear you are booking for your mix.",
  plaque: ["Shot on the floor", "Cut in Premiere Pro", "Colored with the Everyday PowerGrade"],
  plaqueLabel: "One pair of hands, end to end",
  watchCta: "Watch the recap",
  browseCta: "Browse the store",
  videoCaption:
    "From my channel: the Lil Skies Tour recap, October 2025. Shot, cut, and colored by me.",
  ctaNoteLink: "My own work",
  storeStrip: "is shot, cut, and colored with the exact tools on this page.",
  mixingStrip: "Your mix gets someone who also shoots and grades my own records. One taste, end to end.",
  reviewEyebrow: "Notable work",
  reviewMeta: "Shot, cut, and colored by me",
  reviewSource: "on my channel",
  reviewLink: "Watch my work",
};

// Points at one specific showcase video; only the dedicated ProofSection
// below should use this.
function RecapLink({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <a href={RECAP.videoUrl} target="_blank" rel="noopener" className={className}>
      {children}
    </a>
  );
}

// Points at the whole channel, for the generic "my work uses these tools"
// callouts that appear across the site.
function ChannelLink({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <a href={RECAP.channelUrl} target="_blank" rel="noopener" className={className}>
      {children}
    </a>
  );
}

export function ProofHeroBadge() {
  return (
    <ChannelLink className="group mb-7 inline-flex items-center gap-2.5 rounded-[8px] border border-line-strong bg-surface/70 py-2 pl-3.5 pr-3.5 backdrop-blur-md transition-[border-color,background-color] duration-200 hover:border-accent-bright/50 hover:bg-surface">
      <SocialIcon label="YouTube" size={15} />
      <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted transition-colors duration-200 group-hover:text-ink">
        {copy.badge}
      </span>
      <ArrowUpRight
        size={12}
        weight="bold"
        className="text-faint transition-colors duration-200 group-hover:text-ink"
        aria-hidden="true"
      />
    </ChannelLink>
  );
}

export function ProofSection() {
  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="grain-panel card card-flush relative">
          <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
            <div className="p-7 sm:p-10 lg:p-12">
              <p className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-faint">
                <SocialIcon label="YouTube" size={14} />
                {copy.eyebrow}
              </p>
              <h2 className="h-editorial text-4xl sm:text-5xl mt-4">
                {copy.heading}
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-muted">{copy.body1}</p>
              <p className="mt-4 text-lg leading-relaxed text-muted">{copy.body2}</p>

              <figure className="mt-7 rounded-[8px] border border-line bg-bg/60 p-5 shadow-[inset_0_1px_0_oklch(1_0_0_/_5%)]">
                <figcaption className="text-[11px] font-semibold uppercase tracking-[0.18em] text-faint">
                  {copy.plaqueLabel}
                </figcaption>
                <ul className="mt-3 grid gap-1.5">
                  {copy.plaque.map((line) => (
                    <li key={line} className="h-poster text-xl sm:text-2xl">
                      {line}
                    </li>
                  ))}
                </ul>
              </figure>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/store" className="btn btn-primary">
                  {copy.browseCta}
                </Link>
                <RecapLink className="btn btn-ghost">
                  <SocialIcon label="YouTube" size={17} />
                  {copy.watchCta}
                </RecapLink>
              </div>
            </div>

            <div className="flex flex-col justify-center border-t border-line p-4 sm:p-6 lg:border-l lg:border-t-0">
              <div className="card card-pad-tight">
                <iframe
                  title={RECAP.videoTitle}
                  src={`https://www.youtube-nocookie.com/embed/${RECAP.videoId}`}
                  className="aspect-video w-full rounded-[8px]"
                  style={{ display: "block", border: 0 }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
              <p className="mt-3.5 px-1 text-sm leading-relaxed text-muted">{copy.videoCaption}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProofCtaNote({
  className = "",
  variant = "visual",
}: {
  className?: string;
  variant?: "visual" | "mixing" | "editing";
}) {
  const tail =
    variant === "mixing"
      ? "gets mixed and mastered by the same ear"
      : variant === "editing"
        ? "is cut and graded with these tools"
        : "is shot with these tools";
  return (
    <p className={`flex items-center gap-2 text-xs text-faint ${className}`}>
      <SocialIcon label="YouTube" size={13} />
      <span>
        <ChannelLink className="font-semibold text-muted underline-offset-4 transition-colors hover:text-ink hover:underline">
          {copy.ctaNoteLink}
        </ChannelLink>{" "}
        {tail}
      </span>
    </p>
  );
}

export function ProofStrip({ variant = "store" }: { variant?: "store" | "mixing" }) {
  return (
    <div className="mt-6 inline-flex max-w-full items-center gap-3 rounded-[8px] border border-line bg-surface/60 py-3 pl-4 pr-5 shadow-[inset_0_1px_0_oklch(1_0_0_/_5%)]">
      <SocialIcon label="YouTube" size={16} />
      <p className="text-sm leading-snug text-muted">
        {variant === "mixing" ? (
          copy.mixingStrip
        ) : (
          <>
            <ChannelLink className="font-semibold text-ink underline-offset-4 hover:underline">
              {copy.ctaNoteLink}
            </ChannelLink>{" "}
            {copy.storeStrip}
          </>
        )}
      </p>
    </div>
  );
}

export function ProofReviewPlaque() {
  return (
    <div className="grain-panel card card-pad relative mt-10 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1.5">
        <p className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-faint">
          <SocialIcon label="YouTube" size={14} />
          {copy.reviewEyebrow}
        </p>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-faint">
          {copy.reviewSource}
        </p>
      </div>
      <blockquote className="h-editorial mt-4 text-3xl sm:text-4xl">
        {copy.ctaNoteLink}
      </blockquote>
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
        <span>{copy.reviewMeta}</span>
        <span aria-hidden="true">·</span>
        <ChannelLink className="inline-flex items-center gap-1 font-semibold text-ink underline-offset-4 hover:underline">
          {copy.reviewLink}
          <ArrowUpRight size={12} weight="bold" aria-hidden="true" />
        </ChannelLink>
      </div>
    </div>
  );
}
