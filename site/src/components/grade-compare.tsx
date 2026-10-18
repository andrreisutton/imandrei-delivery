"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CaretLeft, CaretRight, PauseIcon, PlayIcon } from "@phosphor-icons/react";
import { Scene, graded, LOG } from "./cover-visuals";
import type { CompareSet } from "@/content/site";

const DEFAULT_BEFORE = "/grade/ian-before.jpg";
const DEFAULT_AFTER = "/grade/ian-after.jpg";
const DEFAULT_CAPTION = "ian, US Tour Pt. 2. Shot, cut, and graded by me.";
const DEFAULT_CAPTION_HREF = "https://youtu.be/u__UrPnkzYI";

const START = 50;
const STEP = 4;
const BIG_STEP = 12;
const DRIFT = 0.084;

function clamp(n: number) {
  return Math.max(0, Math.min(100, n));
}

function useSyncedPair(enabled: boolean, rootRef: React.RefObject<HTMLDivElement | null>) {
  const beforeRef = useRef<HTMLVideoElement>(null);
  const afterRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const userPaused = useRef(false);
  const playRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (!enabled) return;
    const root = rootRef.current;
    const a = beforeRef.current;
    const b = afterRef.current;
    if (!root || !a || !b) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) userPaused.current = true;

    let raf = 0;
    let frameHandle = 0;
    const hasRvfc = "requestVideoFrameCallback" in HTMLVideoElement.prototype;

    const resync = () => {
      if (Math.abs(b.currentTime - a.currentTime) > DRIFT) b.currentTime = a.currentTime;
      if (b.paused !== a.paused) {
        if (a.paused) b.pause();
        else b.play().catch(() => {});
      }
    };
    const onFrame = () => {
      resync();
      if (hasRvfc) {
        frameHandle = (a as HTMLVideoElement & {
          requestVideoFrameCallback: (cb: () => void) => number;
        }).requestVideoFrameCallback(onFrame);
      } else {
        raf = requestAnimationFrame(onFrame);
      }
    };

    const load = () => {
      if (a.dataset.loaded) return;
      const wide = window.matchMedia("(min-width: 768px)").matches;
      a.src = (wide ? a.dataset.src : a.dataset.srcSm) || a.dataset.src || "";
      b.src = (wide ? b.dataset.src : b.dataset.srcSm) || b.dataset.src || "";
      a.dataset.loaded = "true";
    };
    const play = () => {
      load();
      b.currentTime = a.currentTime;
      Promise.all([a.play(), b.play()]).catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "NotAllowedError") {
          userPaused.current = true;
          setPaused(true);
        }
      });
    };

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((e) => e.isIntersecting);
        if (visible && !userPaused.current) play();
        else if (visible) setPaused(true);
        else {
          a.pause();
          b.pause();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(root);
    onFrame();

    const onSeek = () => (b.currentTime = a.currentTime);
    a.addEventListener("seeked", onSeek);

    playRef.current = play;

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      if (hasRvfc && frameHandle) {
        (a as HTMLVideoElement & { cancelVideoFrameCallback: (h: number) => void }).cancelVideoFrameCallback(
          frameHandle,
        );
      }
      a.removeEventListener("seeked", onSeek);
    };
  }, [enabled, rootRef]);

  const toggle = useCallback(() => {
    const a = beforeRef.current;
    const b = afterRef.current;
    if (!a || !b) return;
    if (a.paused) {
      userPaused.current = false;
      setPaused(false);
      playRef.current();
    } else {
      userPaused.current = true;
      setPaused(true);
      a.pause();
      b.pause();
    }
  }, []);

  return { beforeRef, afterRef, paused, toggle };
}

export function GradeCompare({
  hue,
  idKey,
  set,
  beforeLabel = "Log",
  afterLabel = "Graded",
  beforeImage = DEFAULT_BEFORE,
  afterImage = DEFAULT_AFTER,
  caption = DEFAULT_CAPTION,
  captionHref = DEFAULT_CAPTION_HREF,
  className = "",
}: {
  hue: number;
  idKey: string;
  set?: CompareSet;
  beforeLabel?: string;
  afterLabel?: string;
  beforeImage?: string;
  afterImage?: string;
  caption?: string;
  captionHref?: string;
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLButtonElement>(null);

  const isVideo = set?.kind === "video";
  const media = useSyncedPair(isVideo, rootRef);

  const bLabel = set?.beforeLabel ?? beforeLabel;
  const aLabel = set?.afterLabel ?? afterLabel;
  const bImage = set && set.kind === "image" ? set.before : beforeImage;
  const aImage = set && set.kind === "image" ? set.after : afterImage;
  const cap = set?.caption ?? caption;
  const capHref = set ? set.captionHref : captionHref;
  const portrait = set?.aspect === "portrait";

  const setPos = useCallback((pct: number) => {
    const root = rootRef.current;
    if (!root) return;
    const v = clamp(pct);
    root.style.setProperty("--pos", `${v}%`);
    handleRef.current?.setAttribute("aria-valuenow", String(Math.round(v)));
  }, []);

  const posFromClientX = useCallback((clientX: number) => {
    const root = rootRef.current;
    if (!root) return START;
    const r = root.getBoundingClientRect();
    return ((clientX - r.left) / r.width) * 100;
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timers: ReturnType<typeof setTimeout>[] = [];
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        timers = [
          setTimeout(() => setPos(START + 16), 450),
          setTimeout(() => setPos(START - 10), 1150),
          setTimeout(() => setPos(START), 1800),
        ];
      },
      { threshold: 0.4 }
    );
    io.observe(root);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [setPos]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    if ((e.target as HTMLElement).closest("[data-media-toggle]")) return;
    const root = rootRef.current;
    if (!root) return;
    root.dataset.dragging = "true";
    root.setPointerCapture(e.pointerId);
    setPos(posFromClientX(e.clientX));
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (rootRef.current?.dataset.dragging !== "true") return;
    setPos(posFromClientX(e.clientX));
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const root = rootRef.current;
    if (!root || root.dataset.dragging !== "true") return;
    root.dataset.dragging = "false";
    if (root.hasPointerCapture(e.pointerId)) root.releasePointerCapture(e.pointerId);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const current = Number(handleRef.current?.getAttribute("aria-valuenow") ?? START);
    const step = e.shiftKey ? BIG_STEP : STEP;
    let next: number | null = null;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = current - step;
    else if (e.key === "ArrowRight" || e.key === "ArrowUp") next = current + step;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = 100;
    if (next === null) return;
    e.preventDefault();
    setPos(next);
  };

  const g = graded(hue);
  const realFrames = isVideo || Boolean(bImage && aImage);

  const layer = (side: "before" | "after") => {
    if (isVideo && set) {
      const ref = side === "before" ? media.beforeRef : media.afterRef;
      return (
        <video
          ref={ref}
          data-src={side === "before" ? set.before : set.after}
          data-src-sm={side === "before" ? set.beforeSm : set.afterSm}
          poster={side === "before" ? set.beforePoster : set.afterPoster}
          muted
          loop
          playsInline
          preload="none"
          disablePictureInPicture
          aria-hidden="true"
          className="size-full object-cover"
        />
      );
    }
    if (realFrames) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={side === "before" ? bImage : aImage}
          alt=""
          className="size-full object-cover"
          draggable={false}
          loading="lazy"
          decoding="async"
          aria-hidden="true"
        />
      );
    }
    return (
      <svg viewBox="0 0 160 90" className="size-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <Scene id={`${idKey}-cmp-${side === "before" ? "log" : "graded"}`} p={side === "before" ? LOG : g} />
      </svg>
    );
  };

  return (
    <div className={className}>
      <div
        ref={rootRef}
        data-dragging="false"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        style={{ ["--pos" as string]: `${START}%` }}
        className={`grade-compare card card-flush relative w-full ${portrait ? "aspect-[2/3]" : "aspect-video"}`}
      >
        <div className="absolute inset-0">{layer("before")}</div>

        <div className="grade-compare-after absolute inset-0">{layer("after")}</div>

        <span className="pointer-events-none absolute left-3 top-3 rounded-[6px] bg-bg/75 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-muted backdrop-blur-sm">
          {bLabel}
        </span>
        <span className="pointer-events-none absolute right-3 top-3 rounded-[6px] bg-bg/75 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-accent-bright backdrop-blur-sm">
          {aLabel}
        </span>

        {isVideo && (
          <button
            type="button"
            data-media-toggle
            onClick={media.toggle}
            aria-label={media.paused ? "Play the footage" : "Pause the footage"}
            className="absolute bottom-3 left-3 z-[1] grid size-9 place-items-center rounded-full border border-white/40 bg-bg/70 text-ink backdrop-blur-sm transition-[background-color,border-color] duration-150 hover:border-white/80"
          >
            {media.paused ? (
              <PlayIcon size={14} weight="fill" className="ml-px" aria-hidden="true" />
            ) : (
              <PauseIcon size={14} weight="fill" aria-hidden="true" />
            )}
          </button>
        )}

        <div
          className="grade-compare-handle pointer-events-none absolute inset-y-0 w-px -translate-x-1/2 bg-white/85"
          aria-hidden="true"
        />
        <button
          ref={handleRef}
          type="button"
          role="slider"
          aria-label={`Reveal the after frame. ${bLabel} on the left, ${aLabel} on the right.`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={START}
          aria-orientation="horizontal"
          onKeyDown={onKeyDown}
          className="grade-compare-handle absolute top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border border-white/70 bg-bg/80 text-ink shadow-[0_6px_20px_oklch(0_0_0_/_55%)] backdrop-blur-sm transition-[transform,border-color] duration-150 [transition-timing-function:var(--ease-out-quint)] active:scale-95"
        >
          <CaretLeft size={12} weight="bold" aria-hidden="true" />
          <CaretRight size={12} weight="bold" aria-hidden="true" />
        </button>
      </div>

      {realFrames && cap ? (
        <p className="mt-2.5 px-1 text-xs text-faint">
          {capHref ? (
            <a
              href={capHref}
              target="_blank"
              rel="noopener"
              className="underline-offset-4 transition-colors hover:text-ink hover:underline"
            >
              {cap}
            </a>
          ) : (
            cap
          )}
        </p>
      ) : null}
    </div>
  );
}
