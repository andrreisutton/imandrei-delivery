import type { Metadata } from "next";
import { PencilSimple } from "@phosphor-icons/react/dist/ssr";
import { isAdmin } from "@/lib/admin-auth";
import { listJSON } from "@/lib/store";
import { getSiteContent } from "@/lib/content";
import { STUDIO_URL } from "@/lib/sanity";
import type {
  BookingRecord,
  OrderEvent,
  OrderRecord,
  OutboxEmail,
  ReviewRecord,
  ServiceRequestRecord,
} from "@/lib/types";
import { LoginForm } from "./login-form";
import {
  adminDeleteReview,
  adminExpediteReviewEmails,
  adminLogout,
  adminRunEmailQueue,
} from "./actions";
import { Stars } from "@/components/rating";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin", robots: { index: false } };

type OrderRow = {
  order: OrderRecord;
  paid: boolean;
  reviewScheduledFor?: string;
  reviewEmailSent: boolean;
  reviewed: boolean;
};

async function loadData() {
  const [orderRecords, reviews, bookings, bookingEvents, requests, outbox] = await Promise.all([
    listJSON<Record<string, unknown>>("orders/"),
    listJSON<ReviewRecord>("reviews/"),
    listJSON<BookingRecord>("bookings/"),
    listJSON<{ bookingId: string }>("booking-events/"),
    listJSON<ServiceRequestRecord>("requests/"),
    listJSON<OutboxEmail>("outbox/"),
  ]);

  const paidBookings = new Set(
    bookingEvents.filter((r) => r.path.endsWith("/paid")).map((r) => r.data.bookingId)
  );

  const byId = new Map<string, OrderRow>();
  for (const rec of orderRecords) {
    const m = rec.path.match(/^orders\/([^/]+)\/(.+)$/);
    if (!m) continue;
    const [, id, kind] = m;
    const row = byId.get(id) ?? {
      order: null as unknown as OrderRecord,
      paid: false,
      reviewEmailSent: false,
      reviewed: false,
    };
    if (kind === "order") row.order = rec.data as unknown as OrderRecord;
    if (kind === "paid") row.paid = true;
    if (kind === "review-scheduled") row.reviewScheduledFor = (rec.data as unknown as OrderEvent).sendAt;
    if (kind === "review-sent") row.reviewEmailSent = true;
    if (kind === "reviewed") row.reviewed = true;
    byId.set(id, row);
  }
  const orders = [...byId.values()]
    .filter((r) => r.order)
    .sort((a, b) => b.order.createdAt.localeCompare(a.order.createdAt));

  return {
    orders,
    reviews: reviews.map((r) => r.data).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    bookings: bookings
      .map((r) => ({ ...r.data, isPaid: paidBookings.has(r.data.id) }))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    requests: requests.map((r) => r.data).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    outbox: outbox.map((r) => r.data).sort((a, b) => b.sentAt.localeCompare(a.sentAt)),
  };
}

function fmt(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function Empty({ label }: { label: string }) {
  return <p className="rounded-[8px] border border-line bg-surface p-6 text-sm text-muted">{label}</p>;
}

export default async function AdminPage() {
  if (!(await isAdmin())) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <LoginForm />
      </div>
    );
  }

  const [{ orders, reviews, bookings, requests, outbox }, { products }] = await Promise.all([
    loadData(),
    getSiteContent(),
  ]);
  const productTitle = (slug: string) => {
    const p = products.find((x) => x.slug === slug);
    return p ? `${p.title} · ${p.subtitle}` : slug;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="h-title text-6xl sm:text-8xl">Admin</h1>
        <div className="flex flex-wrap gap-2">
          <a
            href={STUDIO_URL}
            target="_blank"
            rel="noopener"
            className="btn btn-primary !px-4 !py-2 text-sm"
          >
            <PencilSimple size={15} weight="bold" />
            Edit the site
          </a>
          <form action={adminRunEmailQueue}>
            <button className="btn btn-ghost !px-4 !py-2 text-sm">Send due review emails</button>
          </form>
          <form action={adminExpediteReviewEmails}>
            <button className="btn btn-ghost !px-4 !py-2 text-sm">Demo: send them all now</button>
          </form>
          <form action={adminLogout}>
            <button className="btn btn-ghost !px-4 !py-2 text-sm">Sign out</button>
          </form>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[
          ["Orders", orders.length],
          ["Revenue", `$${orders.filter((o) => o.paid).reduce((s, o) => s + o.order.amount, 0)}`],
          ["Reviews", reviews.length],
          ["Bookings", bookings.length],
          ["Requests", requests.length],
        ].map(([label, value]) => (
          <div key={label} className="rounded-[8px] border border-line bg-surface px-4 py-3">
            <p className="text-xs text-faint">{label}</p>
            <p className="mt-1 text-xl font-semibold">{value}</p>
          </div>
        ))}
      </div>

      <section data-reveal className="mt-10">
        <h2 className="text-lg font-bold">Orders</h2>
        <div className="mt-3 overflow-x-auto rounded-[8px] border border-line">
          {orders.length === 0 ? (
            <Empty label="No orders yet. Run a purchase through the site and it lands here." />
          ) : (
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs text-faint">
                  <th className="px-4 py-3 font-medium">When</th>
                  <th className="px-4 py-3 font-medium">Buyer</th>
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Delivered</th>
                  <th className="px-4 py-3 font-medium">Review email</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.order.id} className="border-b border-line last:border-0">
                    <td className="px-4 py-3 text-muted">{fmt(o.order.createdAt)}</td>
                    <td className="px-4 py-3">
                      {o.order.name}
                      <span className="block text-xs text-faint">{o.order.email}</span>
                    </td>
                    <td className="px-4 py-3 text-muted">{o.order.productTitle}</td>
                    <td className="px-4 py-3">${o.order.amount}</td>
                    <td className="px-4 py-3">
                      <span className={o.paid ? "text-ink" : "text-faint"}>
                        {o.paid ? `Paid (${o.order.mode})` : "Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {o.order.deliveryUrl ? (
                        <a
                          href={o.order.deliveryUrl}
                          target="_blank"
                          rel="noopener"
                          className="text-muted underline decoration-line underline-offset-2 transition-colors hover:text-ink"
                        >
                          Preset link
                        </a>
                      ) : (
                        <span className="text-faint">File</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {o.reviewed
                        ? "Reviewed"
                        : o.reviewEmailSent
                          ? "Sent"
                          : o.reviewScheduledFor
                            ? `Due ${fmt(o.reviewScheduledFor)}`
                            : "n/a"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <section data-reveal className="mt-10">
        <h2 className="text-lg font-bold">Reviews</h2>
        <div className="mt-3 grid gap-3">
          {reviews.length === 0 ? (
            <Empty label="No reviews yet. They publish automatically from review-link emails." />
          ) : (
            reviews.map((r) => (
              <div
                key={r.id}
                className="flex flex-wrap items-start justify-between gap-4 rounded-[8px] border border-line bg-surface p-4"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Stars rating={r.rating} size={14} />
                    <span className="text-sm font-semibold">{r.authorName}</span>
                    {r.sample && (
                      <span className="rounded-[6px] bg-raised px-2 py-0.5 text-[10px] font-semibold uppercase text-faint">
                        Sample
                      </span>
                    )}
                    <span className="text-xs text-faint">{fmt(r.createdAt)}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted">{r.text}</p>
                  <p className="mt-1 text-xs text-faint">on {productTitle(r.productSlug)}</p>
                </div>
                <form action={adminDeleteReview}>
                  <input type="hidden" name="productSlug" value={r.productSlug} />
                  <input type="hidden" name="reviewId" value={r.id} />
                  <button className="text-xs font-semibold text-faint transition-colors hover:text-accent-bright">
                    Delete
                  </button>
                </form>
              </div>
            ))
          )}
        </div>
      </section>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <section data-reveal>
          <h2 className="text-lg font-bold">Session bookings</h2>
          <div className="mt-3 grid gap-3">
            {bookings.length === 0 ? (
              <Empty label="No bookings yet." />
            ) : (
              bookings.map((b) => (
                <div key={b.id} className="rounded-[8px] border border-line bg-surface p-4 text-sm">
                  <p className="font-semibold">
                    {b.sessionTitle} · {b.preferredDate}, {b.preferredTime}
                    {b.duration ? ` · ${b.duration}` : b.extraTime ? ` · ${b.extraTime} extra` : ""}
                    {b.quotedTotal ? ` · $${b.quotedTotal}` : ""}
                    {b.paymentMode === "stripe" && (
                      <span className={b.isPaid ? "text-ink" : "text-faint"}>
                        {b.isPaid ? " · Paid (stripe)" : " · Awaiting payment"}
                      </span>
                    )}
                  </p>
                  <p className="mt-1 text-muted">
                    {b.name}
                    {b.artistName ? ` (${b.artistName})` : ""} · {b.email}
                  </p>
                  {b.notes && <p className="mt-1 text-xs text-faint">{b.notes}</p>}
                  {b.fileUrls && b.fileUrls.length > 0 && (
                    <p className="mt-1 flex flex-wrap gap-x-2 text-xs text-faint">
                      {b.fileUrls.map((u, i) => (
                        <a key={u} href={u} target="_blank" rel="noreferrer" className="underline hover:text-ink">
                          File {i + 1}
                        </a>
                      ))}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
        <section data-reveal>
          <h2 className="text-lg font-bold">Service requests</h2>
          <div className="mt-3 grid gap-3">
            {requests.length === 0 ? (
              <Empty label="No service requests yet." />
            ) : (
              requests.map((r) => (
                <div key={r.id} className="rounded-[8px] border border-line bg-surface p-4 text-sm">
                  <p className="font-semibold">{r.serviceTitle}</p>
                  <p className="mt-1 text-muted">
                    {r.name}
                    {r.artistName ? ` (${r.artistName})` : ""} · {r.email}
                  </p>
                  {r.songTitle && <p className="mt-1 text-xs text-faint">Song: {r.songTitle}</p>}
                  {r.channelUrl && <p className="mt-1 text-xs text-faint">Channel: {r.channelUrl}</p>}
                  {r.cadence && <p className="mt-1 text-xs text-faint">Cadence: {r.cadence}</p>}
                  {r.referenceTrack && (
                    <p className="mt-1 text-xs text-faint">Reference: {r.referenceTrack}</p>
                  )}
                  {r.notes && <p className="mt-1 text-xs text-faint">{r.notes}</p>}
                  {r.fileUrls && r.fileUrls.length > 0 && (
                    <p className="mt-1 flex flex-wrap gap-x-2 text-xs text-faint">
                      {r.fileUrls.map((u, i) => (
                        <a key={u} href={u} target="_blank" rel="noreferrer" className="underline hover:text-ink">
                          File {i + 1}
                        </a>
                      ))}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <section data-reveal className="mt-10">
        <h2 className="text-lg font-bold">Email log</h2>
        <p className="mt-1 text-sm text-muted">
          Every automated email the system sends. Before an email provider is connected
          (RESEND_API_KEY), emails are logged here instead of delivered, so the whole flow is
          testable.
        </p>
        <div className="mt-3 overflow-x-auto rounded-[8px] border border-line">
          {outbox.length === 0 ? (
            <Empty label="No emails yet. Buy something on the site and the receipt shows up here." />
          ) : (
            <table className="w-full min-w-[700px] text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs text-faint">
                  <th className="px-4 py-3 font-medium">When</th>
                  <th className="px-4 py-3 font-medium">To</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Subject</th>
                  <th className="px-4 py-3 font-medium">Channel</th>
                </tr>
              </thead>
              <tbody>
                {outbox.map((e) => (
                  <tr key={e.id} className="border-b border-line last:border-0 align-top">
                    <td className="px-4 py-3 text-muted">{fmt(e.sentAt)}</td>
                    <td className="px-4 py-3">{e.to}</td>
                    <td className="px-4 py-3 text-muted">{e.type}</td>
                    <td className="px-4 py-3 text-muted">{e.subject}</td>
                    <td className="px-4 py-3">
                      <span className={e.channel === "resend" ? "text-ink" : "text-faint"}>
                        {e.channel === "resend" ? "Delivered" : "Logged"}
                      </span>
                      {e.error && <span className="block text-xs text-accent-bright">{e.error}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
