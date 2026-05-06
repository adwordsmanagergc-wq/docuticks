import Link from "next/link";
import { AuthShell, TextField } from "@/components/AuthShell";

export const metadata = { title: "Reset password" };

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Reset your password."
      subtitle="We'll email you a secure link to set a new password."
      footer={
        <Link href="/login" className="link-muted">
          ← Back to log in
        </Link>
      }
    >
      <form className="space-y-4">
        <TextField label="Email" type="email" placeholder="you@example.com" />
        <button type="button" className="btn-tick w-full">
          Send reset link
        </button>
      </form>
    </AuthShell>
  );
}
