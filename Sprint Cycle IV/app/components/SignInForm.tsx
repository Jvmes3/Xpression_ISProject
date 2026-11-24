"use client";

import { useActionState } from "react";
import { signIn } from "../lib/actions";

export function SignInForm({
  returnTo = "",
  errors,
  note = "",
  initialError = "",
}: {
  returnTo?: string;
  errors: Record<string, string>;
  note?: string;
  initialError?: string;
}) {
  const [state, action, pending] = useActionState(signIn, { error: initialError });
  const message = state?.error ? errors[state.error] || "That sign-in was not accepted." : "";

  return (
    <form className="form panel" action={action}>
      {returnTo ? <input type="hidden" name="returnTo" value={returnTo} /> : null}
      {message ? <p className="note">{message}</p> : null}
      <label>
        Email
        <input type="email" name="email" placeholder="youremail@gmail.com" required />
      </label>
      <label>
        Password
        <input type="password" name="password" placeholder="Password" required />
      </label>
      {note ? <p className="note">{note}</p> : null}
      <button className="button" type="submit" disabled={pending}>
        {pending ? "Signing in" : "Sign in"}
      </button>
    </form>
  );
}
