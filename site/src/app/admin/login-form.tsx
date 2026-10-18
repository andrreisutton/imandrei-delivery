"use client";

import { useActionState } from "react";
import { adminLogin } from "./actions";
import type { ActionState } from "@/app/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(adminLogin, {});
  return (
    <form action={action} className="card card-pad mx-auto mt-16 grid w-full max-w-sm gap-5">
      <h1 className="h-title text-6xl sm:text-8xl">Admin</h1>
      <div className="field">
        <label htmlFor="admin-pw">Password</label>
        <input id="admin-pw" name="password" type="password" className="input" autoFocus required />
      </div>
      {state.error && (
        <p role="alert" className="text-sm font-medium text-accent-bright">
          {state.error}
        </p>
      )}
      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? "Checking…" : "Sign in"}
      </button>
    </form>
  );
}
