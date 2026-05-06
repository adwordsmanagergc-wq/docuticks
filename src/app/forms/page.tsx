import Link from "next/link";
import { Plus, MoreHorizontal } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";

export const metadata = { title: "Forms" };

const FORMS = [
  {
    name: "Tenancy Application",
    status: "Published",
    submissions: 86,
    updated: "Today",
  },
  {
    name: "Listing Authority",
    status: "Published",
    submissions: 32,
    updated: "Yesterday",
  },
  {
    name: "Condition Report",
    status: "Published",
    submissions: 18,
    updated: "3 days ago",
  },
  {
    name: "Repair Authorisation",
    status: "Draft",
    submissions: 0,
    updated: "Last week",
  },
];

export default function FormsPage() {
  return (
    <AppShell
      pageTitle="Forms"
      pageActions={
        <Link href="/forms/new" className="btn-tick text-sm">
          <Plus className="h-4 w-4" /> New form
        </Link>
      }
    >
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-paper text-left text-xs uppercase tracking-wider text-ink/50">
            <tr>
              <th className="px-6 py-3">Form name</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Submissions</th>
              <th className="px-6 py-3">Updated</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {FORMS.map((f, i) => (
              <tr key={f.name} className="hover:bg-paper/60">
                <td className="px-6 py-4">
                  <Link
                    href={`/forms/${i + 1}`}
                    className="font-medium text-ink hover:underline"
                  >
                    {f.name}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`chip ${
                      f.status === "Published"
                        ? "border-tick/30 bg-tick/10 text-tick"
                        : "bg-paper text-ink/60"
                    }`}
                  >
                    {f.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-ink/70">{f.submissions}</td>
                <td className="px-6 py-4 text-ink/55">{f.updated}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-ink/40 hover:text-ink">
                    <MoreHorizontal className="h-5 w-5" />
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
