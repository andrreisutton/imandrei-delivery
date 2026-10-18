import { newId } from "./id";
import { saveJSON } from "./store";
import type { OrderRecord, BookingRecord, ServiceRequestRecord, OutboxEmail } from "./types";
import { getSiteContent } from "./content";

type Brand = { name: string; shortName: string };

export function siteUrl(): string {
  return (
    process.env.SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000")
  );
}

export function esc(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!
  );
}

const C = {
  bg: "#0a0a0a",
  card: "#141212",
  line: "#2b2727",
  ink: "#f7f7f7",
  muted: "#aca8a8",
  accent: "#fa4942",
};

function shell(title: string, bodyHtml: string, brand: Brand): string {
  return `<!doctype html>
<html>
<body style="margin:0;padding:0;background:${C.bg};font-family:Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg};padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
        <tr><td style="padding:0 8px 20px 8px;">
          <span style="color:${C.ink};font-size:13px;letter-spacing:3px;font-weight:700;">${brand.shortName}</span>
          <span style="color:${C.accent};font-size:13px;">&#9679;</span>
        </td></tr>
        <tr><td style="background:${C.card};border:1px solid ${C.line};border-radius:16px;padding:32px 28px;">
          <h1 style="margin:0 0 16px 0;color:${C.ink};font-size:22px;line-height:1.3;">${title}</h1>
          ${bodyHtml}
        </td></tr>
        <tr><td style="padding:20px 8px 0 8px;color:${C.muted};font-size:12px;line-height:1.6;">
          ${brand.name} · This email was sent because of a purchase or request at <a href="${siteUrl()}" style="color:${C.muted};">${siteUrl().replace(/^https?:\/\//, "")}</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function button(label: string, href: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 8px 0;"><tr>
    <td style="background:${C.accent};border-radius:6px;">
      <a href="${href}" style="display:inline-block;padding:13px 28px;color:#160d07;font-size:14px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;text-decoration:none;">${label}</a>
    </td></tr></table>`;
}

function p(text: string): string {
  return `<p style="margin:0 0 14px 0;color:${C.muted};font-size:15px;line-height:1.6;">${text}</p>`;
}

function orderTable(order: OrderRecord): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:18px 0;border-top:1px solid ${C.line};border-bottom:1px solid ${C.line};">
    <tr>
      <td style="padding:14px 0;color:${C.ink};font-size:15px;">${esc(order.productTitle)}</td>
      <td align="right" style="padding:14px 0;color:${C.ink};font-size:15px;font-weight:700;">$${order.amount.toFixed(2)}</td>
    </tr>
  </table>
  <p style="margin:0;color:${C.muted};font-size:13px;">Order ${order.id.slice(0, 8).toUpperCase()} · ${new Date(order.createdAt).toUTCString()}</p>`;
}

function linkLine(label: string, href: string): string {
  return `<p style="margin:0 0 14px 0;color:${C.muted};font-size:13px;line-height:1.6;word-break:break-all;">${label}<br><a href="${href}" style="color:${C.accent};">${href}</a></p>`;
}

export async function renderReceipt(
  order: OrderRecord,
  opts: { isService: boolean; deliveryUrl?: string }
): Promise<{ subject: string; html: string }> {
  const { brand } = await getSiteContent();
  const { isService, deliveryUrl: productLink } = opts;
  const orderUrl = `${siteUrl()}/order/${order.deliveryToken}`;

  if (!isService && productLink) {
    return {
      subject: `Your preset is ready: ${order.productTitle}`,
      html: shell(
        "Payment received. Here's your preset.",
        p(`Thanks ${esc(order.name.split(" ")[0])}, your order is confirmed. Open the link below, hit save, and it's on your track.`) +
          orderTable(order) +
          button("Open your preset", productLink) +
          linkLine("Or paste this into your browser:", productLink) +
          p(`Keep this email, the link stays yours. Your order page lives at <a href="${orderUrl}" style="color:${C.accent};">${orderUrl.replace(/^https?:\/\//, "")}</a>. If anything doesn't load, just reply here.`),
        brand
      ),
    };
  }

  const deliveryUrl = orderUrl;
  if (isService) {
    return {
      subject: `You're booked in: ${order.productTitle}`,
      html: shell(
        "Payment received. Here's what happens next.",
        p(`Thanks ${esc(order.name.split(" ")[0])}, your payment for <strong style="color:${C.ink}">${esc(order.productTitle)}</strong> went through.`) +
          orderTable(order) +
          p(`Reply to this email with your stems (WAV, 24-bit if you have them) and a reference track. Your slot starts as soon as the files land.`) +
          button("View your order", deliveryUrl),
        brand
      ),
    };
  }
  return {
    subject: `Your download is ready: ${order.productTitle}`,
    html: shell(
      "Payment received. Your files are ready.",
      p(`Thanks ${esc(order.name.split(" ")[0])}, your order is confirmed and your download is live right now.`) +
        orderTable(order) +
        button("Download your files", deliveryUrl) +
        p(`The link is yours, keep this email. If anything doesn't load, just reply here.`),
      brand
    ),
  };
}

export async function renderReviewRequest(order: OrderRecord): Promise<{ subject: string; html: string }> {
  const { brand } = await getSiteContent();
  const reviewUrl = `${siteUrl()}/review/${order.reviewToken}`;
  return {
    subject: `How's ${order.productTitle} sounding?`,
    html: shell(
      "You've had a few hours with it. How does it sound?",
      p(`Hey ${esc(order.name.split(" ")[0])}, you grabbed <strong style="color:${C.ink}">${esc(order.productTitle)}</strong> earlier today. If you've had a chance to run a vocal through it, a quick review helps other artists know what they're getting.`) +
        p(`It takes about 30 seconds. Your review goes live on the product page.`) +
        button("Leave a review", reviewUrl),
      brand
    ),
  };
}

export async function renderBookingConfirmation(
  booking: BookingRecord,
  opts: { paid?: boolean } = {}
): Promise<{ subject: string; html: string }> {
  const { brand } = await getSiteContent();
  if (opts.paid) {
    return {
      subject: `Session booked: ${booking.sessionTitle}`,
      html: shell(
        "Your session is booked and paid.",
        p(`Hey ${esc(booking.name.split(" ")[0])}, payment went through and your <strong style="color:${C.ink}">${esc(booking.sessionTitle)}</strong> is locked in.`) +
          p(`Booked: <strong style="color:${C.ink}">${esc(booking.preferredDate)}</strong> at ${esc(booking.preferredTime)}${booking.duration ? ` · ${esc(booking.duration)}` : ""}${booking.quotedTotal ? ` · <strong style="color:${C.ink}">$${booking.quotedTotal} paid</strong>` : ""}.`) +
          p(`I'll confirm the exact start time by reply within 24 hours. If you need to change anything, just answer this email.`),
        brand
      ),
    };
  }
  return {
    subject: `Session request received: ${booking.sessionTitle}`,
    html: shell(
      "Your session request is in.",
      p(`Hey ${esc(booking.name.split(" ")[0])}, your request for a <strong style="color:${C.ink}">${esc(booking.sessionTitle)}</strong> is locked in on my end.`) +
        p(`Requested: <strong style="color:${C.ink}">${esc(booking.preferredDate)}</strong> at ${esc(booking.preferredTime)}${booking.duration ? ` · ${esc(booking.duration)}` : ""}${booking.quotedTotal ? ` · $${booking.quotedTotal} total, paid at the session` : ""}.`) +
        p(`I'll confirm the exact time by reply within 24 hours. If you need to change anything, just answer this email.`),
      brand
    ),
  };
}

export async function renderOwnerNotification(kind: string, summary: string, detailsHtml: string): Promise<{ subject: string; html: string }> {
  const { brand } = await getSiteContent();
  return {
    subject: `[${brand.shortName}] New ${kind}: ${summary}`,
    html: shell(`New ${kind}`, detailsHtml + button("Open admin", `${siteUrl()}/admin`), brand),
  };
}

export async function renderServiceRequestConfirmation(req: ServiceRequestRecord): Promise<{ subject: string; html: string }> {
  const { brand } = await getSiteContent();
  return {
    subject: `Request received: ${req.serviceTitle}`,
    html: shell(
      "Got your request.",
      p(`Hey ${esc(req.name.split(" ")[0])}, your <strong style="color:${C.ink}">${esc(req.serviceTitle)}</strong> request came through.`) +
        p(`I'll reply within 24 hours with next steps and how to send your files.`),
      brand
    ),
  };
}

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  type: OutboxEmail["type"];
  refId?: string;
}): Promise<void> {
  const id = newId(16);
  const key = process.env.RESEND_API_KEY;
  const { brand } = await getSiteContent();
  const from = process.env.EMAIL_FROM || `${brand.name} <onboarding@resend.dev>`;
  let channel: OutboxEmail["channel"] = "outbox";
  let error: string | undefined;

  if (key) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from, to: opts.to, subject: opts.subject, html: opts.html }),
      });
      if (res.ok) channel = "resend";
      else error = `Resend ${res.status}: ${await res.text()}`;
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    }
  }

  const record: OutboxEmail = {
    id,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    type: opts.type,
    refId: opts.refId,
    channel,
    sentAt: new Date().toISOString(),
    ...(error ? { error } : {}),
  };
  await saveJSON(`outbox/${id}`, record);
}
