"use client";

import { useActionState } from "react";
import { submitServiceRequest, type ActionState } from "@/app/actions";
import { CheckCircle } from "@phosphor-icons/react";
import { Select } from "@/components/select";
import { ProofCtaNote } from "@/components/proof";

export function ServiceRequestForm({ services }: { services: { slug: string; title: string }[] }) {
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
        <label htmlFor="serviceSlug">Service</label>
        <Select
          id="serviceSlug"
          name="serviceSlug"
          required
          placeholder="Choose a service"
          items={services.map((s) => ({ value: s.slug, label: s.title }))}
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="field">
          <label htmlFor="sr-name">Your name</label>
          <input id="sr-name" name="name" className="input" autoComplete="name" required />
        </div>
        <div className="field">
          <label htmlFor="sr-artist">Artist name</label>
          <input id="sr-artist" name="artistName" className="input" placeholder="Optional" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="sr-email">Email</label>
        <input id="sr-email" name="email" type="email" className="input" autoComplete="email" required />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="field">
          <label htmlFor="sr-song">Song title</label>
          <input id="sr-song" name="songTitle" className="input" placeholder="Optional" />
        </div>
        <div className="field">
          <label htmlFor="sr-ref">Reference track</label>
          <input id="sr-ref" name="referenceTrack" className="input" placeholder="Link or artist, song" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="sr-notes">About the record</label>
        <textarea
          id="sr-notes"
          name="notes"
          className="input min-h-28 resize-y"
          placeholder="Genre, stem count, deadline, anything that matters"
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
