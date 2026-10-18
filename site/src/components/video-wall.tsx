"use client";

import { SocialIcon } from "./social-icon";
import { useState } from "react";
import { ArrowUpRight, PlayIcon } from "@phosphor-icons/react";
import type { VideoWork } from "@/content/site";

const SCENE_FIG = "lg:grid lg:grid-cols-[2fr_1fr]";
const SCENE_CAP = "lg:flex lg:flex-col lg:justify-center lg:border-l lg:border-t-0 lg:px-8 lg:py-8";

function LocalTile({ v, priority, scene }: { v: VideoWork; priority: boolean; scene: boolean }) {
  const [playing, setPlaying] = useState(false);
  const local = v.local!;

  return (
    <figure className={`card card-flush card-interactive group hover:shadow-[inset_0_1px_0_oklch(1_0_0_/_7%),0_20px_44px_-18px_oklch(0_0_0_/_65%)] ${scene ? SCENE_FIG : ""}`}>
      <div className="relative aspect-video w-full overflow-hidden bg-bg">
        {playing ? (
          <video
            src={local.src}
            poster={local.poster}
            className="absolute inset-0 size-full object-cover"
            autoPlay
            muted
            playsInline
            controls
            loop
            aria-label={v.title}
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="absolute inset-0 size-full cursor-pointer"
            aria-label={`Play ${v.title}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={local.poster}
              alt=""
              aria-hidden="true"
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : "auto"}
              className="size-full object-cover"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-bg/85 via-bg/10 to-transparent"
            />
            <span
              aria-hidden="true"
              className="absolute right-3 top-3 flex size-7 items-center justify-center rounded-[6px] bg-bg/70 backdrop-blur-sm"
            >
              <SocialIcon label="Instagram" size={15} />
            </span>
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/60 bg-bg/70 backdrop-blur-sm transition-[background-color,border-color] duration-200 [transition-timing-function:var(--ease-out-quint)] group-hover:border-accent-bright group-hover:bg-accent"
            >
              <PlayIcon size={20} weight="fill" className="ml-0.5 text-ink" />
            </span>
          </button>
        )}
      </div>
      <figcaption className={`border-t border-line px-4 pb-4 pt-3.5 ${scene ? SCENE_CAP : ""}`}>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-faint">{v.year}</p>
        <h3 className={`mt-1.5 text-[15px] font-bold leading-snug text-ink ${scene ? "lg:text-2xl lg:tracking-[-0.01em]" : ""}`}>{v.title}</h3>
        <p className="mt-1 text-sm leading-snug text-muted">{v.credit}</p>
        <a
          href={local.href}
          target="_blank"
          rel="noopener"
          className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-faint transition-colors duration-200 hover:text-ink"
        >
          <SocialIcon label="Instagram" size={13} />
          With sound on Instagram
          <ArrowUpRight size={11} weight="bold" aria-hidden="true" />
        </a>
      </figcaption>
    </figure>
  );
}

function Tile({ v, priority, scene = false }: { v: VideoWork; priority: boolean; scene?: boolean }) {
  const [playing, setPlaying] = useState(false);
  if (v.local) return <LocalTile v={v} priority={priority} scene={scene} />;

  return (
    <figure className={`card card-flush card-interactive group hover:shadow-[inset_0_1px_0_oklch(1_0_0_/_7%),0_20px_44px_-18px_oklch(0_0_0_/_65%)] ${scene ? SCENE_FIG : ""}`}>
      <div className="relative aspect-video w-full overflow-hidden bg-bg">
        {playing ? (
          <iframe
            title={v.title}
            src={`https://www.youtube-nocookie.com/embed/${v.videoId}?autoplay=1`}
            className="absolute inset-0 size-full"
            style={{ border: 0 }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="absolute inset-0 size-full cursor-pointer"
            aria-label={`Play ${v.title}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`}
              alt=""
              aria-hidden="true"
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : "auto"}
              className="size-full scale-[1.35] object-cover"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-bg/85 via-bg/10 to-transparent"
            />
            <span
              aria-hidden="true"
              className="absolute right-3 top-3 flex size-7 items-center justify-center rounded-[6px] bg-bg/70 backdrop-blur-sm"
            >
              <SocialIcon label="YouTube" size={15} />
            </span>
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/60 bg-bg/70 backdrop-blur-sm transition-[background-color,border-color] duration-200 [transition-timing-function:var(--ease-out-quint)] group-hover:border-accent-bright group-hover:bg-accent"
            >
              <PlayIcon size={20} weight="fill" className="ml-0.5 text-ink" />
            </span>
          </button>
        )}
      </div>
      <figcaption className={`border-t border-line px-4 pb-4 pt-3.5 ${scene ? SCENE_CAP : ""}`}>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-faint">{v.year}</p>
        <h3 className={`mt-1.5 text-[15px] font-bold leading-snug text-ink ${scene ? "lg:text-2xl lg:tracking-[-0.01em]" : ""}`}>{v.title}</h3>
        <p className="mt-1 text-sm leading-snug text-muted">{v.credit}</p>
      </figcaption>
    </figure>
  );
}

export function VideoWall({
  videos,
  columns = 3,
  className = "",
}: {
  videos: VideoWork[];
  columns?: 3 | 4;
  className?: string;
}) {
  if (!videos.length) return null;
  const n = videos.length;
  if (columns === 4) {
    return (
      <div className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-4 ${className}`}>
        {videos.map((v, i) => (
          <Tile key={v.videoId} v={v} priority={i === 0} />
        ))}
      </div>
    );
  }
  const rest = n % 3;
  const scene = n > 1 && rest === 1;
  const lgSpan = (i: number) =>
    n === 1 ? "lg:col-span-6" : scene && i === 0 ? "lg:col-span-6" : rest === 2 && i < 2 ? "lg:col-span-3" : "lg:col-span-2";
  const smSpan = (i: number) => (n > 1 && n % 2 === 1 && i === 0 ? "sm:col-span-2" : "");
  return (
    <div className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-6 ${className}`}>
      {videos.map((v, i) => (
        <div key={v.videoId} className={`grid ${smSpan(i)} ${lgSpan(i)}`}>
          <Tile v={v} priority={i === 0} scene={i === 0 && scene} />
        </div>
      ))}
    </div>
  );
}
