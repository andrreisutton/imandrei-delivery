"use client";

import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Drawer } from "vaul";
import { List } from "@phosphor-icons/react";
import { BrandLockup } from "./mark";

type NavBrand = { name: string; shortName: string; logo?: string };

const links = [
  { href: "/store", label: "Store" },
  { href: "/services", label: "Services" },
  { href: "/credits", label: "Credits" },
  { href: "/partners", label: "Partners" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
];

export function Logo({ brand }: { brand: NavBrand }) {
  return (
    <Link href="/" className="flex shrink-0 items-center" aria-label={`${brand.name} home`}>
      <BrandLockup shortName={brand.shortName} logo={brand.logo} markSize={34} />
    </Link>
  );
}

export function Nav({ brand }: { brand: NavBrand }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-xl">
      <motion.div
        layoutRoot
        className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6"
      >
        <Logo brand={brand} />

        <nav className="hidden h-full items-center lg:flex" aria-label="Main">
          {links.map((l) => {
            const active = pathname === l.href || pathname.startsWith(l.href + "/");
            const className = `relative flex h-full items-center px-3.5 text-[11px] font-medium uppercase tracking-[0.14em] transition-colors duration-200 ${
              active ? "text-accent-bright" : "text-muted hover:text-ink"
            }`;

            return (
              <Link
                key={l.href}
                href={l.href}
                className={className}
                aria-current={active ? "page" : undefined}
              >
                {active && (
                  <motion.span
                    layoutId="nav-tick"
                    transition={{ type: "spring", bounce: 0.16, duration: 0.45 }}
                    className="absolute inset-x-2.5 top-0 h-[2px] bg-accent-bright"
                    aria-hidden="true"
                  />
                )}
                <span className="relative z-10">{l.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <Link href="/store" className="btn btn-primary !px-4 !py-2.5 !text-[11px]">
            Browse the store
          </Link>
        </div>

        <Drawer.Root open={open} onOpenChange={setOpen}>
          <Drawer.Trigger asChild>
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-[8px] text-ink transition-transform active:scale-90 lg:hidden"
              aria-label="Open menu"
            >
              <List size={22} />
            </button>
          </Drawer.Trigger>
          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 z-40 bg-black/70 lg:hidden" />
            <Drawer.Content
              className="fixed inset-x-0 bottom-0 z-50 rounded-t-[14px] border-t border-line-strong bg-surface pb-[max(env(safe-area-inset-bottom),1rem)] shadow-[inset_0_1px_0_oklch(1_0_0_/_7%)] outline-none lg:hidden"
              aria-describedby={undefined}
            >
              <div className="mx-auto mt-3 h-1.5 w-11 rounded-full bg-raised" aria-hidden="true" />
              <Drawer.Title className="sr-only">Menu</Drawer.Title>
              <nav className="flex flex-col gap-1 p-4 pt-5" aria-label="Mobile">
                {links.map((l) => {
                  const active = pathname === l.href || pathname.startsWith(l.href + "/");
                  const className = `h-poster flex items-center gap-3 rounded-[8px] px-4 py-3.5 text-[26px] transition-[background-color,transform] duration-150 active:scale-[0.98] ${
                    active ? "bg-raised text-accent-bright" : "text-muted active:bg-raised/60"
                  }`;

                  return (
                    <Link key={l.href} href={l.href} className={className}>
                      {active && (
                        <span className="h-5 w-[2.5px] rounded-full bg-accent" aria-hidden="true" />
                      )}
                      {l.label}
                    </Link>
                  );
                })}
                <Link href="/store" className="btn btn-primary mt-4">
                  Browse the store
                </Link>
              </nav>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </motion.div>
    </header>
  );
}
