"use client";

import Image from "next/image";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, CheckIcon, CopyIcon } from "@phosphor-icons/react";
import type { Partner } from "@/content/site";

const LOGOS: Record<string, { src: string; w: number; h: number; cls: string }> = {
  "FL Studio": { src: "/logos/fl-studio.png", w: 218, h: 54, cls: "h-[30px] w-auto sm:h-8" },
  DistroKid: { src: "/logos/distrokid.svg", w: 240, h: 62, cls: "h-7 w-auto sm:h-[26px]" },
  LANDR: { src: "/logos/landr.svg", w: 75, h: 60, cls: "h-11 w-auto sm:h-10" },
  "My Camera Kit": { src: "/logos/amazon.svg", w: 603, h: 182, cls: "h-7 w-auto sm:h-[26px]" },
  Comfrt: { src: "/logos/comfrt.png", w: 900, h: 215, cls: "h-7 w-auto sm:h-[26px]" },
  "muze.fyi": { src: "/logos/muze.svg", w: 1001, h: 650, cls: "h-9 w-auto sm:h-10" },
};

export function PartnerCard({
  partner,
  labels,
  className = "",
}: {
  className?: string;
  partner: Partner;
  labels: {
    codeLabel: string;
    copyLabel: string;
    copiedLabel: string;
    visitLabel: string;
    referralLabel: string;
  };
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(partner.code);
    } catch {
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1800);
  };

  return (
    <article className={`card card-pad card-interactive group flex flex-col justify-between gap-6 ${className}`}>
      <div>
        {LOGOS[partner.name] ? (
          <>
            <Image
              src={LOGOS[partner.name].src}
              alt={partner.name}
              width={LOGOS[partner.name].w}
              height={LOGOS[partner.name].h}
              unoptimized
              className={LOGOS[partner.name].cls}
            />
            <span className="sr-only">{partner.name}</span>
          </>
        ) : (
          <h3 className="h-editorial text-2xl sm:text-3xl">{partner.name}</h3>
        )}
        <p className="mt-3 text-[15px] leading-relaxed text-muted">{partner.what}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {partner.code ? (
          <button
            type="button"
            onClick={copy}
            className="inline-flex h-[34px] items-center gap-2.5 rounded-[6px] border border-dashed border-accent-bright/60 bg-accent-dim px-3.5 text-left transition-colors duration-200 hover:bg-accent-bright/20"
            aria-label={`${labels.copyLabel}: ${partner.code}`}
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-faint">
              {labels.codeLabel}
            </span>
            <span className="text-sm font-bold uppercase tracking-[0.1em] text-accent-bright">
              {partner.code}
            </span>
            {copied ? (
              <CheckIcon size={14} weight="bold" className="text-accent-bright" aria-hidden="true" />
            ) : (
              <CopyIcon size={14} weight="bold" className="text-faint" aria-hidden="true" />
            )}
          </button>
        ) : null}

        <a
          href={partner.href}
          target="_blank"
          rel="noopener"
          className="btn btn-ghost !px-4 !py-2.5 !text-[11px]"
        >
          {partner.referral ? labels.referralLabel : labels.visitLabel}
          <ArrowUpRight size={12} weight="bold" aria-hidden="true" />
        </a>
      </div>

      {partner.code && partner.perk ? (
        <p className="text-sm text-muted">{partner.perk}</p>
      ) : null}
      <span aria-live="polite" className="sr-only">
        {copied ? labels.copiedLabel : ""}
      </span>
    </article>
  );
}
