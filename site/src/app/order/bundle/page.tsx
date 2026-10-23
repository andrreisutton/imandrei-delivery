import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { notFound } from "next/navigation";
import { CheckCircle, DownloadSimple, EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";
import { getOrderIdByToken, getOrderState } from "@/lib/orders";
import { emailEnabled } from "@/lib/email";
import { instagramHref } from "@/content/site";
import type { OrderState } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your bundle", robots: { index: false } };

export default async function BundleOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ tokens?: string }>;
}) {
  const { tokens: tokensParam } = await searchParams;
  const tokens = Array.from(
    new Set((tokensParam ?? "").split(",").map((t) => t.trim()).filter(Boolean))
  );
  if (tokens.length === 0) notFound();

  const states = await Promise.all(
    tokens.map(async (token) => {
      const orderId = await getOrderIdByToken("delivery", token);
      if (!orderId) return null;
      const state = await getOrderState(orderId);
      return state ? { token, state } : null;
    })
  );
  const valid = states.filter((s): s is { token: string; state: OrderState } => !!s);
  if (valid.length === 0) notFound();

  const allPaid = valid.every((v) => v.state.paid);
  const mail = emailEnabled();
  const firstName = valid[0].state.order.name.split(" ")[0];
  const email = valid[0].state.order.email;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:py-24">
      {allPaid ? (
        <>
          <CheckCircle size={48} weight="fill" className="text-accent-bright" />
          <h1 className="h-title text-6xl sm:text-8xl mt-6">It&apos;s all yours.</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Thanks {firstName}. Your bundle of {valid.length} items is ready right now.
          </p>

          <div className="mt-8 grid gap-3">
            {valid.map(({ token, state }) => (
              <div
                key={token}
                className="flex items-center justify-between gap-4 rounded-[8px] border border-line bg-surface p-4"
              >
                <p className="min-w-0 truncate font-semibold text-ink">{state.order.productTitle}</p>
                <a
                  href={`/api/download/${token}`}
                  className="btn btn-primary shrink-0"
                  download
                >
                  <DownloadSimple size={16} weight="bold" />
                  Download
                </a>
              </div>
            ))}
          </div>

          <div className="card card-pad-tight mt-8 flex items-start gap-3 text-sm text-muted">
            <EnvelopeSimple size={20} className="mt-0.5 shrink-0 text-accent-bright" />
            {mail ? (
              <p>
                A receipt with each download link was emailed to{" "}
                <strong className="text-ink">{email}</strong>. A few hours from now you&apos;ll get
                a review link for each item.
              </p>
            ) : (
              <p>
                Bookmark this page: it&apos;s your receipt and your download links. Questions?{" "}
                <a
                  href={instagramHref}
                  target="_blank"
                  rel="noopener"
                  className="text-ink underline underline-offset-2"
                >
                  DM me on Instagram
                </a>
                .
              </p>
            )}
          </div>

          <Link
            href="/store"
            className="mt-10 inline-block text-sm font-semibold text-muted transition-colors hover:text-ink"
          >
            ← Keep browsing
          </Link>
        </>
      ) : (
        <>
          <h1 className="h-title text-6xl sm:text-8xl">Finishing your payment…</h1>
          <p className="mt-4 text-lg text-muted">
            This page updates once the payment settles, usually within a few seconds. Refresh to
            check again.
          </p>
          <a href="" className="btn btn-ghost mt-8">
            Refresh
          </a>
        </>
      )}
    </div>
  );
}
