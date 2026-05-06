import Link from "next/link";
import { ArrowUpRight, Files, Inbox, Send, Plus } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";

export const metadata = { title: "Dashboard" };

const RECENT = [
  {
    form: "Tenancy Application",
    signer: "Jane Smith",
    when: "2 minutes ago",
    file: "Tenancy-Application_Jane-Smith_2026-05-06.pdf",
  },
  {
    form: "Listing Authority",
    signer: "Marcus Reid",
    when: "1 hour ago",
    file: "Listing-Authority_Marcus-Reid_2026-05-06.pdf",
  },
  {
    form: "Condition Report",
    signer: "Olivia Tran",
    when: "Yesterday",
    file: "Condition-Report_Olivia-Tran_2026-05-05.pdf",
  },
  {
    form: "Tenancy Application",
    signer: "Liam Chen",
    when: "Yesterday",
    file: "Tenancy-Application_Liam-Chen_2026-05-05.pdf",
  },
  {
    form: "Repair Authorisation",
    signer: "Aisha Patel",
    when: "2 days ago",
    file: "Repair-Authorisation_Aisha-Patel_2026-05-04.pdf",
  },
];

export default function DashboardPage() {
  return (
    <AppShell
      pageTitle="Dashboard"
      pageActions={
        <Link href="/forms/new" className="btn-tick text-sm">
          <Plus className="h-4 w-4" /> New form
        </Link>
      }
    >
      <div className="grid gap-4 md:grid-cols-3">
        <Stat icon={Files} label="Active forms" value="3 / 5" hint="Entry plan" />
        <Stat icon={Send} label="Submissions this month" value="148" hint="+24 from last week" />
        <Stat icon={Inbox} label="Awaiting your review" value="0" hint="Nothing in your inbox" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between border-b border-ink/10 px-6 py-4">
            <h2 className="font-semibold text-ink">Recent submissions</h2>
            <Link
              href="/submissions"
              className="text-sm text-ink/60 hover:text-ink"
            >
              View all →
            </Link>
          </div>
          <ul className="divide-y divide-ink/10">
            {RECENT.map((row) => (
              <li
                key={row.file}
                className="flex items-center justify-between gap-4 px-6 py-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">
                    {row.form}
                  </p>
                  <p className="truncate font-mono text-xs text-ink/55">
                    {row.file}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-ink">{row.signer}</p>
                  <p className="text-xs text-ink/50">{row.when}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold text-ink">Quick actions</h2>
          <div className="mt-4 space-y-3">
            <Link
              href="/forms/new"
              className="flex items-center justify-between rounded-lg border border-ink/10 p-3 hover:border-tick"
            >
              <span className="text-sm font-medium text-ink">
                Upload a new form
              </span>
              <ArrowUpRight className="h-4 w-4 text-ink/50" />
            </Link>
            <Link
              href="/forms"
              className="flex items-center justify-between rounded-lg border border-ink/10 p-3 hover:border-tick"
            >
              <span className="text-sm font-medium text-ink">
                Send an existing form
              </span>
              <ArrowUpRight className="h-4 w-4 text-ink/50" />
            </Link>
            <Link
              href="/account"
              className="flex items-center justify-between rounded-lg border border-ink/10 p-3 hover:border-tick"
            >
              <span className="text-sm font-medium text-ink">
                Update your branding
              </span>
              <ArrowUpRight className="h-4 w-4 text-ink/50" />
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-ink/50">
          {label}
        </span>
        <Icon className="h-4 w-4 text-ink/40" />
      </div>
      <p className="mt-3 text-3xl font-semibold text-ink">{value}</p>
      <p className="mt-1 text-xs text-ink/55">{hint}</p>
    </div>
  );
}
