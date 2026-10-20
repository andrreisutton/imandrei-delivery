"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play } from "@phosphor-icons/react";
import { Waveform } from "./waveform";

const DRIFT_TOLERANCE = 0.06;

function mmss(s: number) {
  if (!Number.isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${String(r).padStart(2, "0")}`;
}

export function AudioCompare({
  beforeSrc,
  afterSrc,
  title,
  credit,
  beforeLabel = "Rough",
  afterLabel = "Mixed",
  className = "",
}: {
  beforeSrc?: string;
  afterSrc?: string;
  title: string;
  credit?: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}) {
  const beforeRef = useRef<HTMLAudioElement>(null);
  const afterRef = useRef<HTMLAudioElement>(null);
  const scrubRef = useRef<HTMLInputElement>(null);

  const [playing, setPlaying] = useState(false);
  const [monitoring, setMonitoring] = useState<"before" | "after">("after");
  const [duration, setDuration] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  const pair = Boolean(beforeSrc && afterSrc);

  useEffect(() => {
    if (!pair) return;
    const b = beforeRef.current;
    const a = afterRef.current;
    if (!b || !a) return;
    b.volume = monitoring === "before" ? 1 : 0;
    a.volume = monitoring === "after" ? 1 : 0;
  }, [monitoring, pair]);

  useEffect(() => {
    if (!pair) return;
    const lead = afterRef.current;
    const follow = beforeRef.current;
    if (!lead || !follow) return;

    const onTime = () => {
      setElapsed(lead.currentTime);
      if (Math.abs(follow.currentTime - lead.currentTime) > DRIFT_TOLERANCE) {
        follow.currentTime = lead.currentTime;
      }
    };
    const onMeta = () => setDuration(lead.duration || 0);
    const onEnd = () => {
      setPlaying(false);
      setElapsed(0);
      lead.currentTime = 0;
      follow.currentTime = 0;
    };

    lead.addEventListener("timeupdate", onTime);
    lead.addEventListener("loadedmetadata", onMeta);
    lead.addEventListener("ended", onEnd);
    // The browser can finish loading metadata before this effect runs and
    // attaches the listener (especially on a fast/cached load), so the
    // "loadedmetadata" event is missed. Catch that case directly.
    if (lead.readyState >= 1) onMeta();
    return () => {
      lead.removeEventListener("timeupdate", onTime);
      lead.removeEventListener("loadedmetadata", onMeta);
      lead.removeEventListener("ended", onEnd);
    };
  }, [pair]);

  const toggle = useCallback(async () => {
    const b = beforeRef.current;
    const a = afterRef.current;
    if (!b || !a) return;
    if (playing) {
      b.pause();
      a.pause();
      setPlaying(false);
      return;
    }
    b.currentTime = a.currentTime;
    try {
      await Promise.all([a.play(), b.play()]);
      setPlaying(true);
    } catch {
      b.pause();
      a.pause();
      setPlaying(false);
    }
  }, [playing]);

  const seek = (value: number) => {
    const b = beforeRef.current;
    const a = afterRef.current;
    if (!b || !a) return;
    a.currentTime = value;
    b.currentTime = value;
    setElapsed(value);
  };

  if (!pair) return null;

  const pct = duration > 0 ? (elapsed / duration) * 100 : 0;

  return (
    <div
      className={`audio-compare card card-pad-tight ${className}`}
    >
      <audio ref={beforeRef} src={beforeSrc} preload="auto" playsInline />
      <audio ref={afterRef} src={afterSrc} preload="auto" playsInline />

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold text-ink">{title}</p>
          {credit ? <p className="mt-0.5 truncate text-[11px] text-muted">{credit}</p> : null}
        </div>

        <div
          className="audio-compare-switch flex shrink-0 rounded-[8px] border border-line-strong p-0.5"
          role="radiogroup"
          aria-label="Monitor the rough or the mixed version"
        >
          {(["before", "after"] as const).map((side) => {
            const active = monitoring === side;
            return (
              <button
                key={side}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setMonitoring(side)}
                className={`rounded-[6px] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] transition-colors duration-150 ${
                  active
                    ? side === "after"
                      ? "bg-accent text-white"
                      : "bg-line-strong text-ink"
                    : "text-muted hover:text-ink"
                }`}
              >
                {side === "before" ? beforeLabel : afterLabel}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? `Pause ${title}` : `Play ${title}`}
          className="flex size-11 shrink-0 items-center justify-center rounded-full border border-line-strong bg-bg text-ink transition-[transform,border-color] duration-150 [transition-timing-function:var(--ease-out-quint)] hover:border-accent-bright active:scale-95"
        >
          {playing ? (
            <Pause size={15} weight="fill" aria-hidden="true" />
          ) : (
            <Play size={15} weight="fill" aria-hidden="true" />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="relative">
            <Waveform
              seed={title}
              mode={playing ? "live" : "ambient"}
              className="pointer-events-none h-8 w-full opacity-70"
            />
            <input
              ref={scrubRef}
              type="range"
              min={0}
              max={duration || 0}
              step={0.01}
              value={elapsed}
              onChange={(e) => seek(Number(e.target.value))}
              aria-label={`Scrub ${title}`}
              aria-valuetext={`${mmss(elapsed)} of ${mmss(duration)}`}
              className="audio-compare-scrub absolute inset-0 w-full cursor-pointer opacity-0"
              style={{ ["--pct" as string]: `${pct}%` }}
            />
          </div>
          <div className="mt-1 flex justify-between text-[10px] tabular-nums text-faint">
            <span>{mmss(elapsed)}</span>
            <span>{mmss(duration)}</span>
          </div>
        </div>
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-faint">
        Both versions run together from the same point, so switching lands on the same bar.
      </p>
    </div>
  );
}
