"use client";

import { useEffect, useState } from "react";
import { Download, Inbox } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { submissionStore } from "@/lib/store";
import { downloadDataUrl } from "@/lib/fillPdf";
import type { SubmissionDoc } from "@/lib/types";

export default function SubmissionsPage() {
  const [rows, setRows] = useState<SubmissionDoc[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setRows(submissionStore.list());
    setLoaded(true);
  }, []);

  return (
    <AppShell pageTitle="Submissions">
      {loaded && rows.length === 0 ? (
        <div className="card p-16 text-center">
          <Inbox className="mx-auto h-10 w-10 text-ink/30" strokeWidth={1.4} />
          <h2 className="mt-4 text-lg font-semibold text-ink">
            No submissions yet.
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink/60">
            When someone completes one of your forms, the auto-named PDF lands
            here.
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-ink/10 px-6 py-4">
            <p className="text-sm text-ink/60">
              {rows.length} submission{rows.length === 1 ? "" : "s"}
            </p>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-paper text-left text-xs uppercase tracking-wider text-ink/50">
              <tr>
                <th className="px-6 py-3">Form</th>
                <th className="px-6 py-3">Signer</th>
                <th className="px-6 py-3">Submitted</th>
                <th className="px-6 py-3">File</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-paper/60">
                  <td className="px-6 py-4 font-medium text-ink">
                    {r.formName}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-ink">{r.signerName}</p>
                    {r.signerEmail ? (
                      <p className="text-xs text-ink/55">{r.signerEmail}</p>
                    ) : null}
                  </td>
                  <td className="px-6 py-4 text-ink/65">
                    {new Date(r.submittedAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-ink/65">
                    {r.filename}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => downloadDataUrl(r.pdfDataUrl, r.filename)}
                      className="btn-secondary text-xs"
                    >
                      <Download className="h-3.5 w-3.5" /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}
