import { Download, Check } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";

export const metadata = { title: "Billing" };

const INVOICES = [
  { id: "INV-1042", date: "1 May 2026", amount: "$49.00 AUD", status: "Paid" },
  { id: "INV-1031", date: "1 Apr 2026", amount: "$49.00 AUD", status: "Paid" },
  { id: "INV-1019", date: "1 Mar 2026", amount: "$49.00 AUD", status: "Paid" },
];

export default function BillingPage() {
  return (
    <AppShell pageTitle="Billing">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <h2 className="font-semibold text-ink">Current plan</h2>
          <div className="mt-4 flex items-center justify-between rounded-xl border border-ink/10 bg-paper p-5">
            <div>
              <p className="text-2xl font-semibold text-ink">Entry</p>
              <p className="mt-1 text-sm text-ink/60">
                $49 / month AUD · renews 1 June 2026
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn-secondary text-sm">Cancel plan</button>
              <button className="btn-tick text-sm">Upgrade to Intermediate</button>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              "1–5 active forms",
              "Unlimited submissions",
              "Auto-named PDFs",
              "Branded forms",
              "Australian hosting",
              "Email support",
            ].map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm text-ink/75">
                <Check className="h-4 w-4 text-tick" /> {f}
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold text-ink">Payment method</h2>
          <div className="mt-4 rounded-lg border border-ink/10 p-4">
            <p className="text-sm font-medium text-ink">Visa ending 4242</p>
            <p className="mt-1 text-xs text-ink/55">Expires 04 / 2028</p>
          </div>
          <button className="btn-secondary mt-4 w-full text-sm">
            Update payment method
          </button>
        </div>
      </div>

      <div className="card mt-6 overflow-hidden">
        <div className="border-b border-ink/10 px-6 py-4">
          <h2 className="font-semibold text-ink">Invoices</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-paper text-left text-xs uppercase tracking-wider text-ink/50">
            <tr>
              <th className="px-6 py-3">Invoice</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {INVOICES.map((inv) => (
              <tr key={inv.id}>
                <td className="px-6 py-4 font-mono text-xs text-ink">
                  {inv.id}
                </td>
                <td className="px-6 py-4 text-ink/65">{inv.date}</td>
                <td className="px-6 py-4 text-ink">{inv.amount}</td>
                <td className="px-6 py-4">
                  <span className="chip border-tick/30 bg-tick/10 text-tick">
                    {inv.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="btn-secondary text-xs">
                    <Download className="h-3.5 w-3.5" /> PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
