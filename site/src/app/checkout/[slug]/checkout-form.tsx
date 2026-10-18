"use client";

import { useActionState } from "react";
import { startCheckout, type ActionState } from "@/app/actions";
import { ProofCtaNote } from "@/components/proof";

export function CheckoutForm({
  productSlug,
  isDemo,
  price,
}: {
  productSlug: string;
  isDemo: boolean;
  price: number;
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(startCheckout, {});

  return (
    <form action={action} className="mt-8 grid gap-5">
      <input type="hidden" name="productSlug" value={productSlug} />

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="field">
          <label htmlFor="co-name">Name</label>
          <input id="co-name" name="name" className="input" autoComplete="name" required />
        </div>
        <div className="field">
          <label htmlFor="co-email">Email</label>
          <input
            id="co-email"
            name="email"
            type="email"
            className="input"
            autoComplete="email"
            required
          />
          <p className="text-xs text-faint">Your link and receipt go here. Double-check it.</p>
        </div>
      </div>

      {isDemo && (
        <div className="grid gap-5 rounded-[8px] border border-line bg-surface p-5">
          <div className="field">
            <label htmlFor="co-card">Card number</label>
            <input
              id="co-card"
              inputMode="numeric"
              className="input"
              placeholder="4242 4242 4242 4242"
              autoComplete="cc-number"
            />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="field">
              <label htmlFor="co-exp">Expiry</label>
              <input
                id="co-exp"
                inputMode="numeric"
                className="input"
                placeholder="12/29"
                autoComplete="cc-exp"
              />
            </div>
            <div className="field">
              <label htmlFor="co-cvc">CVC</label>
              <input
                id="co-cvc"
                inputMode="numeric"
                className="input"
                placeholder="123"
                autoComplete="cc-csc"
              />
            </div>
          </div>
        </div>
      )}

      {state.error && (
        <p role="alert" className="text-sm font-medium text-accent-bright">
          {state.error}
        </p>
      )}

      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? "Processing…" : `Pay $${price}`}
      </button>
      <ProofCtaNote className="justify-center" />
    </form>
  );
}
