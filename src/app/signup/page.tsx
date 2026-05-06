"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Check } from "lucide-react";
import { AuthShell, TextField } from "@/components/AuthShell";
import { signupAction, googleSignInAction } from "@/lib/actions";

export default function SignupPage() {
  const [state, action, pending] = useActionState(signupAction, null);
  return (
    <AuthShell
      title="Start your 14-day free trial."
      subtitle="No credit card required. Cancel anytime."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="text-ink underline">
            Log in
          </Link>
        </>
      }
    >
      <form action={action} className="space-y-4">
        <TextField label="Full name" name="name" required placeholder="Jane Smith" />
        <TextField
          label="Work email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          required
          minLength={8}
          placeholder="At least 8 characters"
        />
        <TextField label="Company / industry" name="company" placeholder="Smith Property" />
        {state?.error ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {state.error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className="btn-tick w-full disabled:opacity-60"
        >
          {pending ? "Creating account…" : "Create my account"}
        </button>
        <ul className="space-y-1.5 pt-2 text-xs text-ink/60">
          <li className="flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-tick" /> 14-day free trial
          </li>
          <li className="flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-tick" /> No credit card required
          </li>
          <li className="flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-tick" /> Cancel anytime
          </li>
        </ul>
      </form>
      <form action={googleSignInAction} className="mt-3">
        <button type="submit" className="btn-secondary w-full">
          Continue with Google
        </button>
      </form>
    </AuthShell>
  );
}
