import { Link } from "next-view-transitions";
import { getSiteContent } from "@/lib/content";
import { SocialIcon } from "./social-icon";
import { Waveform } from "./waveform";
import { BrandMark } from "./mark";
import { StudioRaineTag } from "./studio-raine-tag";

const nav = [
  { href: "/store", label: "Store" },
  { href: "/services", label: "Services" },
  { href: "/mixing-mastering", label: "Mixing & Mastering" },
  { href: "/editing", label: "Monthly Editing" },
  { href: "/book", label: "Book a Session" },
  { href: "/credits", label: "Credits" },
  { href: "/affiliates", label: "Affiliates" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
];

export async function Footer() {
  const { brand, socials } = await getSiteContent();
  return (
    <footer className="border-t border-line bg-surface/30 shadow-[inset_0_1px_0_oklch(1_0_0_/_4%)]">
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6" aria-hidden="true">
        <Waveform seed="footer" bars={220} mode="ambient" className="h-8 w-full text-accent-bright/20" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
        <Link
          href="/"
          aria-label={`${brand.name} home`}
          className="inline-flex items-center gap-4 transition-opacity duration-200 hover:opacity-85"
        >
          <BrandMark size={38} logo={brand.logo} />
          {!brand.logo && <span className="h-poster text-4xl sm:text-5xl">{brand.shortName}</span>}
        </Link>
        <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-muted">{brand.tagline}</p>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <nav className="grid grid-cols-2 gap-x-12 gap-y-3.5 sm:grid-cols-3" aria-label="Footer">
            {nav.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-muted transition-colors hover:text-ink"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-wrap items-center gap-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener"
                aria-label={`${brand.name} on ${s.label}`}
                className="social-tile"
              >
                <SocialIcon label={s.label} />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 pb-24 text-xs text-faint sm:flex-row sm:items-center sm:justify-between lg:pb-0">
          <p>© {new Date().getFullYear()} {brand.name}. All rights reserved.</p>
          <div className="text-right text-ink">
            <StudioRaineTag />
          </div>
        </div>
      </div>
    </footer>
  );
}
