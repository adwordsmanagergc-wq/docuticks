import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2 font-display text-lg font-semibold tracking-tight text-ink ${className}`}
    >
      <LogoMark />
      <span>DocuTicks</span>
    </Link>
  );
}

export function LogoMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-lg bg-ink text-white shadow-soft ${className}`}
      aria-hidden
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 text-tick"
      >
        <path d="M5 12.5l4 4 10-10" />
      </svg>
    </span>
  );
}
