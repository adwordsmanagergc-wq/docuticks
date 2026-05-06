import Link from "next/link";
import { headers } from "next/headers";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { ShareCard } from "@/components/share/ShareCard";
import { getMyForm } from "@/lib/forms";

export default async function ShareFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const doc = await getMyForm(id);

  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "docuticks.com";
  const proto = h.get("x-forwarded-proto") || "https";
  const origin = `${proto}://${host}`;
  const link = doc ? `${origin}/f/${doc.id}` : "";

  return (
    <AppShell pageTitle="Share form">
      <Link
        href={`/forms/${id}`}
        className="inline-flex items-center gap-2 text-sm text-ink/60 hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> Back to editor
      </Link>

      {doc ? (
        <div className="mt-6">
          <ShareCard formId={doc.id} formName={doc.name} link={link} />
        </div>
      ) : (
        <div className="card mt-6 p-10 text-center text-ink/60">
          Form not found.
        </div>
      )}
    </AppShell>
  );
}
