import Link from "next/link";
import { Logo } from "@/components/Logo";
import { SignerView } from "@/components/signer/SignerView";
import { getPublicForm } from "@/lib/forms";

export const dynamic = "force-dynamic";

export default async function SignerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const doc = await getPublicForm(id);

  if (!doc) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper text-ink/60">
        <div className="text-center">
          <Logo />
          <p className="mt-6">This form link is no longer available.</p>
          <Link href="/" className="link-muted mt-4 inline-block text-sm">
            Back to docuticks.com →
          </Link>
        </div>
      </div>
    );
  }

  return <SignerView doc={doc} />;
}
