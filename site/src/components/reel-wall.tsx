import type { Reel } from "@/content/site";

export function ReelWall({ reels, className = "" }: { reels: Reel[]; className?: string }) {
  if (!reels.length) return null;

  return (
    <ul className={`grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {reels.map((r) => {
        const base = r.url.replace(/\/+$/, "");
        const src = base.endsWith("/embed") ? base : `${base}/embed`;
        return (
          <li key={r.url} className="card card-flush">
            <div className="relative aspect-[9/16] w-full">
              <iframe
                src={src}
                title={r.caption ?? "Instagram reel by Andrei Sutton"}
                loading="lazy"
                allow="encrypted-media; picture-in-picture; web-share"
                allowFullScreen
                scrolling="no"
                className="absolute inset-0 size-full border-0"
              />
            </div>
            {r.caption ? (
              <p className="px-4 py-3 text-[13px] leading-relaxed text-muted">{r.caption}</p>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
