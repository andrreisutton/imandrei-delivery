"use client";

import { useActionState } from "react";
import { adminChangePassword } from "./actions";
import type { ActionState } from "@/app/actions";

export function PasswordForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(adminChangePassword, {});
  return (
    <form action={action} className="mt-3 grid max-w-sm gap-4">
      <div className="field">
        <label htmlFor="pw-current">Current password</label>
        <input id="pw-current" name="current" type="password" className="input" autoComplete="current-password" required />
      </div>
      <div className="field">
        <label htmlFor="pw-next">New password (10+ characters)</label>
        <input id="pw-next" name="next" type="password" className="input" autoComplete="new-password" minLength={10} required />
      </div>
      <div className="field">
        <label htmlFor="pw-confirm">New password again</label>
        <input id="pw-confirm" name="confirm" type="password" className="input" autoComplete="new-password" minLength={10} required />
      </div>
      {state.error && (
        <p role="alert" className="text-sm font-medium text-accent-bright">
          {state.error}
        </p>
      )}
      {state.ok && (
        <p role="status" className="text-sm font-medium text-ink">
          Password changed. Every other device is signed out.
        </p>
      )}
      <button type="submit" className="btn btn-primary justify-self-start" disabled={pending}>
        <span className="grid">
          <span className={`[grid-area:1/1] ${pending ? "invisible" : ""}`}>Change password</span>
          <span className={`[grid-area:1/1] ${pending ? "" : "invisible"}`}>Saving…</span>
        </span>
      </button>
    </form>
  );
}
