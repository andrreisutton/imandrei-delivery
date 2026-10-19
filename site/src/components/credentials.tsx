"use client";

import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react";
import type { Credential } from "@/content/site";
import { SocialIcon, platformOf } from "./social-icon";

function rosterPlatforms(credentials: Credential[]) {
  const seen: string[] = [];
  for (const c of credentials) {
    const p = c.videoUrl ? platformOf(c.videoUrl) : null;
    if (p && !seen.includes(p)) seen.push(p);
  }
  return seen;
}

const IG_RING = "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)";

function InstagramAvatar({ src, size = 22, className = "" }: { src: string; size?: number; className?: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full p-[1.5px] ${className}`}
      style={{ background: IG_RING, width: size, height: size }}
      aria-hidden="true"
    >
      <span className="block size-full rounded-full bg-bg p-[1.5px]">
        <Image
          src={src}
          alt=""
          width={size}
          height={size}
          className="size-full rounded-full object-cover"
        />
      </span>
    </span>
  );
}

function CredentialName({
  c,
  className = "",
  avatarSize = 22,
}: {
  c: Credential;
  className?: string;
  avatarSize?: number;
}) {
  const avatar = c.avatar ? <InstagramAvatar src={c.avatar} size={avatarSize} /> : null;
  const href = c.instagram ?? c.videoUrl;
  if (!href) {
    return (
      <span className="inline-flex items-center gap-1.5">
        {avatar}
        <span className={`credential ${className}`}>{c.name}</span>
      </span>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className="inline-flex items-center gap-1.5"
      title={c.instagram ? `${c.name} on Instagram` : `${c.name}: ${c.role}`}
    >
      {avatar}
      <span className={`credential ${className}`}>{c.name}</span>
    </a>
  );
}

export function HeroCredits({
  heading,
  credentials,
  reach,
  className = "",
}: {
  heading: string;
  credentials: Credential[];
  reach: { value: string; label: string };
  className?: string;
}) {
  if (!credentials.length) return null;
  const platforms = rosterPlatforms(credentials);
  return (
    <div className={`hero-plaque ${className}`}>
      <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-faint">
        {platforms.length > 0 && (
          <span className="flex items-center gap-1">
            {platforms.map((p) => (
              <SocialIcon key={p} label={p} size={13} />
            ))}
          </span>
        )}
        {heading}
      </p>
      <ul className="no-scrollbar edge-fade -mx-4 mt-2.5 flex items-center overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:gap-y-1.5 sm:overflow-visible sm:px-0">
        {credentials.map((c, i) => (
          <li
            key={c.name}
            className={
              i === 0
                ? "shrink-0 pr-3.5 sm:pr-4"
                : "credential-rule shrink-0 px-3.5 sm:px-4"
            }
          >
            <CredentialName c={c} className="text-[17px] sm:text-xl" avatarSize={24} />
          </li>
        ))}
      </ul>
      {reach.value ? (
        <p className="mt-3 flex flex-wrap items-baseline gap-x-2.5 border-t border-line pt-3 text-[13px] leading-snug text-muted sm:text-sm">
          <span className="h-poster text-2xl leading-none text-accent-bright sm:text-[1.75rem]">
            {reach.value}
          </span>
          {reach.label}
        </p>
      ) : null}
    </div>
  );
}

export function TrustedByStrip({
  heading,
  credentials,
  className = "",
}: {
  heading: string;
  credentials: Credential[];
  className?: string;
}) {
  if (!credentials.length) return null;
  return (
    <div className={`border-y border-line bg-surface/40 ${className}`}>
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3.5 sm:flex-row sm:items-center sm:gap-6 sm:px-6">
        <p className="shrink-0 text-[10px] font-bold uppercase tracking-[0.2em] text-faint">
          {heading}
        </p>
        <ul
          className="no-scrollbar edge-fade -mx-4 flex items-center gap-x-6 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:gap-x-7 sm:gap-y-1 sm:overflow-visible sm:px-0"
        >
          {credentials.map((c) => (
            <li key={c.name} className="shrink-0 py-0.5">
              <CredentialName c={c} className="text-[15px] sm:text-base" avatarSize={20} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function CredentialRoster({
  credentials,
  className = "",
}: {
  credentials: Credential[];
  className?: string;
}) {
  if (!credentials.length) return null;
  return (
    <ul className={`grid gap-px overflow-hidden rounded-[12px] border border-line bg-line ${className}`}>
      {credentials.map((c) => {
        const nameBlock = (
          <span className="flex min-w-0 items-center gap-3.5">
            {c.avatar && <InstagramAvatar src={c.avatar} size={40} className="shrink-0" />}
            <span className="min-w-0">
              <span
                className={`credential block text-2xl sm:text-3xl ${
                  c.instagram ? "transition-colors duration-200 group-hover:text-accent-bright" : ""
                }`}
              >
                {c.name}
              </span>
              <span className="mt-1.5 block text-sm leading-snug text-muted">{c.role}</span>
            </span>
          </span>
        );
        return (
          <li key={c.name} className="flex items-center justify-between gap-5 bg-bg px-5 py-5 sm:px-7 sm:py-6">
            {c.instagram ? (
              <a
                href={c.instagram}
                target="_blank"
                rel="noopener"
                className="group min-w-0"
                title={`${c.name} on Instagram`}
              >
                {nameBlock}
              </a>
            ) : (
              nameBlock
            )}
            {c.videoUrl && (
              <a
                href={c.videoUrl}
                target="_blank"
                rel="noopener"
                className="group flex shrink-0 items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-faint transition-colors duration-200 hover:text-ink"
                title={`Watch: ${c.name}`}
              >
                <SocialIcon label={platformOf(c.videoUrl) ?? "YouTube"} size={15} />
                <span className="hidden sm:inline">Watch</span>
                <ArrowUpRight size={11} weight="bold" aria-hidden="true" />
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
}
