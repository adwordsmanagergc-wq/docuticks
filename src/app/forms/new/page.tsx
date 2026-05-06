"use client";

import { UploadCloud, FileText, ImageIcon, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";

export default function NewFormPage() {
  return (
    <AppShell pageTitle="New form">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-8 lg:col-span-2">
          <h2 className="text-lg font-semibold text-ink">
            Upload your scanned document
          </h2>
          <p className="mt-1 text-sm text-ink/60">
            PDF, JPG or PNG up to 25 MB. We'll render every page so you can
            place fields directly on top.
          </p>
          <label className="mt-6 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-ink/15 bg-paper py-16 text-center transition-colors hover:border-tick">
            <UploadCloud className="h-10 w-10 text-ink/40" strokeWidth={1.4} />
            <p className="text-sm font-medium text-ink">
              Drop your file here, or click to browse
            </p>
            <p className="text-xs text-ink/50">
              We accept PDF, JPG, PNG. 25 MB max.
            </p>
            <input type="file" accept=".pdf,image/*" className="hidden" />
          </label>
          <div className="mt-4 flex items-center gap-2 text-xs text-ink/55">
            <Sparkles className="h-3.5 w-3.5 text-tick" />
            Optional: we'll OCR the page and suggest field positions.
          </div>
        </div>
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-ink">Or start from a template</h3>
          <p className="mt-1 text-xs text-ink/60">
            Pre-built forms for the most common workflows.
          </p>
          <div className="mt-5 space-y-3">
            {[
              { icon: FileText, name: "Tenancy Application", industry: "Real estate" },
              { icon: FileText, name: "New Patient Intake", industry: "Allied health" },
              { icon: FileText, name: "Quote Acceptance", industry: "Trades" },
              { icon: ImageIcon, name: "Excursion Permission", industry: "Education" },
            ].map((t) => (
              <button
                key={t.name}
                type="button"
                className="flex w-full items-center gap-3 rounded-lg border border-ink/10 p-3 text-left hover:border-tick"
              >
                <t.icon className="h-4 w-4 text-ink/50" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">
                    {t.name}
                  </p>
                  <p className="text-xs text-ink/50">{t.industry}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
