"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Files, Inbox, Send, Plus } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { formStore, submissionStore } from "@/lib/store";
import type { FormDoc, SubmissionDoc } from "@/lib/types";
import { downloadDataUrl } from "@/lib/fillPdf";

export default function DashboardPage() {
  const [forms, setForms] = useState<FormDoc[]>([]);
  const [subs, setSubs] = useState<SubmissionDoc[]>([]);

  useEffect(() => {
    setForms(formStore.list());
    setSubs(submissionStore.list());
  }, []);

  const recent = subs.slice(0, 5);

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
        <Stat
          icon={Files}
          label="Active forms"
          value={`${forms.length} / 5`}
          hint="Entry plan"
        />
        <Stat
          icon={Send}
          label="Submissions"
          value={String(subs.length)}
          hint={subs.length ? "All time" : "Nothing yet"}
        />
        <Stat
          icon={Inbox}
          label="Awaiting review"
          value="0"
          hint="Nothing in your inbox"
        />
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
          {recent.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-ink/55">
              Nothing here yet. Upload a form, share the link, complete it as a
              signer, and it'll appear here.
            </div>
          ) : (
            <ul className="divide-y divide-ink/10">
              {recent.map((row) => (
                <li
                  key={row.id}
                  className="flex items-center justify-between gap-4 px-6 py-4"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">
                      {row.formName}
                    </p>
                    <p className="truncate font-mono text-xs text-ink/55">
                      {row.filename}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-right">
                    <div>
                      <p className="text-sm text-ink">{row.signerName}</p>
                      <p className="text-xs text-ink/50">
                        {new Date(row.submittedAt).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        downloadDataUrl(row.pdfDataUrl, row.filename)
                      }
                      className="btn-secondary text-xs"
                    >
                      PDF
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
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
