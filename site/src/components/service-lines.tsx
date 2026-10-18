import { Link } from "next-view-transitions";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import type { Product, Retainer, Session } from "@/content/site";

function money(n: number) {
  return `$${n.toLocaleString("en-US")}`;
}

export type ServiceLine = {
  title: string;
  body: string;
  from: string;
  href: string;
  cta: string;
};

export function buildServiceLines({
  products,
  retainers,
  sessions,
}: {
  products: Product[];
  retainers: Retainer[];
  sessions: Session[];
}): ServiceLine[] {
  const servicePrices = products.filter((p) => p.type === "service").map((p) => p.price);
  const lines: ServiceLine[] = [];

  if (servicePrices.length) {
    lines.push({
      title: "Mixing & Mastering",
      body: "Send the stems, get back a record referenced against the songs you want to sit next to. Mix, master, or both.",
      from: `From ${money(Math.min(...servicePrices))} a song`,
      href: "/mixing-mastering",
      cta: "See the tiers",
    });
  }
  if (retainers.length) {
    lines.push({
      title: "Monthly Editing",
      body: "I cut your channel every month: long form, the shorts out of it, thumbnails, and the color on all of it.",
      from: `From ${money(Math.min(...retainers.map((r) => r.price)))} a month`,
      href: "/editing",
      cta: "See the tiers",
    });
  }
  if (sessions.length) {
    lines.push({
      title: "One on One",
      body: "An hour in the room. Bring your footage or your session, watch it come together, and leave with a workflow you can repeat.",
      from: `From ${money(Math.min(...sessions.map((s) => s.price)))}`,
      href: "/book",
      cta: "Book a session",
    });
  }
  return lines;
}

export function ServiceLines({ lines, className = "" }: { lines: ServiceLine[]; className?: string }) {
  if (!lines.length) return null;
  return (
    <div className={`grid gap-px overflow-hidden rounded-[12px] border border-line bg-line md:grid-cols-3 ${className}`}>
      {lines.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className="group flex flex-col justify-between gap-8 bg-bg p-7 transition-colors duration-300 hover:bg-surface sm:p-8"
        >
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent-bright">
              {l.from}
            </p>
            <h3 className="h-editorial text-2xl sm:text-3xl mt-3 transition-colors duration-200 group-hover:text-accent-bright">
              {l.title}
            </h3>
            <p className="mt-3.5 text-[15px] leading-relaxed text-muted">{l.body}</p>
          </div>
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-ink">
            {l.cta}
            <ArrowRight
              size={13}
              weight="bold"
              aria-hidden="true"
              className="transition-transform duration-200 [transition-timing-function:var(--ease-out-quint)] group-hover:translate-x-1"
            />
          </span>
        </Link>
      ))}
    </div>
  );
}
