"use client";

import { useActionState } from "react";
import { submitServiceRequest, type ActionState } from "@/app/actions";
import { CheckCircle } from "@phosphor-icons/react";
import { Select } from "@/components/select";
import { ProofCtaNote } from "@/components/proof";

const TRAVEL_OPTIONS = [
  { value: "local", label: "Local — no travel needed" },
  { value: "client-covers", label: "I can cover travel costs" },
  { value: "quote", label: "I'd like travel included in the quote" },
];

export function PhotoVideoRequestForm({ services }: { services: { slug: string; title: string }[] }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(submitServiceRequest, {});

  if (state.ok) {
    return (
      <div className="card card-pad text-center">
        <CheckCircle size={40} className="mx-auto text-accent-bright" weight="fill" />
        <p className="mt-4 text-lg font-bold">Request sent.</p>
        <p className="mt-2 text-muted">
          Check your inbox for a confirmation. You&apos;ll hear back within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="card card-pad grid gap-5">
      <div className="field">
        <label htmlFor="pv-service">Package</label>
        <Select
          id="pv-service"
          name="serviceSlug"
          required
          placeholder="Choose a package, or custom"
          items={[
            ...services.map((s) => ({ value: s.slug, label: s.title })),
            { value: "custom", label: "Not sure / custom request" },
          ]}
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="field">
          <label htmlFor="pv-name">Your name</label>
          <input id="pv-name" name="name" className="input" autoComplete="name" required />
        </div>
        <div className="field">
          <label htmlFor="pv-artist">Artist / brand name</label>
          <input id="pv-artist" name="artistName" className="input" placeholder="Optional" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="pv-email">Email</label>
        <input id="pv-email" name="email" type="email" className="input" autoComplete="email" required />
      </div>
      <div className="field">
        <label htmlFor="pv-location">Where&apos;s the shoot?</label>
        <input id="pv-location" name="location" className="input" placeholder="City, venue, or address" />
      </div>
      <div className="field">
        <label htmlFor="pv-travel">Travel</label>
        <Select id="pv-travel" name="travelCoverage" placeholder="If this is outside my local area" items={TRAVEL_OPTIONS} />
        <p className="text-xs text-faint">
          Traveling me in for this is no problem — just let me know where things stand and
          I&apos;ll fold it into the quote.
        </p>
      </div>
      <div className="field">
        <label htmlFor="pv-notes">About the shoot</label>
        <textarea
          id="pv-notes"
          name="notes"
          className="input min-h-28 resize-y"
          placeholder="Date, what it's for, photo or video (or both), anything that matters"
        />
      </div>
      {state.error && (
        <p role="alert" className="text-sm font-medium text-accent-bright">
          {state.error}
        </p>
      )}
      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? "Sending…" : "Send request"}
      </button>
      <ProofCtaNote className="justify-center" />
    </form>
  );
}
