import Link from "next/link";
import { ReactNode } from "react";
import { Logo } from "./Logo";

export function AuthShell({
  children,
  title,
  subtitle,
  footer,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
  footer?: ReactNode;
}) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col justify-between px-6 py-8">
        <Logo />
        <div className="mx-auto w-full max-w-sm py-12">
          <h1 className="text-3xl font-semibold tracking-tight text-ink">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-2 text-sm text-ink/60">{subtitle}</p>
          ) : null}
          <div className="mt-8">{children}</div>
          {footer ? (
            <div className="mt-8 text-center text-sm text-ink/60">{footer}</div>
          ) : null}
        </div>
        <p className="text-xs text-ink/40">
          © {new Date().getFullYear()} DocuTicks ·{" "}
          <Link href="/privacy" className="hover:text-ink">
            Privacy
          </Link>{" "}
          ·{" "}
          <Link href="/terms" className="hover:text-ink">
            Terms
          </Link>
        </p>
      </div>
      <div className="relative hidden overflow-hidden bg-ink lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.18),transparent_60%),radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.18),transparent_60%)]" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <blockquote className="max-w-md text-2xl leading-relaxed">
            "We replaced four paper forms in an afternoon. The signed PDF lands
            in my inbox before the tenant has left the property."
          </blockquote>
          <div>
            <p className="text-sm text-white/70">Principal</p>
            <p className="text-sm text-white/50">Suburban real estate agency</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TextField({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-wider text-ink/50">
        {label}
      </label>
      <input
        {...props}
        className="mt-1 w-full rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm focus:border-tick focus:outline-none"
      />
    </div>
  );
}
