"use client";

import { useActionState } from "react";
import { CheckCircle } from "@phosphor-icons/react";
import { submitServiceRequest, type ActionState } from "@/app/actions";
import { Select } from "@/components/select";
import { ProofCtaNote } from "@/components/proof";

export function EditingRequestForm({ tiers }: { tiers: { id: string; title: string }[] }) {
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
        <label htmlFor="ed-tier">Tier</label>
        <Select
          id="ed-tier"
          name="serviceSlug"
          required
          placeholder="Choose a tier"
          items={tiers.map((t) => ({ value: t.id, label: t.title }))}
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="field">
          <label htmlFor="ed-name">Your name</label>
          <input id="ed-name" name="name" className="input" autoComplete="name" required />
        </div>
        <div className="field">
          <label htmlFor="ed-channel-name">Channel or artist name</label>
          <input id="ed-channel-name" name="artistName" className="input" placeholder="Optional" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="ed-email">Email</label>
        <input id="ed-email" name="email" type="email" className="input" autoComplete="email" required />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="field">
          <label htmlFor="ed-url">Channel link</label>
          <input
            id="ed-url"
            name="channelUrl"
            className="input"
            inputMode="url"
            placeholder="YouTube, Twitch, or Instagram"
          />
        </div>
        <div className="field">
          <label htmlFor="ed-cadence">How often you post</label>
          <input id="ed-cadence" name="cadence" className="input" placeholder="Twice a week, daily shorts" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="ed-notes">What keeps getting stuck</label>
        <textarea
          id="ed-notes"
          name="notes"
          className="input min-h-28 resize-y"
          placeholder="Turnaround, style, who edits today, anything that matters"
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
