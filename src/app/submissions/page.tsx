import { Inbox } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { getMySubmissions } from "@/lib/forms";

export const metadata = { title: "Submissions" };

export default async function SubmissionsPage() {
  const rows = await getMySubmissions();

  return (
    <AppShell pageTitle="Submissions">
      {rows.length === 0 ? (
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
                    <a
                      href={`/api/submissions/${r.id}/pdf`}
                      className="btn-secondary text-xs"
                    >
                      Download PDF
                    </a>
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
