import Link from "next/link";
import { Check } from "lucide-react";
import { AuthShell, TextField } from "@/components/AuthShell";

export const metadata = { title: "Create your account" };

export default function SignupPage() {
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
      <form className="space-y-4">
        <TextField label="Full name" placeholder="Jane Smith" />
        <TextField label="Work email" type="email" placeholder="you@example.com" />
        <TextField label="Password" type="password" placeholder="At least 8 characters" />
        <TextField label="Company / industry" placeholder="Smith Property" />
        <button type="button" className="btn-tick w-full">
          Create my account
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
    </AuthShell>
  );
}
