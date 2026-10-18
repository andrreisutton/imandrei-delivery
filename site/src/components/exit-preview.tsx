"use client";

import { useEffect, useState } from "react";

export function ExitPreview() {
  const [inIframe, setInIframe] = useState(true);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInIframe(window.self !== window.top);
  }, []);
  if (inIframe) return null;
  return (
    <a
      href={`/api/draft-mode/disable?redirect=${encodeURIComponent(
        typeof window === "undefined" ? "/" : window.location.pathname
      )}`}
      className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-[8px] border border-line-strong bg-surface/95 px-4 py-2.5 text-sm font-semibold text-ink shadow-2xl backdrop-blur-md transition-colors hover:border-ink"
    >
      Previewing drafts. Click to exit
    </a>
  );
}
