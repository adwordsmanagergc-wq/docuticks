"use client";

import { useState } from "react";
import { LogOut, UserCircle } from "lucide-react";
import Link from "next/link";
import { logoutAction } from "@/lib/actions";

interface Props {
  name?: string | null;
  email?: string | null;
}

function initials(input?: string | null) {
  if (!input) return "?";
  const parts = input.split(/[ @.]+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function UserMenu({ name, email }: Props) {
  const [open, setOpen] = useState(false);
  const display = name || email || "Account";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-sm font-medium text-white"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {initials(name || email)}
      </button>
      {open ? (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div
            role="menu"
            className="absolute right-0 z-40 mt-2 w-56 overflow-hidden rounded-xl border border-ink/10 bg-white shadow-soft"
          >
            <div className="border-b border-ink/10 px-4 py-3">
              <p className="truncate text-sm font-medium text-ink">{display}</p>
              {email && name ? (
                <p className="truncate text-xs text-ink/55">{email}</p>
              ) : null}
            </div>
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink/75 hover:bg-paper"
            >
              <UserCircle className="h-4 w-4" /> Account
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-ink/75 hover:bg-paper"
              >
                <LogOut className="h-4 w-4" /> Log out
              </button>
            </form>
          </div>
        </>
      ) : null}
    </div>
  );
}
