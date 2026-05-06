"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Logo } from "./Logo";

const NAV = [
  { label: "Features", href: "/features" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Use cases", href: "/use-cases" },
  { label: "Pricing", href: "/pricing" },
  { label: "Security", href: "/security" },
];

export function Header() {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated" && !!session;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-ink/5 bg-white/80 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-ink/70 transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <Link href="/dashboard" className="btn-primary">
              Open dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden text-sm font-medium text-ink/70 hover:text-ink md:inline"
              >
                Log in
              </Link>
              <Link href="/signup" className="btn-primary">
                Start free trial
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
