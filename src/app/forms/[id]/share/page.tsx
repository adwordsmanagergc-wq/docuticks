"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Copy, Link2, Mail, Check } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { formStore } from "@/lib/store";
import type { FormDoc } from "@/lib/types";

export default function ShareFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [doc, setDoc] = useState<FormDoc | null | undefined>(undefined);
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setDoc(formStore.get(id) ?? null);
    if (typeof window !== "undefined") setOrigin(window.location.origin);
  }, [id]);

  const link = doc ? `${origin}/f/${doc.id}` : "";

  return (
    <AppShell pageTitle="Share form">
      <Link
        href={`/forms/${id}`}
        className="inline-flex items-center gap-2 text-sm text-ink/60 hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> Back to editor
      </Link>

      {doc ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="card p-7">
            <h2 className="font-semibold text-ink">Shareable link</h2>
            <p className="mt-1 text-sm text-ink/60">
              Anyone with this link can complete the form on any device.
            </p>
            <div className="mt-5 flex items-center gap-2 rounded-lg border border-ink/15 bg-paper px-3 py-2.5 text-sm">
              <Link2 className="h-4 w-4 text-ink/40" />
              <span className="flex-1 truncate font-mono text-xs text-ink">
                {link}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(link);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
                className="btn-secondary text-xs"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <Link
              href={`/f/${doc.id}`}
              target="_blank"
              className="mt-4 inline-flex items-center gap-1 text-sm text-tick hover:underline"
            >
              Open the signer view →
            </Link>

            <div className="mt-6 flex items-center justify-between rounded-lg border border-ink/10 p-3">
              <div className="flex items-center gap-2 text-sm text-ink/70">
                <Calendar className="h-4 w-4" /> Link expiry
              </div>
              <select className="rounded-md border border-ink/15 bg-white px-2 py-1 text-xs">
                <option>Never</option>
                <option>7 days</option>
                <option>30 days</option>
                <option>90 days</option>
              </select>
            </div>
          </div>

          <div className="card p-7">
            <h2 className="font-semibold text-ink">Email this form</h2>
            <p className="mt-1 text-sm text-ink/60">
              In production this is sent via Postmark. The compose UI is below.
            </p>
            <div className="mt-5 space-y-3">
              <Field label="To" placeholder="client@example.com" />
              <Field
                label="Subject"
                defaultValue={`Please complete: ${doc.name}`}
              />
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-ink/50">
                  Message
                </label>
                <textarea
                  rows={4}
                  defaultValue={`Hi — please complete the attached form (${doc.name}). It only takes a few minutes on your phone.`}
                  className="mt-1 w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm focus:border-tick focus:outline-none"
                />
              </div>
              <button className="btn-tick w-full text-sm">
                <Mail className="h-4 w-4" /> Send email
              </button>
            </div>
          </div>
        </div>
      ) : doc === null ? (
        <div className="card mt-6 p-10 text-center text-ink/60">
          Form not found in this browser.
        </div>
      ) : null}
    </AppShell>
  );
}

function Field({
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
        className="mt-1 w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm focus:border-tick focus:outline-none"
      />
    </div>
  );
}
