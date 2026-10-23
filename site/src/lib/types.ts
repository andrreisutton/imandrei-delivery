export type OrderRecord = {
  id: string;
  productSlug: string;
  productTitle: string;
  email: string;
  name: string;
  amount: number;
  mode: "demo" | "stripe";
  deliveryUrl?: string;
  deliveryToken: string;
  reviewToken: string;
  createdAt: string;
};

export type OrderEvent = {
  orderId: string;
  at: string;
  sendAt?: string;
};

export type OrderState = {
  order: OrderRecord;
  paid: boolean;
  receiptSentAt?: string;
  reviewScheduledFor?: string;
  reviewEmailSentAt?: string;
  reviewedAt?: string;
};

export type ReviewRecord = {
  id: string;
  productSlug: string;
  orderId: string;
  rating: number;
  text: string;
  authorName: string;
  createdAt: string;
  sample?: boolean;
};

export type BookingRecord = {
  id: string;
  sessionId: string;
  sessionTitle: string;
  name: string;
  email: string;
  artistName?: string;
  preferredDate: string;
  preferredTime: string;
  duration?: string;
  quotedTotal?: number;
  extraTime?: string;
  paymentMode?: "stripe" | "at-session";
  notes?: string;
  fileUrls?: string[];
  createdAt: string;
};

export type BookingEvent = {
  bookingId: string;
  at: string;
};

export type BookingCheckoutEvent = {
  bookingId: string;
  sessionId: string;
  at: string;
};

export type ServiceRequestRecord = {
  id: string;
  serviceSlug: string;
  serviceTitle: string;
  name: string;
  email: string;
  artistName?: string;
  songTitle?: string;
  referenceTrack?: string;
  channelUrl?: string;
  cadence?: string;
  notes?: string;
  location?: string;
  travelCoverage?: string;
  fileUrls?: string[];
  createdAt: string;
};

export type OutboxEmail = {
  id: string;
  to: string;
  subject: string;
  html: string;
  type:
    | "receipt"
    | "review-request"
    | "booking-confirmation"
    | "service-next-steps"
    | "owner-notification";
  refId?: string;
  channel: "resend" | "outbox";
  sentAt: string;
  error?: string;
};
