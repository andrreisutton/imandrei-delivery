import type { Metadata } from "next";
import { isAdmin } from "@/lib/admin-auth";
import { listJSON } from "@/lib/store";
import { getSiteContent } from "@/lib/content";
import { getProductFiles } from "@/lib/product-files";
import { stripeLive } from "@/lib/stripe";
import { fileLink } from "@/lib/email";
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
  adminRemoveUpload,
  adminRunEmailQueue,
} from "./actions";
import { ProductFileUpload } from "./product-file-upload";
import { PasswordForm } from "./password-form";
import { getCoverImages } from "@/lib/product-files";
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

  const [{ orders, reviews, bookings, requests, outbox }, { products }, files] = await Promise.all([
    loadData(),
    getSiteContent(),
    getProductFiles(),
  ]);
  const covers = await getCoverImages();
  const downloads = products.filter((p) => p.type !== "service");
  const productTitle = (slug: string) => {
    const p = products.find((x) => x.slug === slug);
    return p ? `${p.title} · ${p.subtitle}` : slug;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="h-title text-6xl sm:text-8xl">Admin</h1>
        <div className="flex flex-wrap gap-2">
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

      <section className="mt-8 rounded-[8px] border border-line bg-surface p-5 text-sm">
        <h2 className="text-lg font-bold">How do I…</h2>
        <dl className="mt-3 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="font-semibold">See who booked me?</dt>
            <dd className="mt-1 text-muted">
              Studio sessions are under <a href="#bookings" className="text-ink underline underline-offset-2">Session bookings</a>.
              Paid mixing, mastering and shoot packages, and store sales, are under{" "}
              <a href="#orders" className="text-ink underline underline-offset-2">Orders</a>. Quote requests and
              custom asks are under <a href="#requests" className="text-ink underline underline-offset-2">Service requests</a>.
              Every card payment also shows in your Stripe app.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Sell a product so the buyer gets it?</dt>
            <dd className="mt-1 text-muted">
              Upload its file under <a href="#product-files" className="text-ink underline underline-offset-2">Product files</a>.
              The buyer gets a download button the second they pay.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Change wording, prices or add a product, without Claude?</dt>
            <dd className="mt-1 text-muted">
              All the words live in one file.{" "}
              <a href="https://github.com/andrreisutton/imandrei-delivery/edit/main/site/src/content/site.ts" target="_blank" rel="noopener" className="text-ink underline underline-offset-2">
                Open it on GitHub
              </a>{" "}
              (signed in as andrreisutton), press Cmd+F to find the words, change them between the
              quotes, then press <strong className="text-ink">Commit changes</strong>. It&apos;s live in about
              2 minutes. For a new product, copy an existing product block in that file and change it,
              then upload its file here.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Change a product thumbnail?</dt>
            <dd className="mt-1 text-muted">
              Upload an image under <a href="#thumbnails" className="text-ink underline underline-offset-2">Thumbnails</a>.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Change my password?</dt>
            <dd className="mt-1 text-muted">
              Under <a href="#password" className="text-ink underline underline-offset-2">Password</a> at the bottom.
            </dd>
          </div>
        </dl>
      </section>

      <section id="product-files" className="mt-10 scroll-mt-24">
        <h2 className="text-lg font-bold">Product files</h2>
        <p className="mt-1 max-w-prose text-sm text-muted">
          Upload the file a buyer gets for each product (zip a folder first). The moment a file is
          here{stripeLive() ? "" : " and Stripe is on a live key"}, the product sells on the site and
          the buyer downloads it straight after paying. Until then it sells on Gumroad, or shows as
          not for sale.
        </p>
        <div className="mt-3 divide-y divide-line rounded-[8px] border border-line">
          {downloads.map((p) => {
            const f = files[p.slug];
            return (
              <div key={p.slug} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
                <div className="min-w-0">
                  <p className="font-semibold">
                    {p.title} · {p.subtitle}
                  </p>
                  {f ? (
                    <p className="mt-0.5 break-all text-xs text-muted">
                      <a href={`/api/admin/file?p=${encodeURIComponent(f.pathname)}`} className="hover:text-ink">
                        {f.name}
                      </a>{" "}
                      · {(f.size / (1024 * 1024)).toFixed(1)} MB · {fmt(f.uploadedAt)}
                    </p>
                  ) : (
                    <p className="mt-0.5 text-xs text-faint">No file yet</p>
                  )}
                </div>
                <div className="flex items-start gap-2">
                  <ProductFileUpload slug={p.slug} hasFile={!!f} />
                  {f && (
                    <form action={adminRemoveUpload}>
                      <input type="hidden" name="slug" value={p.slug} />
                      <input type="hidden" name="kind" value="downloads" />
                      <button className="btn btn-ghost !px-4 !py-2 text-sm">Remove</button>
                    </form>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="thumbnails" className="mt-10 scroll-mt-24">
        <h2 className="text-lg font-bold">Thumbnails</h2>
        <p className="mt-1 max-w-prose text-sm text-muted">
          Upload a square image (at least 1200 by 1200, JPG, PNG or WebP) to replace a product&apos;s
          drawn cover everywhere on the site: the store, the product page and checkout. Remove it to
          go back to the drawn cover.
        </p>
        <div className="mt-3 divide-y divide-line rounded-[8px] border border-line">
          {products.map((p) => {
            const c = covers[p.slug];
            return (
              <div key={p.slug} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
                <div className="flex min-w-0 items-center gap-3">
                  {c ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`/api/cover/${p.slug}?v=${c.v}`}
                      alt=""
                      className="size-12 shrink-0 rounded-[6px] object-cover"
                    />
                  ) : (
                    <span className="size-12 shrink-0 rounded-[6px] border border-line" aria-hidden="true" />
                  )}
                  <p className="font-semibold">
                    {p.title} · {p.subtitle}
                    <span className="block text-xs font-normal text-faint">
                      {c ? "Custom image" : "Drawn cover"}
                    </span>
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <ProductFileUpload slug={p.slug} hasFile={!!c} kind="covers" />
                  {c && (
                    <form action={adminRemoveUpload}>
                      <input type="hidden" name="slug" value={p.slug} />
                      <input type="hidden" name="kind" value="covers" />
                      <button className="btn btn-ghost !px-4 !py-2 text-sm">Remove</button>
                    </form>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="orders" data-reveal className="mt-10 scroll-mt-24">
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
        <section id="bookings" data-reveal className="scroll-mt-24">
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
                        <a key={u} href={fileLink(u)} target="_blank" rel="noreferrer" className="underline hover:text-ink">
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
        <section id="requests" data-reveal className="scroll-mt-24">
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
                        <a key={u} href={fileLink(u)} target="_blank" rel="noreferrer" className="underline hover:text-ink">
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

      <section id="password" className="mt-10 scroll-mt-24">
        <h2 className="text-lg font-bold">Password</h2>
        <p className="mt-1 max-w-prose text-sm text-muted">
          Change the password for this page. Anyone signed in with the old one is signed out.
        </p>
        <PasswordForm />
      </section>
    </div>
  );
}
