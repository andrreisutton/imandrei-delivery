"use client";

import { useEffect } from "react";
import { InstagramLogo } from "@phosphor-icons/react";

const ARTIST_SRC =
  "https://open.spotify.com/embed/artist/34oYRq2HTzpGsMA8WWjvlV?utm_source=generator&theme=0";

export function SpotifyPlaylist({ height = 352 }: { height?: number }) {
  return (
    <div className="card card-pad-tight">
      <iframe
        title="andrei! on Spotify: records written, recorded, and mixed by Andrei Sutton"
        style={{ borderRadius: 12, display: "block" }}
        src={ARTIST_SRC}
        width="100%"
        height={height}
        frameBorder="0"
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    </div>
  );
}

const IG_URL = "https://www.instagram.com/andreisutton/?utm_source=ig_embed&utm_campaign=loading";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

export function InstagramProfile({ className = "" }: { className?: string }) {
  useEffect(() => {
    const process = () => window.instgrm?.Embeds.process();
    const existing = document.querySelector<HTMLScriptElement>('script[src*="instagram.com/embed.js"]');
    if (existing) {
      process();
    } else {
      const script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      script.onload = process;
      document.body.appendChild(script);
    }
    const retry = setTimeout(process, 1500);
    return () => clearTimeout(retry);
  }, []);

  return (
    <div
      className={`card overflow-hidden p-2 ${className}`}
    >
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={IG_URL}
        data-instgrm-version="14"
        style={{
          background: "transparent",
          border: 0,
          borderRadius: 12,
          margin: 0,
          maxWidth: "100%",
          minWidth: 0,
          padding: 0,
          width: "100%",
        }}
      >
        <a
          href={IG_URL}
          target="_blank"
          rel="noopener"
          className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-[8px] p-8 text-center"
        >
          <InstagramLogo size={36} weight="duotone" style={{ color: "#FF0069" }} aria-hidden="true" />
          <span className="text-sm font-bold uppercase tracking-[0.12em]">
            @andreisutton
          </span>
          <span className="text-sm text-muted">Music, sessions, and the day to day. Open on Instagram.</span>
        </a>
      </blockquote>
    </div>
  );
}
