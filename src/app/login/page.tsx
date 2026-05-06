"use client";

import Link from "next/link";
import { useActionState } from "react";
import { AuthShell, TextField } from "@/components/AuthShell";
import { loginAction, googleSignInAction } from "@/lib/actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, null);
  return (
    <AuthShell
      title="Welcome back."
      subtitle="Log in to your DocuTicks account."
      footer={
        <>
          New here?{" "}
          <Link href="/signup" className="text-ink underline">
            Create an account
          </Link>
        </>
      }
    >
      <form action={action} className="space-y-4">
        <TextField
          label="Email"
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
          placeholder="••••••••"
        />
        <div className="flex items-center justify-end text-xs">
          <Link href="/forgot-password" className="link-muted">
            Forgot password?
          </Link>
        </div>
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
          {pending ? "Signing in…" : "Log in"}
        </button>
      </form>
      <form action={googleSignInAction} className="mt-3">
        <button type="submit" className="btn-secondary w-full">
          Continue with Google
        </button>
      </form>
    </AuthShell>
  );
}
