import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { notFound } from "next/navigation";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { getBooking, reconcileBookingPayment } from "@/lib/bookings";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Session booked", robots: { index: false } };

export default async function BookingConfirmedPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ session_id?: string | string[] }>;
}) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const booking = await getBooking(id);
  if (!booking) notFound();
  const sessionIdHint = typeof sp.session_id === "string" ? sp.session_id : undefined;
  const paid = await reconcileBookingPayment(id, sessionIdHint);
  const payAtSession = booking.paymentMode !== "stripe";

  const rows: [string, string][] = [
    ["Session", booking.sessionTitle],
    ["Day", booking.preferredDate],
    ["Start", booking.preferredTime],
    ...(booking.duration ? ([["Length", booking.duration]] as [string, string][]) : []),
    ...(booking.quotedTotal
      ? ([
          [
            "Total",
            `$${booking.quotedTotal} · ${paid ? "paid" : payAtSession ? "at the session" : "processing"}`,
          ],
        ] as [string, string][])
      : []),
  ];

  const summary = (
    <div className="card card-pad mt-8">
      <dl className="grid gap-3">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="flex items-baseline justify-between gap-6 border-b border-line pb-3 last:border-0 last:pb-0"
          >
            <dt className="text-sm text-faint">{label}</dt>
            <dd className="text-right font-medium">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );

  if (!paid && !payAtSession) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:py-24">
        <h1 className="h-title text-6xl sm:text-8xl">
          Finishing your payment…
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          This page turns into your booking confirmation the second the payment settles, usually
          within a few seconds. Refresh to check again. If you closed the card screen before
          paying, head back and the same date is still open.
        </p>
        {summary}
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="" className="btn btn-primary">
            Refresh
          </a>
          <Link href="/book" className="btn btn-ghost">
            Back to booking
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:py-24">
      <CheckCircle size={48} weight="fill" className="text-accent-bright" />
      <h1 className="h-title text-6xl sm:text-8xl mt-6">
        {paid ? "Session locked in." : "Session request locked in."}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-muted">
        Thanks {booking.name.split(" ")[0]}.{" "}
        {paid
          ? "Payment went through and your studio time is booked. Your receipt and confirmation are in your inbox."
          : "Your session request is in. You pay at the session, and your confirmation is in your inbox."}
      </p>

      {summary}

      <p className="mt-6 text-[15px] leading-relaxed text-muted">
        I confirm the exact start time by email within 24 hours. Need to change anything? Just
        reply to the confirmation email.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/store" className="btn btn-primary">
          Browse presets while you wait
        </Link>
        <Link href="/" className="btn btn-ghost">
          Back to the site
        </Link>
      </div>
    </div>
  );
}
