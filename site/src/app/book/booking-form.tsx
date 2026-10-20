"use client";

import { useState } from "react";
import { useActionState } from "react";
import { submitBooking, type ActionState } from "@/app/actions";
import { StripeMark, StripeSecured } from "@/components/stripe-mark";
import { CheckCircle } from "@phosphor-icons/react";
import { Select } from "@/components/select";
import { ApertureDisc } from "@/components/aperture-disc";
import { ProofCtaNote } from "@/components/proof";
import { StemsUpload } from "@/components/stems-upload";

const START_TIMES = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
];

const OPTION_HUES = [300, 210, 85, 25];

const MAX_EXTRA_HOURS = 6;

type SessionOption = { id: string; title: string; price: number; duration: string };

type DayOption = { value: string; weekday: string; date: string };

export function parseBaseHours(duration: string): number {
  const m = duration.match(/\d+/);
  return m ? Math.min(12, Math.max(1, parseInt(m[0], 10))) : 2;
}

export function priceForHours(s: { price: number; duration: string }, hours: number): number {
  const base = parseBaseHours(s.duration);
  const rate = Math.round(s.price / base);
  return s.price + Math.max(0, hours - base) * rate;
}

export function BookingForm({
  sessions,
  days,
  stripeOn,
}: {
  sessions: SessionOption[];
  days: DayOption[];
  stripeOn: boolean;
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(submitBooking, {});
  const [uploading, setUploading] = useState(false);
  const [sessionId, setSessionId] = useState(sessions[0]?.id);
  const session = sessions.find((s) => s.id === sessionId) ?? sessions[0];
  const base = parseBaseHours(session?.duration ?? "2 hours");
  const [hours, setHours] = useState<number | null>(null);
  const chosenHours = hours !== null && hours >= base && hours <= base + MAX_EXTRA_HOURS ? hours : base;
  const total = session ? priceForHours(session, chosenHours) : 0;
  const hourOptions = Array.from({ length: MAX_EXTRA_HOURS + 1 }, (_, i) => base + i);

  if (state.ok) {
    return (
      <div className="card card-pad self-start text-center">
        <CheckCircle size={40} className="mx-auto text-accent-bright" weight="fill" />
        <p className="mt-4 text-lg font-bold">Session request locked in.</p>
        <p className="mt-2 text-muted">
          A confirmation just went to your inbox. The exact time gets confirmed by reply within 24
          hours.
        </p>
      </div>
    );
  }

  return (
    <form
      action={action}
      className="card card-pad grid gap-5 self-start overflow-x-clip"
    >
      <fieldset className="grid gap-3">
        <legend className="mb-1 text-sm font-semibold">Session type</legend>
        {sessions.map((s, i) => (
          <label
            key={s.id}
            className="flex cursor-pointer items-center justify-between gap-3 rounded-[8px] border border-line-strong px-4 py-3.5 transition-colors has-checked:border-accent has-checked:bg-accent-dim"
          >
            <span className="flex items-center gap-3">
              <input
                type="radio"
                name="sessionId"
                value={s.id}
                checked={sessionId === s.id}
                onChange={() => {
                  setSessionId(s.id);
                  setHours(null);
                }}
                className="size-4 accent-[var(--color-accent)]"
              />
              <span className="group flex items-center gap-2.5">
                <ApertureDisc hue={OPTION_HUES[i % OPTION_HUES.length]} className="size-7 shrink-0" />
                <span className="font-medium">{s.title}</span>
              </span>
            </span>
            <span className="text-sm text-muted">${s.price}</span>
          </label>
        ))}
      </fieldset>

      <fieldset className="grid min-w-0 gap-3">
        <legend className="mb-1 text-sm font-semibold">Day</legend>
        <div className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-1.5">
          {days.map((d, i) => (
            <label
              key={d.value}
              className="shrink-0 snap-start cursor-pointer rounded-[8px] border border-line-strong px-3.5 py-2.5 text-center transition-colors has-checked:border-accent has-checked:bg-accent-dim has-focus-visible:outline-2 has-focus-visible:outline-accent"
            >
              <input
                type="radio"
                name="preferredDate"
                value={d.value}
                required={i === 0}
                className="sr-only"
              />
              <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">
                {d.weekday}
              </span>
              <span className="mt-0.5 block text-sm font-medium">{d.date}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="field">
          <label htmlFor="bk-time">Start time</label>
          <Select
            id="bk-time"
            name="preferredTime"
            required
            placeholder="Pick a time"
            items={START_TIMES.map((t) => ({ value: t, label: t }))}
          />
        </div>
        <div className="field">
          <label htmlFor="bk-hours">How long</label>
          <Select
            id="bk-hours"
            name="hours"
            ariaLabel="Session length in hours"
            value={String(chosenHours)}
            onValueChange={(v) => setHours(Number(v))}
            items={hourOptions.map((h) => ({
              value: String(h),
              label: `${h} ${h === 1 ? "hour" : "hours"} · $${session ? priceForHours(session, h) : 0}`,
            }))}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="field">
          <label htmlFor="bk-name">Your name</label>
          <input id="bk-name" name="name" className="input" autoComplete="name" required />
        </div>
        <div className="field">
          <label htmlFor="bk-artist">Artist name</label>
          <input id="bk-artist" name="artistName" className="input" placeholder="Optional" />
        </div>
      </div>

      <div className="field">
        <label htmlFor="bk-email">Email</label>
        <input id="bk-email" name="email" type="email" className="input" autoComplete="email" required />
      </div>

      <div className="field">
        <label htmlFor="bk-notes">What are we working on?</label>
        <textarea
          id="bk-notes"
          name="notes"
          className="input min-h-28 resize-y"
          placeholder="Genre, how many songs, anything I should hear first"
        />
      </div>

      <StemsUpload name="fileUrls" onBusyChange={setUploading} />

      {state.error && (
        <p role="alert" className="text-sm font-medium text-accent-bright">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        className={`btn ${stripeOn ? "btn-stripe" : "btn-primary"}`}
        disabled={pending || uploading}
      >
        {stripeOn && !pending && !uploading && <StripeMark size={15} />}
        {uploading
          ? "Uploading files…"
          : pending
            ? stripeOn
              ? "Starting secure checkout…"
              : "Sending…"
            : stripeOn
              ? `Book & pay · $${total}`
              : `Request session · $${total}`}
      </button>
      {stripeOn ? (
        <>
          <StripeSecured />
          <p className="text-center text-xs text-faint">
            Your date locks in the moment payment clears.
          </p>
        </>
      ) : (
        <p className="text-center text-xs text-faint">
          No payment now. You pay at the session.
        </p>
      )}
      <ProofCtaNote className="-mt-2 justify-center" />
    </form>
  );
}
