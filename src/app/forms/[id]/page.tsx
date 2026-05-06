import Link from "next/link";
import { AppShell } from "@/components/app/AppShell";
import { FormEditor } from "@/components/editor/FormEditor";
import { getMyForm } from "@/lib/forms";

export default async function FormEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const doc = await getMyForm(id);

  if (!doc) {
    return (
      <AppShell pageTitle="Form editor">
        <div className="card p-10 text-center">
          <p className="text-ink/70">
            We couldn't find that form, or it doesn't belong to your account.
          </p>
          <Link href="/forms/new" className="btn-tick mt-6 inline-flex">
            Upload a new form
          </Link>
        </div>
      </AppShell>
    );
  }

  return <FormEditor initial={doc} />;
}
