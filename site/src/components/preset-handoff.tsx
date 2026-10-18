"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowSquareOut, Check, Copy } from "@phosphor-icons/react";

export function PresetHandoff({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      return;
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="mt-8">
      <a
        href={link}
        target="_blank"
        rel="noopener"
        className="btn btn-primary w-full sm:w-auto sm:min-w-64"
      >
        <ArrowSquareOut size={18} weight="bold" />
        Open your download
      </a>

      <div className="card card-pad-tight mt-4">
        <p className="text-[13px] font-semibold text-ink">Your link</p>
        <div className="mt-2 flex items-center gap-3">
          <code className="min-w-0 flex-1 truncate text-[12px] text-muted">{link}</code>
          <button
            type="button"
            onClick={copy}
            aria-label={copied ? "Link copied" : "Copy link"}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-[8px] border border-line px-3 text-[13px] font-semibold text-ink transition-[transform,border-color,color] duration-150 [transition-timing-function:var(--ease-out-quint)] hover:border-line-strong active:scale-[0.97]"
          >
            {copied ? (
              <Check size={15} weight="bold" className="text-accent-bright" />
            ) : (
              <Copy size={15} weight="bold" />
            )}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <p className="mt-3 text-[13px] leading-relaxed text-muted">
          Open it, save the files, and load them in your editor. Same link works on your phone
          and your laptop, and it stays yours.
        </p>
      </div>
    </div>
  );
}
