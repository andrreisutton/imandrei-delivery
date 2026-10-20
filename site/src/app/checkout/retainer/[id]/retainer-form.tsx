"use client";

import { useActionState } from "react";
import { startRetainerCheckout, type ActionState } from "@/app/actions";
import { StripeMark } from "@/components/stripe-mark";

export function RetainerForm({
  retainerId,
  price,
  canPay,
}: {
  retainerId: string;
  price: number;
  canPay: boolean;
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    startRetainerCheckout,
    {}
  );

  return (
    <form action={action} className="mt-8 grid gap-5">
      <input type="hidden" name="retainerId" value={retainerId} />

      <div className="grid gap-2">
        <label htmlFor="name" className="text-sm font-semibold">
          Name
        </label>
        <input id="name" name="name" className="input" autoComplete="name" required />
      </div>

      <div className="grid gap-2">
        <label htmlFor="email" className="text-sm font-semibold">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="input"
          autoComplete="email"
          required
        />
        <p className="text-xs text-faint">Your receipt and the schedule go here.</p>
      </div>

      <div className="grid gap-2">
        <label htmlFor="channelUrl" className="text-sm font-semibold">
          Channel or artist link
        </label>
        <input
          id="channelUrl"
          name="channelUrl"
          className="input"
          placeholder="youtube.com/@yourchannel"
        />
      </div>

      {state.error && (
        <p role="alert" className="text-sm font-medium text-accent-bright">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        className={`btn ${canPay ? "btn-stripe" : "btn-primary"}`}
        disabled={pending}
      >
        {canPay && !pending && <StripeMark size={15} />}
        {pending ? "Starting secure checkout…" : `Subscribe · $${price.toLocaleString("en-US")} a month`}
      </button>

      <p className="text-center text-xs text-faint">
        Billed monthly. Reply to your receipt to change or stop anything.
      </p>
    </form>
  );
}
