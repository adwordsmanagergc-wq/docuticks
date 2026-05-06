import Link from "next/link";
import { FileText, Plus } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { FormRow } from "@/components/forms/FormRow";
import { getMyForms } from "@/lib/forms";

export const metadata = { title: "Forms" };

export default async function FormsPage() {
  const forms = await getMyForms();

  return (
    <AppShell
      pageTitle="Forms"
      pageActions={
        <Link href="/forms/new" className="btn-tick text-sm">
          <Plus className="h-4 w-4" /> New form
        </Link>
      }
    >
      {forms.length === 0 ? (
        <div className="card p-16 text-center">
          <FileText className="mx-auto h-10 w-10 text-ink/30" strokeWidth={1.4} />
          <h2 className="mt-4 text-lg font-semibold text-ink">No forms yet.</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink/60">
            Upload a scanned PDF to convert it into a digital tick-and-sign
            form.
          </p>
          <Link href="/forms/new" className="btn-tick mt-6 inline-flex">
            <Plus className="h-4 w-4" /> Upload your first form
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-paper text-left text-xs uppercase tracking-wider text-ink/50">
              <tr>
                <th className="px-6 py-3">Form name</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Fields</th>
                <th className="px-6 py-3">Pages</th>
                <th className="px-6 py-3">Updated</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {forms.map((f) => (
                <FormRow key={f.id} form={f} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}
