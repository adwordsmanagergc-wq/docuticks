"use client";

import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal } from "lucide-react";
import { deleteFormAction } from "@/lib/actions";
import type { FormDoc } from "@/lib/types";

export function FormRow({ form }: { form: FormDoc }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const updated = new Date(form.updatedAt).toLocaleString();

  return (
    <tr className="hover:bg-paper/60">
      <td className="px-6 py-4">
        <Link
          href={`/forms/${form.id}`}
          className="font-medium text-ink hover:underline"
        >
          {form.name}
        </Link>
      </td>
      <td className="px-6 py-4">
        <span
          className={`chip ${
            form.status === "published"
              ? "border-tick/30 bg-tick/10 text-tick"
              : "bg-paper text-ink/60"
          }`}
        >
          {form.status === "published" ? "Published" : "Draft"}
        </span>
      </td>
      <td className="px-6 py-4 text-ink/70">{form.fields.length}</td>
      <td className="px-6 py-4 text-ink/70">{form.pageCount}</td>
      <td className="px-6 py-4 text-ink/55">{updated}</td>
      <td className="px-6 py-4 text-right">
        <button
          disabled={pending}
          onClick={() => {
            if (!confirm(`Delete "${form.name}"?`)) return;
            start(async () => {
              await deleteFormAction(form.id);
              router.refresh();
            });
          }}
          className="text-ink/40 hover:text-red-600 disabled:opacity-50"
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </td>
    </tr>
  );
}
