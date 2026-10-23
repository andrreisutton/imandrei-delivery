import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { notFound } from "next/navigation";
import { CheckCircle, DownloadSimple, EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";
import { getSiteContent } from "@/lib/content";
import { getOrderIdByToken, getOrderState } from "@/lib/orders";
import { PresetHandoff } from "@/components/preset-handoff";
import { getProductFiles } from "@/lib/product-files";
import { emailEnabled } from "@/lib/email";
import { instagramHref } from "@/content/site";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your order", robots: { index: false } };

export default async function OrderPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const orderId = await getOrderIdByToken("delivery", token);
  if (!orderId) notFound();
  const state = await getOrderState(orderId);
  if (!state) notFound();

  const [{ products }, files] = await Promise.all([getSiteContent(), getProductFiles()]);

  const product = products.find((p) => p.slug === state.order.productSlug);
  const isService = product?.type === "service";
  const isPhotoVideo = product?.category === "photoVideo";
  const hasFile = !!(product && files[product.slug]);
  const mail = emailEnabled();
  const replyTo = mail ? "Reply to your receipt email" : "DM me on Instagram";
  const presetLink = !isService && !hasFile ? state.order.deliveryUrl : undefined;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:py-24">
      {state.paid ? (
        <>
          <CheckCircle size={48} weight="fill" className="text-accent-bright" />
          <h1 className="h-title text-6xl sm:text-8xl mt-6">
            {isService ? "You're booked in." : "It's yours."}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Thanks {state.order.name.split(" ")[0]}. Your payment for{" "}
            <strong className="text-ink">{state.order.productTitle}</strong> went through
            {isService ? "." : " and it's ready right now."}
          </p>

          {isService ? (
            <div className="card card-pad mt-8">
              {isPhotoVideo ? (
                <>
                  <h2 className="font-bold">Next step: confirm the details</h2>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">
                    {replyTo} with the date, the location, and anything else I should know.
                    I&apos;ll follow up to lock everything in.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="font-bold">Next step: send your stems</h2>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">
                    {replyTo} with your stems (WAV, 24-bit if you have them) and a reference track.
                    Your slot starts the moment the files land.
                  </p>
                </>
              )}
            </div>
          ) : presetLink ? (
            <PresetHandoff link={presetLink} />
          ) : hasFile ? (
            <a href={`/api/download/${token}`} className="btn btn-primary mt-8" download>
              <DownloadSimple size={18} weight="bold" />
              Download your files
            </a>
          ) : (
            <div className="card card-pad mt-8">
              <h2 className="font-bold">Your order is being sent by hand</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">
                {replyTo} and it goes out right away. Your payment is confirmed and this page
                keeps working.
              </p>
            </div>
          )}

          <div className="card card-pad-tight mt-8 flex items-start gap-3 text-sm text-muted">
            <EnvelopeSimple size={20} className="mt-0.5 shrink-0 text-accent-bright" />
            {mail ? (
              <p>
                A receipt {isService ? "with next steps " : presetLink ? "with this link " : "with this download link "}
                was emailed to <strong className="text-ink">{state.order.email}</strong>.
                {!isService &&
                  " A few hours from now you'll get one more email with a link to review your purchase."}
              </p>
            ) : (
              <p>
                Bookmark this page: it&apos;s your receipt{isService ? "" : " and your download link"}.
                Questions?{" "}
                <a href={instagramHref} target="_blank" rel="noopener" className="text-ink underline underline-offset-2">
                  DM me on Instagram
                </a>
                .
              </p>
            )}
          </div>

          <Link href="/store" className="mt-10 inline-block text-sm font-semibold text-muted transition-colors hover:text-ink">
            ← Keep browsing
          </Link>
        </>
      ) : (
        <>
          <h1 className="h-title text-6xl sm:text-8xl">
            Finishing your payment…
          </h1>
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
