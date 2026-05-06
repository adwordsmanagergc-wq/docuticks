"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Files,
  Inbox,
  CreditCard,
  Users,
  UserCircle,
  Plus,
  Search,
} from "lucide-react";
import { Logo } from "../Logo";
import { UserMenu } from "../UserMenu";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/forms", label: "Forms", icon: Files },
  { href: "/submissions", label: "Submissions", icon: Inbox },
  { href: "/team", label: "Team", icon: Users },
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/account", label: "Account", icon: UserCircle },
];

export function AppShell({
  children,
  pageTitle,
  pageActions,
}: {
  children: ReactNode;
  pageTitle: string;
  pageActions?: ReactNode;
}) {
  const { data: session } = useSession();
  return (
    <div className="flex min-h-screen bg-paper">
      <aside className="hidden w-64 shrink-0 flex-col justify-between border-r border-ink/10 bg-white px-4 py-5 lg:flex">
        <div>
          <div className="px-2">
            <Logo />
          </div>
          <Link
            href="/forms/new"
            className="btn-tick mt-6 w-full justify-start"
          >
            <Plus className="h-4 w-4" /> New form
          </Link>
          <nav className="mt-6 space-y-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-ink/70 hover:bg-paper hover:text-ink"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="rounded-xl border border-ink/10 bg-paper p-4 text-xs">
          <p className="font-semibold text-ink">Entry plan</p>
          <p className="mt-1 text-ink/60">14-day free trial</p>
          <Link
            href="/billing"
            className="mt-3 inline-flex items-center gap-1 text-tick hover:underline"
          >
            Manage plan →
          </Link>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-ink/10 bg-white px-6">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-ink">{pageTitle}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-lg border border-ink/10 bg-paper px-3 py-1.5 text-sm text-ink/60 md:flex">
              <Search className="h-4 w-4" />
              <input
                placeholder="Search forms or submissions"
                className="bg-transparent placeholder:text-ink/40 focus:outline-none"
              />
            </div>
            {pageActions}
            <UserMenu
              name={session?.user?.name ?? null}
              email={session?.user?.email ?? null}
            />
          </div>
        </header>
        <main className="flex-1 p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
