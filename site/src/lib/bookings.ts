import { claimJSON, readJSON, saveJSON } from "./store";
import type { BookingCheckoutEvent, BookingEvent, BookingRecord } from "./types";
import { esc, renderBookingConfirmation, renderOwnerNotification, sendEmail } from "./email";
import { getStripe, stripeEnabled } from "./stripe";

export async function getBooking(id: string): Promise<BookingRecord | null> {
  return readJSON<BookingRecord>(`bookings/${id}`);
}

export async function isBookingPaid(id: string): Promise<boolean> {
  return !!(await readJSON<BookingEvent>(`booking-events/${id}/paid`));
}

export async function markBookingPaid(bookingId: string): Promise<void> {
  const booking = await getBooking(bookingId);
  if (!booking) throw new Error("Booking not found");
  if (await isBookingPaid(bookingId)) return;

  if (
    await claimJSON(`booking-events/${bookingId}/confirmation-sent`, {
      bookingId,
      at: new Date().toISOString(),
    } satisfies BookingEvent)
  ) {
    const confirmation = await renderBookingConfirmation(booking, { paid: true });
    await sendEmail({
      to: booking.email,
      ...confirmation,
      type: "booking-confirmation",
      refId: bookingId,
    });
  }

  const to = process.env.NOTIFY_EMAIL;
  if (
    to &&
    (await claimJSON(`booking-events/${bookingId}/owner-notified`, {
      bookingId,
      at: new Date().toISOString(),
    } satisfies BookingEvent))
  ) {
    const email = await renderOwnerNotification(
      "paid session booking",
      `${booking.sessionTitle} · ${booking.preferredDate}`,
      `<p style="color:#b7b4ae;font-size:15px;">${esc(booking.name)} (${esc(booking.email)}) booked and <strong style="color:#f5f4f2">paid</strong> a <strong style="color:#f5f4f2">${esc(booking.sessionTitle)}</strong> on ${esc(booking.preferredDate)} at ${esc(booking.preferredTime)}. ${esc(booking.duration ?? "")}, <strong style="color:#f5f4f2">$${booking.quotedTotal ?? 0}</strong> collected through Stripe.${booking.notes ? `<br/><br/>Notes: ${esc(booking.notes)}` : ""}</p>`
    );
    await sendEmail({ to, ...email, type: "owner-notification", refId: bookingId });
  }

  await saveJSON(`booking-events/${bookingId}/paid`, {
    bookingId,
    at: new Date().toISOString(),
  } satisfies BookingEvent);
}

export async function reconcileBookingPayment(
  bookingId: string,
  sessionIdHint?: string
): Promise<boolean> {
  if (await isBookingPaid(bookingId)) return true;
  if (!stripeEnabled()) return false;

  const stored = await readJSON<BookingCheckoutEvent>(`booking-events/${bookingId}/checkout`);
  const candidates = [stored?.sessionId, sessionIdHint].filter(
    (s, i, all): s is string =>
      typeof s === "string" && /^cs_[A-Za-z0-9_]+$/.test(s) && all.indexOf(s) === i
  );
  for (const sessionId of candidates) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(sessionId);
      if (session.metadata?.bookingId === bookingId && session.payment_status === "paid") {
        await markBookingPaid(bookingId);
        return true;
      }
    } catch (e) {
      console.error("booking payment reconcile failed", bookingId, e);
    }
  }
  return false;
}
