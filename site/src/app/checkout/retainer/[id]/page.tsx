import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { notFound } from "next/navigation";
import { Check, LockSimple } from "@phosphor-icons/react/dist/ssr";
import { getSiteContent } from "@/lib/content";
import { stripeEnabled } from "@/lib/stripe";
import { StripeMark } from "@/components/stripe-mark";
import { RetainerForm } from "./retainer-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Start a retainer", robots: { index: false } };

export default async function RetainerCheckoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { retainers } = await getSiteContent();
  const retainer = retainers.find((r) => r.id === id);
  if (!retainer || !(retainer.price > 0)) notFound();

  const canPay = stripeEnabled();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:py-16">
      <Link href="/editing#tiers" className="text-sm text-muted transition-colors hover:text-ink">
        ← Back
      </Link>
      <div className="mt-6 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <aside className="card card-pad self-start">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent-bright">
            Monthly retainer
          </p>
          <h2 className="mt-2 text-xl font-bold">{retainer.title}</h2>
          <p className="mt-1 text-sm text-muted">{retainer.volume}</p>
          <p className="mt-5 flex items-baseline gap-1.5">
            <span className="h-editorial text-4xl">
              ${retainer.price.toLocaleString("en-US")}
            </span>
            <span className="text-sm font-semibold text-faint">a month</span>
          </p>
          <ul className="mt-6 grid gap-2.5 border-t border-line pt-5">
            {retainer.includes.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-muted">
                <Check size={16} className="mt-0.5 shrink-0 text-accent-bright" weight="bold" />
                {item}
              </li>
            ))}
          </ul>
        </aside>

        <div>
          <h1 className="h-title text-6xl sm:text-8xl">Start</h1>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
            <LockSimple size={14} weight="fill" className="text-accent-bright" />
            {canPay ? (
              <>
                Secure payment powered by
                <StripeMark size={13} labelled className="ml-0.5 text-[#635BFF]" />
              </>
            ) : (
              "Card payments go live at launch. Use the form on the editing page for now."
            )}
          </p>
          <RetainerForm retainerId={retainer.id} price={retainer.price} canPay={canPay} />
        </div>
      </div>
    </div>
  );
}
