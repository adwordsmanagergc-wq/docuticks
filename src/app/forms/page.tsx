"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, MoreHorizontal, FileText } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { formStore } from "@/lib/store";
import type { FormDoc } from "@/lib/types";

export default function FormsPage() {
  const [forms, setForms] = useState<FormDoc[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setForms(formStore.list());
    setLoaded(true);
  }, []);

  return (
    <AppShell
      pageTitle="Forms"
      pageActions={
        <Link href="/forms/new" className="btn-tick text-sm">
          <Plus className="h-4 w-4" /> New form
        </Link>
      }
    >
      {loaded && forms.length === 0 ? (
        <EmptyState />
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
                <tr key={f.id} className="hover:bg-paper/60">
                  <td className="px-6 py-4">
                    <Link
                      href={`/forms/${f.id}`}
                      className="font-medium text-ink hover:underline"
                    >
                      {f.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`chip ${
                        f.status === "published"
                          ? "border-tick/30 bg-tick/10 text-tick"
                          : "bg-paper text-ink/60"
                      }`}
                    >
                      {f.status === "published" ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-ink/70">{f.fields.length}</td>
                  <td className="px-6 py-4 text-ink/70">{f.pageCount}</td>
                  <td className="px-6 py-4 text-ink/55">
                    {new Date(f.updatedAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${f.name}"?`)) {
                          formStore.remove(f.id);
                          setForms(formStore.list());
                        }
                      }}
                      className="text-ink/40 hover:text-red-600"
                    >
                      <MoreHorizontal className="h-5 w-5" />
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

function EmptyState() {
  return (
    <div className="card p-16 text-center">
      <FileText className="mx-auto h-10 w-10 text-ink/30" strokeWidth={1.4} />
      <h2 className="mt-4 text-lg font-semibold text-ink">
        No forms yet.
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink/60">
        Upload a scanned PDF to convert it into a digital tick-and-sign form.
        Forms in this demo are stored in your browser only.
      </p>
      <Link href="/forms/new" className="btn-tick mt-6 inline-flex">
        <Plus className="h-4 w-4" /> Upload your first form
      </Link>
    </div>
  );
}
