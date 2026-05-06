import { Download, Send } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";

export const metadata = { title: "Submissions" };

const ROWS = [
  {
    form: "Tenancy Application",
    signer: "Jane Smith",
    email: "jane@smith.example",
    submitted: "6 May 2026, 10:14",
    file: "Tenancy-Application_Jane-Smith_2026-05-06.pdf",
  },
  {
    form: "Listing Authority",
    signer: "Marcus Reid",
    email: "marcus@reid.example",
    submitted: "6 May 2026, 09:01",
    file: "Listing-Authority_Marcus-Reid_2026-05-06.pdf",
  },
  {
    form: "Condition Report",
    signer: "Olivia Tran",
    email: "o.tran@example.com",
    submitted: "5 May 2026, 16:45",
    file: "Condition-Report_Olivia-Tran_2026-05-05.pdf",
  },
  {
    form: "Tenancy Application",
    signer: "Liam Chen",
    email: "liam@chen.example",
    submitted: "5 May 2026, 11:22",
    file: "Tenancy-Application_Liam-Chen_2026-05-05.pdf",
  },
  {
    form: "Repair Authorisation",
    signer: "Aisha Patel",
    email: "aisha@patel.example",
    submitted: "4 May 2026, 17:08",
    file: "Repair-Authorisation_Aisha-Patel_2026-05-04.pdf",
  },
];

export default function SubmissionsPage() {
  return (
    <AppShell pageTitle="Submissions">
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-4">
          <p className="text-sm text-ink/60">
            {ROWS.length} submissions · last 7 days
          </p>
          <button className="btn-secondary text-sm">
            <Download className="h-4 w-4" /> Export CSV
          </button>
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
            {ROWS.map((r) => (
              <tr key={r.file} className="hover:bg-paper/60">
                <td className="px-6 py-4 font-medium text-ink">{r.form}</td>
                <td className="px-6 py-4">
                  <p className="text-ink">{r.signer}</p>
                  <p className="text-xs text-ink/55">{r.email}</p>
                </td>
                <td className="px-6 py-4 text-ink/65">{r.submitted}</td>
                <td className="px-6 py-4 font-mono text-xs text-ink/65">
                  {r.file}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="inline-flex items-center gap-2">
                    <button className="btn-secondary text-xs">
                      <Download className="h-3.5 w-3.5" /> PDF
                    </button>
                    <button className="btn-secondary text-xs">
                      <Send className="h-3.5 w-3.5" /> Re-send
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
