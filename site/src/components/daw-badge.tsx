import Image from "next/image";

const LOGOS: Record<string, string> = {
  "davinci resolve": "/logos/davinci-resolve.svg",
  "premiere pro": "/logos/premiere-pro.svg",
  "lightroom": "/logos/lightroom.svg",
};

const WORDMARKS: Record<string, { src: string; w: number; h: number }> = {
  "fl studio": { src: "/logos/fl-studio.png", w: 218, h: 54 },
};

export function DawBadge({ name }: { name: string }) {
  const key = name.trim().toLowerCase();
  const src = LOGOS[key];
  const wordmark = WORDMARKS[key];

  if (wordmark) {
    return (
      <li className="flex items-center rounded-[8px] border border-line bg-surface/60 px-3 py-2 shadow-[inset_0_1px_0_oklch(1_0_0_/_4%)] transition-[border-color,background-color] duration-200 hover:border-line-strong hover:bg-surface">
        <Image
          src={wordmark.src}
          alt={name}
          width={wordmark.w}
          height={wordmark.h}
          unoptimized
          className="h-[26px] w-auto sm:h-[24px]"
        />
      </li>
    );
  }

  return (
    <li className="flex items-center gap-2.5 rounded-[8px] border border-line bg-surface/60 px-3 py-2 text-muted shadow-[inset_0_1px_0_oklch(1_0_0_/_4%)] transition-[color,border-color,background-color] duration-200 hover:border-line-strong hover:bg-surface hover:text-ink">
      {src && (
        <Image
          src={src}
          alt=""
          width={20}
          height={20}
          unoptimized
          className="size-6 rounded-[4px] sm:size-[22px]"
          aria-hidden="true"
        />
      )}
      <span className="text-[13px] font-bold tracking-wide">{name}</span>
    </li>
  );
}
