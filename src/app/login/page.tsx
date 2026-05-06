import Link from "next/link";
import { AuthShell, TextField } from "@/components/AuthShell";

export const metadata = { title: "Log in" };

export default function LoginPage() {
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
      <form className="space-y-4">
        <TextField label="Email" type="email" placeholder="you@example.com" />
        <TextField label="Password" type="password" placeholder="••••••••" />
        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-ink/65">
            <input type="checkbox" className="h-3.5 w-3.5 accent-tick" /> Keep me
            signed in
          </label>
          <Link href="/forgot-password" className="link-muted">
            Forgot password?
          </Link>
        </div>
        <button type="button" className="btn-tick w-full">
          Log in
        </button>
        <button type="button" className="btn-secondary w-full">
          Continue with Google
        </button>
      </form>
    </AuthShell>
  );
}
