"use client";

import { useActionState } from "react";
import { startBundleCheckout, type ActionState } from "@/app/actions";
import { ProofCtaNote } from "@/components/proof";
import { StripeMark } from "@/components/stripe-mark";

export function BundleCheckoutForm({ items, price }: { items: string; price: number }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(startBundleCheckout, {});

  return (
    <form action={action} className="mt-8 grid gap-5">
      <input type="hidden" name="items" value={items} />

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="field">
          <label htmlFor="bco-name">Name</label>
          <input id="bco-name" name="name" className="input" autoComplete="name" required />
        </div>
        <div className="field">
          <label htmlFor="bco-email">Email</label>
          <input
            id="bco-email"
            name="email"
            type="email"
            className="input"
            autoComplete="email"
            required
          />
          <p className="text-xs text-faint">Your links and receipts go here. Double-check it.</p>
        </div>
      </div>

      {state.error && (
        <p role="alert" className="text-sm font-medium text-accent-bright">
          {state.error}
        </p>
      )}

      <button type="submit" className="btn btn-stripe" disabled={pending}>
        <StripeMark size={15} />
        {pending ? "Processing…" : `Pay $${price.toFixed(2)}`}
      </button>
      <ProofCtaNote className="justify-center" />
    </form>
  );
}
